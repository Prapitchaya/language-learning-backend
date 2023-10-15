const sql = require("./db");
const jwt = require("jsonwebtoken");
const secretKey = require("../config/jwt.config");
const bcrypt = require("bcryptjs");

const expireTime = "2h";

const User = function (user) {
  this.username = user.username;
  this.password = user.password;
  this.email = user.email;
  this.first_name = user.first_name;
  this.last_name = user.last_name;
  this.registration_date = user.registration_date;
  this.last_login = user.last_login;
  this.role = user.role;
};

User.checkUsername = (username, result) => {
  sql.query("SELECT * FROM user WHERE username = ?", [username], (err, res) => {
    if (err) {
      console.log(`Error: ${err}`);
      result(err, null);
      return;
    }
    if (res.length) {
      console.log(`Found username: ${res[0]}`);
      result(null, res[0]);
    } else {
      result({ kind: "not_found" }, null);
    }
  });
};

User.createUser = (newUser, result) => {
  sql.query("INSERT INTO user SET ?", newUser, (err, res) => {
    if (err) {
      console.log("Query error:", err);
      result(err, null);
      return;
    }
    const token = jwt.sign({ id: res.insertId }, secretKey.secret, {
      expiresIn: expireTime,
    });
    result(null, { id: res.insertId, ...newUser, accessToken: token });
    console.log("Created user:", {
      id: res.insertId,
      ...newUser,
      accessToken: token,
    });
  });
};

User.loginUser = (account, result) => {
  sql.query(
    "SELECT * FROM user WHERE username = ?",
    [account.username],
    (err, res) => {
      if (err) {
        console.log("Query error:", err);
        result(err, null);
        return;
      }
      if (res.length) {
        bcrypt.compare(
          account.password,
          res[0].password,
          (compareErr, match) => {
            if (compareErr) {
              console.log("Password comparison error:", compareErr);
              result(compareErr, null);
              return;
            }
            if (match) {
              const token = jwt.sign({ id: res[0].user_id }, secretKey.secret, {
                expiresIn: expireTime,
              });
              console.log("Login success. Token:", token);
              res[0].accessToken = token;
              result(null, res[0]);
            } else {
              console.log("Password does not match");
              result({ kind: "invalid_pass" }, null);
            }
          }
        );
      } else {
        result({ kind: "not_found" }, null);
      }
    }
  );
};

User.getAllUsers = (result) => {
  sql.query("SELECT * FROM user", (err, res) => {
    if (err) {
      console.log("Query error:", err);
      result(err, null);
      return;
    }
    result(null, res);
  });
};

User.updateUser = (id, data, result) => {
  sql.query(
    "UPDATE user SET first_name = ?, last_name = ?, email = ? WHERE user_id = ?",
    [data.first_name, data.last_name, data.email, id],
    (err, res) => {
      if (err) {
        console.log("Error: " + err);
        result(err, null);
        return;
      }
      if (res.affectedRows === 0) {
        result({ kind: "not_found" }, null);
        return;
      }
      console.log("Update user: " + { id, ...data });
      result(null, { id, ...data });
    }
  );
};

User.removeUser = (id, result) => {
  sql.query("DELETE FROM user WHERE user_id = ?", [id], (err, res) => {
    if (err) {
      console.log("Query error: " + err);
      result(err, null);
      return;
    }
    if (res.affectedRows === 0) {
      result({ kind: "not_found" }, null);
      return;
    }
    console.log("Deleted user id: " + id);
    result(null, { id });
  });
};

module.exports = User;
