const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  createDrive,
  updateDrive,
  getDrives,
} = require("../controllers/driveController");
const driveRouter = express.Router();

driveRouter.use(authMiddleware);

driveRouter.post("/", createDrive);
driveRouter.put("/:id", updateDrive);
driveRouter.get("/", getDrives);

module.exports = driveRouter;
