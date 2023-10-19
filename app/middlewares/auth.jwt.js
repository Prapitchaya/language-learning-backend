const jwt = require("jsonwebtoken");
const secretKey = require("../config/jwt.config");
const sql = require("../models/db");

const verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({ message: "No token provided" });
  }

  jwt.verify(token, secretKey.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    const id = decoded.id;
    sql.query("SELECT * FROM `user` WHERE user_id = ?", [id], (err, res) => {
      if (err) {
        console.log("Query error:", err);
        result(err, null);
        return;
      }

      req.user = res;
      result(null, res);
    });
    console.log("auth", req.user);
    console.log("auth", id);
    next();
  });
};

module.exports = verifyToken;
