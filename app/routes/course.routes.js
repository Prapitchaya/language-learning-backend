module.exports = (app) => {
  const course_controller = require("../controllers/course.controller");
  const authJwt = require("../middlewares/auth.jwt");

  const router = require("express").Router();

  router.get("/", authJwt, course_controller.getAllCourses);
  router.get("/:courseId", authJwt, course_controller.getCourseById);
  router.post("/create", authJwt, course_controller.createCourse);

  router.put("/:courseId", authJwt, course_controller.updateCourse);

  app.use("/api/courses", router);
};
