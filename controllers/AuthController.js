const { register, login } = require("../validation/validation");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Task = require("../models/Task");

var loggedOut = [];

module.exports = {
  loggedOut,
  //USER REGISTRATION
  async createUser(req, res) {
    //Validation
    const { error } = register.validate(req.body);
    if (error) return res.status(400).send({ error: error.details[0].message });

    //Get user data
    const { nickname, email, password } = req.body;

    //Check if user already exists
    const emailExist = await User.findOne({ email: email });
    if (emailExist)
      return res.status(400).send({ error: "Email already exists" });

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //User creation
    const user = new User({
      nickname,
      email,
      password: hashedPassword,
    });
    try {
      const savedUser = await user.save();
      res.status(200).send({ user: user.id });
    } catch (err) {
      res.status(400).send({ error: err });
    }
  },

  //USER DELETION
  async deleteUser(req, res) {
    //Validation
    const { error } = login.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Get user data
    const { email, password } = req.body;

    //Check if user already exists
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).send("Usuário não existe.");

    //Password verification
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).send("Email ou senha inválida.");

    //Create and assign a token
    const tasksDelete = await Task.deleteMany({ user: user._id });
    const deleted = await User.deleteOne({ email: email });
    return res.status(200).send({ success: "Conta deletada com sucesso." });
  },

  //LOG IN
  async logUser(req, res) {
    //Validation
    const { error } = login.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Get user data
    const { email, password } = req.body;

    //Check if user already exists
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).send("Usuário não existe.");

    //Password verification
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).send("Email ou senha inválida.");

    //Create and assign a token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.header("auth", token).send({ token: token });
  },

  async logoutUser(req, res) {
    const token = req.headers.auth;

    loggedOut.push(token);

    return res.send({ success: "Log out completo." });
  },
};
