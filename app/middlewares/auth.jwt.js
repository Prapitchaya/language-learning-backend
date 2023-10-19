const jwt = require("jsonwebtoken");
const secretKey = require("../config/jwt.config");

const verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({ message: "No token provided" });
  }

  jwt.verify(token, secretKey.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    req.user = decoded;

    console.log("User info from the JWT payload:", req.user);

    next();
  });
};

module.exports = verifyToken;
