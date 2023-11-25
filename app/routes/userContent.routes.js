module.exports = (app) => {
  const express = require("express");
  const userContentController = require("../controllers/userContent.controller");
  const router = express.Router();

  router.post("/create", userContentController.createUserContent);
  router.get("/:user_id", userContentController.getUserContent);
  router.delete("/:content_id", userContentController.deleteUserContent);

  app.use("/api/user-content", router);
};
