const UserContent = require("../models/userContent.model");

const createUserContent = (req, res) => {
  const { user_id, content_id, content_type, content_text, timestamp } =
    req.body;

  const newUserContent = {
    user_id,
    content_id,
    content_type,
    content_text,
    timestamp,
  };

  UserContent.createUserContent(newUserContent, (err, userContentId) => {
    if (err) {
      res
        .status(500)
        .send({ message: "Failed to create user-generated content" });
    } else {
      res.send({
        message: "User-generated content created successfully",
        userContentId,
      });
    }
  });
};

const getUserContent = (req, res) => {
  const user_id = req.params.user_id;

  UserContent.getUserContent(user_id, (err, userContent) => {
    if (err) {
      res
        .status(500)
        .send({ message: "Failed to retrieve user-generated content" });
    } else {
      res.send(userContent);
    }
  });
};

const deleteUserContent = (req, res) => {
  const content_id = req.params.content_id;

  UserContent.deleteUserContent(content_id, (err, result) => {
    if (err) {
      res
        .status(500)
        .send({ message: "Failed to delete user-generated content" });
    } else {
      res.send({
        message: "User-generated content deleted successfully",
        deletedRows: result,
      });
    }
  });
};

module.exports = {
  createUserContent,
  getUserContent,
  deleteUserContent,
};
