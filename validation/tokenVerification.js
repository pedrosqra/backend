const jwt = require("jsonwebtoken");
const { loggedOut } = require("../controllers/AuthController");

module.exports = function (req, res, next) {
  const authHeader = req.headers.auth;
  if (!authHeader) {
    return res.status(401).send({ error: "Access denied. No token provided" });
  }

  if (loggedOut.includes(authHeader)) {
    return res.status(400).send({ error: "Usuário realizou log out" });
  }

  const parts = authHeader.split(" ");

  if (!parts.length === 2) {
    return res.status(401).send({ error: "Invalid token." });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).send({ error: "Malformed token." });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(400).send("Error");
    }

    req.userId = decoded._id;
    next();
  });
};
