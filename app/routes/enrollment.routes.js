module.exports = (app) => {
  const express = require("express");
  const enrollment_controller = require("../controllers/enrollment.controller");
  const authJwt = require("../middlewares/auth.jwt");

  const router = express.Router();

  router.post("/", authJwt, enrollment_controller.createEnrollment);
  router.get("/:user_id", authJwt, enrollment_controller.getEnrollmentsForUser);

  router.get(
    "/check/:user_id/:course_id",
    authJwt,
    enrollment_controller.checkEnrollmentStatus
  );
  app.use("/api/enrollment", router);
};
