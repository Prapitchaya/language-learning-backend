const Progress = require("../models/progress.model");
const createProgress = (req, res) => {
  const {
    user_id,
    course_id,
    lesson_id,
    quiz_id,
    completion_status,
  } = req.body;

  Progress.createProgress(
    user_id,
    course_id,
    lesson_id,
    quiz_id,
    completion_status,
    (err, progress) => {
      if (err) {
        res.status(500).send({ message: "Failed to create progress" });
      } else {
        res.send(progress);
      }
    }
  );
};
const getCourseProgress = (req, res) => {
  const { userId, courseId } = req.params;

  Progress.getProgress(userId, courseId, (err, progress) => {
    if (err) {
      res.status(500).send({ message: "Failed to get course progress" });
    } else {
      res.send(progress);
    }
  });
};

const updateProgress = (req, res) => {
  const {
    user_id,
    course_id,
    lesson_id,
    quiz_id,
    completion_status,
  } = req.body;

  Progress.updateProgress(
    user_id,
    course_id,
    lesson_id,
    quiz_id,
    completion_status,
    (err, progress) => {
      if (err) {
        res.status(500).send({ message: "Failed to update progress" });
      } else {
        res.send(progress);
      }
    }
  );
};

module.exports = {
  getCourseProgress,
  updateProgress,
  createProgress,
};
