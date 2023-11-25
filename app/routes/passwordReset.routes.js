module.exports = (app) => {
  const express = require("express");
  const passwordResetController = require("../controllers/passwordReset.controller");
  const router = express.Router();

  router.post("/create", passwordResetController.createResetToken);
  router.get("/:token", passwordResetController.getResetToken);
  router.delete("/:token", passwordResetController.deleteResetToken);
  router.post("/reset", passwordResetController.resetPassword);

  app.use("/api/password-reset", router);
};
