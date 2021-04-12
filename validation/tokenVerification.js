const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("auth");
  if (!token) return res.status(401).send("Access denied");

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(400).send("Error");
    }

    req.userId = decoded._id;
    next();
  });
};
