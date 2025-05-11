const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  createStudent,
  getStudents,
  updateStudent,
  vaccinateStudent,
  importStudents,
} = require("../controllers/studentController");
const studentRouter = express.Router();

studentRouter.use(authMiddleware);

studentRouter.post("/", createStudent);
studentRouter.get("/", getStudents);
studentRouter.put("/:id", updateStudent);
studentRouter.post("/:id/vaccinate", vaccinateStudent);
studentRouter.post("/import", importStudents);

module.exports = studentRouter;
