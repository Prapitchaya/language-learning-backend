const sql = require("./db");

const Course = function (course) {
  this.title = course.title;
  this.description = course.description;
  this.pricing = course.pricing;
  this.language = course.language;
  this.proficiency_level = course.proficiency_level;
  this.instructor_id = course.instructor_id;
};

Course.createCourse = (newCourse, result) => {
  sql.query("INSERT INTO course SET ?", newCourse, (err, res) => {
    if (err) {
      console.error("Course creation error: ", err);
      result(err, null);
      return;
    }

    sql.query(
      "SELECT C.*, I.instructor_id, I.instructor_name, I.bio, I.contact_information " +
        "FROM Course C " +
        "JOIN Instructor I ON C.instructor_id = I.instructor_id " +
        "WHERE C.course_id = ?",
      res.insertId,
      (err, details) => {
        if (err) {
          console.error("Error fetching additional details:", err);
          result(err, null);
          return;
        }

        result(null, details[0]);
      }
    );
  });
};

Course.getAllCourses = (result) => {
  sql.query(
    "SELECT C.*, I.instructor_id, I.instructor_name, I.bio, I.contact_information " +
      "FROM Course C " +
      "JOIN Instructor I ON C.instructor_id = I.instructor_id",
    (err, res) => {
      if (err) {
        console.error("Query error:", err);
        result(err, null);
        return;
      }

      result(null, res);
    }
  );
};

Course.getCourseById = (courseId, result) => {
  sql.query(
    "SELECT C.*, I.instructor_id, I.instructor_name, I.bio, I.contact_information " +
      "FROM Course C " +
      "JOIN Instructor I ON C.instructor_id = I.instructor_id " +
      "WHERE C.course_id = ?",
    courseId,
    (err, res) => {
      if (err) {
        console.error("Query error:", err);
        result(err, null);
        return;
      }

      if (res.length) {
        result(null, res[0]);
      } else {
        result({ kind: "not_found" }, null);
      }
    }
  );
};

Course.updateCourse = (courseId, updatedCourse, result) => {
  sql.query(
    "UPDATE course SET ? WHERE course_id = ?",
    [updatedCourse, courseId],
    (err, res) => {
      if (err) {
        console.error("Query error:", err);
        result(err, null);
        return;
      }

      sql.query(
        "SELECT C.*, I.instructor_id, I.instructor_name, I.bio, I.contact_information " +
          "FROM Course C " +
          "JOIN Instructor I ON C.instructor_id = I.instructor_id " +
          "WHERE C.course_id = ?",
        courseId,
        (err, details) => {
          if (err) {
            console.error("Error fetching additional details:", err);
            result(err, null);
            return;
          }

          if (res.affectedRows === 0) {
            result({ kind: "not_found" }, null);
            return;
          }

          result(null, details[0]);
        }
      );
    }
  );
};

module.exports = Course;
