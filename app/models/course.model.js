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
      console.log("Query error:", err);
      result(err, null);
      return;
    }
    result(null, { id: res.insertId, ...newCourse });
  });
};

Course.updateCourse = (courseId, updatedCourse, result) => {
  sql.query(
    "UPDATE course SET ? WHERE course_id = ?",
    [updatedCourse, courseId],
    (err, res) => {
      if (err) {
        console.log("Query error:", err);
        result(err, null);
        return;
      }
      if (res.affectedRows === 0) {
        result({ kind: "not_found" }, null);
        return;
      }
      result(null, { id: courseId, ...updatedCourse });
    }
  );
};

Course.getAllCourses = (result) => {
  sql.query("SELECT * FROM course", (err, res) => {
    if (err) {
      console.log("Query error:", err);
      result(err, null);
      return;
    }
    result(null, res);
  });
};

Course.getCourseById = (courseId, result) => {
  sql.query(
    "SELECT * FROM course WHERE course_id = ?",
    courseId,
    (err, res) => {
      if (err) {
        console.log("Query error:", err);
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

module.exports = Course;
