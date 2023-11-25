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

      sql.query(
        "SELECT C.title AS course_title, L.title AS lesson_title FROM Course C JOIN Lesson L ON C.course_id = ? AND L.lesson_id = ?",
        [course_id, lesson_id],
        (err, details) => {
          if (err) {
            console.error("Error retrieving course and lesson details: ", err);
            result(err, null);
            return;
          }

          const progressDetails = {
            user_id,
            course_id,
            course_title: details[0].course_title,
            lesson_id,
            lesson_title: details[0].lesson_title,
            quiz_id,
            completion_status,
            id: res.insertId,
          };

          console.log("Progress created: ", progressDetails);
          result(null, progressDetails);
        }
      );
    }
  );
};

Progress.getProgress = (user_id, course_id, result) => {
  const query = `
    SELECT
      CP.user_id,
      CP.course_id,
      C.title AS course_title,
      CP.lesson_id,
      L.title AS lesson_title,
      CP.quiz_id,
      CP.completion_status
    FROM
      Course_Progress CP
    JOIN
      Course C ON CP.course_id = C.course_id
    JOIN
      Lesson L ON CP.lesson_id = L.lesson_id
    WHERE
      CP.user_id = ? AND CP.course_id = ?
  `;

  sql.query(query, [user_id, course_id], (err, res) => {
    if (err) {
      console.error("Error retrieving progress:", err);
      result(err, null);
      return;
    }

    const progressData = res.map((row) => ({
      course_id: row.course_id,
      course_title: row.course_title,
      lesson_id: row.lesson_id,
      lesson_title: row.lesson_title,
      quiz_id: row.quiz_id,
      completion_status: row.completion_status,
    }));

    console.log(
      "Progress retrieved for user_id:",
      user_id,
      "and course_id:",
      course_id
    );
    result(null, progressData);
  });
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

      sql.query(
        "SELECT C.title AS course_title, L.title AS lesson_title FROM Course C JOIN Lesson L ON C.course_id = ? AND L.lesson_id = ?",
        [course_id, lesson_id],
        (err, details) => {
          if (err) {
            console.error("Error retrieving course and lesson details: ", err);
            result(err, null);
            return;
          }

          const updatedProgressDetails = {
            user_id,
            course_id,
            course_title: details[0].course_title,
            lesson_id,
            lesson_title: details[0].lesson_title,
            quiz_id,
            completion_status,
          };

          console.log("Progress updated: ", updatedProgressDetails);
          result(null, updatedProgressDetails);
        }
      );
    }
  );
};


module.exports = Progress;
