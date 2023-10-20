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
  this.role = user.role;
  this.registration_date = user.registration_date;
  this.last_login = user.last_login;
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
  console.log("newUser: ", newUser);
  sql.query("INSERT INTO user SET ?", newUser, (err, res) => {
    if (err) {
      console.log("Query error:", err);
      result(err, null);
      return;
    }
    const payload = {
      id: res.insertId,
      ...newUser,
    };

    const token = jwt.sign(payload, secretKey.secret, {
      expiresIn: expireTime,
    });
    console.log("user model", payload);
    const response = {
      id: res.insertId,
      ...newUser,
      accessToken: token,
    };

    result(null, response);

    console.log("Created user:", response);
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
              const userData = {
                user_id: res[0].user_id,
                username: res[0].username,
                email: res[0].email,
                first_name: res[0].first_name,
                last_name: res[0].last_name,
                role: res[0].role,
              };

              const token = jwt.sign(userData, secretKey.secret, {
                expiresIn: expireTime,
              });

              console.log("Login success. Token:", token);
              result(null, {
                user: userData,
                accessToken: token,
              });
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
