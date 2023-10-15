const sql = require("./db");

const Progress = function (progress) {
  this.user_id = progress.user_id;
  this.course_id = progress.course_id;
  this.lesson_id = progress.lesson_id;
  this.quiz_id = progress.quiz_id;
  this.completion_status = progress.completion_status;
};

Progress.createProgress = (
  user_id,
  course_id,
  lesson_id,
  quiz_id,
  completion_status,
  result
) => {
  sql.query(
    "INSERT INTO course_progress (user_id, course_id, lesson_id, quiz_id, completion_status) VALUES (?, ?, ?, ?, ?)",
    [user_id, course_id, lesson_id, quiz_id, completion_status],
    (err, res) => {
      if (err) {
        console.error("Progress creation error: ", err);
        result(err, null);
        return;
      }
      console.log("Progress created: ", {
        user_id,
        course_id,
        lesson_id,
        quiz_id,
        completion_status,
      });
      result(null, {
        user_id,
        course_id,
        lesson_id,
        quiz_id,
        completion_status,
        id: res.insertId,
      });
    }
  );
};

Progress.getProgress = (user_id, course_id, result) => {
  sql.query(
    "SELECT * FROM course_progress WHERE user_id = ? AND course_id = ?",
    [user_id, course_id],
    (err, res) => {
      if (err) {
        console.error("Progress retrieval error: ", err);
        result(err, null);
        return;
      }
      console.log("Course progress retrieved for user_id: ", user_id);
      result(null, res);
    }
  );
};

Progress.updateProgress = (
  user_id,
  course_id,
  lesson_id,
  quiz_id,
  completion_status,
  result
) => {
  sql.query(
    "UPDATE course_progress SET completion_status = ? WHERE user_id = ? AND course_id = ? AND lesson_id = ? AND quiz_id = ?",
    [completion_status, user_id, course_id, lesson_id, quiz_id],
    (err, res) => {
      if (err) {
        console.error("Progress update error: ", err);
        result(err, null);
        return;
      }
      console.log("Progress updated: ", {
        user_id,
        course_id,
        lesson_id,
        quiz_id,
        completion_status,
      });
      result(null, {
        user_id,
        course_id,
        lesson_id,
        quiz_id,
        completion_status,
      });
    }
  );
};

module.exports = Progress;
