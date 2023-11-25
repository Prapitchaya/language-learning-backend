const PasswordReset = require("../models/passwordReset.model");

const createResetToken = (req, res) => {
  const { user_id, token, expiration_date } = req.body;

  const newPasswordReset = {
    user_id,
    token,
    expiration_date,
  };

  PasswordReset.createResetToken(newPasswordReset, (err, resetTokenId) => {
    if (err) {
      res.status(500).send({ message: "Failed to create the reset token" });
    } else {
      res.send({
        message: "Reset token created successfully",
        resetTokenId,
      });
    }
  });
};

const getResetToken = (req, res) => {
  const token = req.params.token;

  PasswordReset.getResetToken(token, (err, resetToken) => {
    if (err) {
      res.status(500).send({ message: "Failed to retrieve reset token" });
    } else {
      res.send(resetToken);
    }
  });
};

const deleteResetToken = (req, res) => {
  const token = req.params.token;

  PasswordReset.deleteResetToken(token, (err, result) => {
    if (err) {
      res.status(500).send({ message: "Failed to delete the reset token" });
    } else {
      res.send({
        message: "Reset token deleted successfully",
        deletedRows: result,
      });
    }
  });
};
const resetPassword = (req, res) => {
  const { token, newPassword } = req.body;

  PasswordReset.getResetToken(token, (err, resetToken) => {
    if (err) {
      return res
        .status(500)
        .send({ message: "Failed to retrieve reset token" });
    }

    if (!resetToken || new Date(resetToken.expiration_date) < new Date()) {
      return res
        .status(400)
        .send({ message: "Invalid or expired reset token" });
    }

    // Generate a new hashed password
    bcrypt.hash(newPassword, 10, (hashErr, hashedPassword) => {
      if (hashErr) {
        return res
          .status(500)
          .send({ message: "Failed to hash the new password" });
      }

      // Update the user's password
      User.updatePassword(
        resetToken.user_id,
        hashedPassword,
        (updateErr, updateResult) => {
          if (updateErr) {
            return res
              .status(500)
              .send({ message: "Failed to update user password" });
          }

          // Delete the used reset token
          PasswordReset.deleteResetToken(token, (deleteErr, deleteResult) => {
            if (deleteErr) {
              return res
                .status(500)
                .send({ message: "Failed to delete reset token" });
            }

            return res.send({ message: "Password reset successful" });
          });
        }
      );
    });
  });
};

module.exports = {
  createResetToken,
  getResetToken,
  deleteResetToken,
  resetPassword,
};
