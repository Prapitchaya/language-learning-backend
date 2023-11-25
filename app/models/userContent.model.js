const sql = require("./db");

const UserContent = function (userContent) {
  this.user_id = userContent.user_id;
  this.content_id = userContent.content_id;
  this.content_type = userContent.content_type;
  this.content_text = userContent.content_text;
  this.timestamp = userContent.timestamp;
};

UserContent.createUserContent = (userContent, result) => {
  sql.query(
    "INSERT INTO user_content (user_id, content_id, content_type, content_text, timestamp) VALUES (?, ?, ?, ?, ?)",
    [
      userContent.user_id,
      userContent.content_id,
      userContent.content_type,
      userContent.content_text,
      userContent.timestamp,
    ],
    (err, res) => {
      if (err) {
        console.log("User-generated content creation error: ", err);
        result(err, null);
        return;
      }
      console.log("User-generated content created: ", {
        user_id: userContent.user_id,
        content_id: userContent.content_id,
        content_type: userContent.content_type,
        content_text: userContent.content_text,
        timestamp: userContent.timestamp,
        id: res.insertId,
      });
      result(null, res.insertId);
    }
  );
};

UserContent.getUserContent = (user_id, result) => {
  sql.query(
    "SELECT * FROM user_content WHERE user_id = ?",
    [user_id],
    (err, res) => {
      if (err) {
        console.log("User-generated content retrieval error: ", err);
        result(err, null);
        return;
      }
      console.log("User-generated content retrieved for user_id: ", user_id);
      result(null, res);
    }
  );
};

UserContent.deleteUserContent = (content_id, result) => {
  sql.query(
    "DELETE FROM user_content WHERE content_id = ?",
    [content_id],
    (err, res) => {
      if (err) {
        console.log("User-generated content deletion error: ", err);
        result(err, null);
        return;
      }
      console.log("User-generated content deleted with id: ", content_id);
      result(null, res.affectedRows);
    }
  );
};

module.exports = UserContent;
