const router = require("express").Router();
const { register, login } = require("../validation/validation");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

//USER REGISTRATION
router.post("/register", async (req, res) => {
  //Validation
  const { error } = register.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //Get user data
  const { nickname, email, password } = req.body;

  //Check if user already exists
  const emailExist = await User.findOne({ email: email });
  if (emailExist) return res.status(400).send("Email already exist");

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
    res.send({ user: user.id });
  } catch (err) {
    res.status(400).send(err);
  }
});

//LOG IN
router.post("/login", async (req, res) => {
  //Validation
  const { error } = login.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  //Get user data
  const { email, password } = req.body;

  //Check if user already exists
  const user = await User.findOne({ email: email });
  if (!user) return res.status(400).send("User does not exist");
  //Password verification
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password");

  //Create and assign a token
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
  res.header("auth", token).send(token);
});

module.exports = router;
