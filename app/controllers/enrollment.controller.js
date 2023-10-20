const Enrollment = require("../models/enrollment.model");

const createEnrollment = (req, res) => {
  const { user_id, course_id } = req.body;

  Enrollment.create(user_id, course_id, (err, enrollment) => {
    if (err) {
      res.status(500).send({ message: "Failed to create the enrollment" });
    } else {
      res.send(enrollment);
    }
  });
};

const getEnrollmentsForUser = (req, res) => {
  const user_id = req.params.user_id;

  Enrollment.getEnrollmentsForUser(user_id, (err, enrollments) => {
    if (err) {
      res.status(500).send({ message: "Failed to retrieve enrollments" });
    } else {
      res.send(enrollments);
    }
  });
};

const getAllEnrollments = (req, res) => {
  console.log("request user:", req.user);
  const userRole = req.user.role;
  if (userRole !== "admin") {
    return res.status(403).send({ message: "You do not have permission" });
  }
  Enrollment.getAllEnrollments((err, enrollments) => {
    if (err) {
      res.status(500).send({ message: "Failed to retrieve enrollments" });
    } else {
      res.send(enrollments);
    }
  });
};

const checkEnrollmentStatus = (req, res) => {
  const { user_id, course_id } = req.params;

  Enrollment.checkEnrollmentStatus(user_id, course_id, (err, isEnrolled) => {
    if (err) {
      res.status(500).send({ message: "Failed to check enrollment status" });
    } else {
      res.send({ isEnrolled });
    }
  });
};

module.exports = {
  createEnrollment,
  getEnrollmentsForUser,
  getAllEnrollments,
  checkEnrollmentStatus,
};
