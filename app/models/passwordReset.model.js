const PasswordReset = function (passwordReset) {
  this.user_id = passwordReset.user_id;
  this.token = passwordReset.token;
  this.expiration_date = passwordReset.expiration_date;
};

PasswordReset.createResetToken = (passwordReset, result) => {
  sql.query(
    "INSERT INTO password_reset (user_id, token, expiration_date) VALUES (?, ?, ?)",
    [passwordReset.user_id, passwordReset.token, passwordReset.expiration_date],
    (err, res) => {
      if (err) {
        console.log("Password reset token creation error: ", err);
        result(err, null);
        return;
      }
      console.log("Password reset token created: ", {
        user_id: passwordReset.user_id,
        token: passwordReset.token,
        expiration_date: passwordReset.expiration_date,
        id: res.insertId,
      });
      result(null, res.insertId);
    }
  );
};

PasswordReset.getResetToken = (token, result) => {
  sql.query(
    "SELECT * FROM password_reset WHERE token = ?",
    [token],
    (err, res) => {
      if (err) {
        console.log("Password reset token retrieval error: ", err);
        result(err, null);
        return;
      }
      console.log("Password reset token retrieved for token: ", token);
      result(null, res[0]);
    }
  );
};

PasswordReset.deleteResetToken = (token, result) => {
  sql.query(
    "DELETE FROM password_reset WHERE token = ?",
    [token],
    (err, res) => {
      if (err) {
        console.log("Password reset token deletion error: ", err);
        result(err, null);
        return;
      }
      console.log("Password reset token deleted with token: ", token);
      result(null, res.affectedRows);
    }
  );
};

module.exports = PasswordReset;
