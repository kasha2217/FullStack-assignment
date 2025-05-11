const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { getMetrics } = require("../controllers/dashboardController");
const dashboardRouter = express.Router();

dashboardRouter.use(authMiddleware);

dashboardRouter.get("/metrics", getMetrics);

module.exports = dashboardRouter;
