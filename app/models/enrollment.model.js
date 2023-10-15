const sql = require("./db");

const Enrollment = function (enrollment) {
  this.user_id = enrollment.user_id;
  this.course_id = enrollment.course_id;
  this.enrollment_date = new Date(); 
};

Enrollment.create = (user_id, course_id, result) => {
  const enrollment = new Enrollment({ user_id, course_id });

  sql.query(
    "INSERT INTO course_enrollment (user_id, course_id, enrollment_date) VALUES (?, ?, ?)",
    [enrollment.user_id, enrollment.course_id, enrollment.enrollment_date],
    (err, res) => {
      if (err) {
        console.log("Enrollment error: ", err);
        result(err, null);
        return;
      }
      console.log("Enrollment created: ", {
        user_id: enrollment.user_id,
        course_id: enrollment.course_id,
      });
      result(null, {
        user_id: enrollment.user_id,
        course_id: enrollment.course_id,
        id: res.insertId,
      });
    }
  );
};

Enrollment.getEnrollmentsForUser = (user_id, result) => {
  sql.query(
    "SELECT * FROM course_enrollment WHERE user_id = ?",
    [user_id],
    (err, res) => {
      if (err) {
        console.log("Enrollments retrieval error: ", err);
        result(err, null);
        return;
      }
      console.log("Enrollments retrieved for user_id: ", user_id);
      result(null, res);
    }
  );
};

Enrollment.checkEnrollmentStatus = (user_id, course_id, result) => {
  sql.query(
    "SELECT * FROM course_enrollment WHERE user_id = ? AND course_id = ?",
    [user_id, course_id],
    (err, res) => {
      if (err) {
        console.log("Enrollment status check error: ", err);
        result(err, null);
        return;
      }
      if (res.length > 0) {
        console.log("User is enrolled in the course.");
        result(null, true);
      } else {
        console.log("User is not enrolled in the course.");
        result(null, false);
      }
    }
  );
};

module.exports = Enrollment;
