const Course = require("../models/course.model");

const createCourse = (req, res) => {
  const newCourse = new Course({
    title: req.body.title,
    description: req.body.description,
    pricing: req.body.pricing,
    language: req.body.language,
    proficiency_level: req.body.proficiencyLevel,
    instructor_id: req.body.instructorId,
  });

  Course.createCourse(newCourse, (err, course) => {
    if (err) {
      res.status(500).send({ message: "Failed to create a new course" });
    } else {
      res.send(course);
    }
  });
};

const updateCourse = (req, res) => {
  const courseId = req.params.courseId;

  const updatedCourse = {
    title: req.body.title,
    description: req.body.description,
    pricing: req.body.pricing,
    language: req.body.language,
    proficiency_level: req.body.proficiencyLevel,
    instructor_id: req.body.instructorId,
  };

  Course.updateCourse(courseId, updatedCourse, (err, course) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({ message: "Course not found" });
      } else {
        res.status(500).send({ message: "Failed to update the course" });
      }
    } else {
      res.send(course);
    }
  });
};

const getAllCourses = (req, res) => {
  Course.getAllCourses((err, courses) => {
    if (err) {
      res.status(500).send({ message: "Failed to get courses" });
    } else {
      res.send(courses);
    }
  });
};

const getCourseById = (req, res) => {
  const courseId = req.params.courseId;

  Course.getCourseById(courseId, (err, course) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({ message: "Course not found" });
      } else {
        res.status(500).send({ message: "Error retrieving course" });
      }
    } else {
      res.send(course);
    }
  });
};

module.exports = {
  createCourse,
  updateCourse,
  getAllCourses,
  getCourseById,
};
