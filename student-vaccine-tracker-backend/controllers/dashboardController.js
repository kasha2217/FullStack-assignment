const moment = require("moment");
const Student = require("../models/student");
const Drive = require("../models/vaccinationDrive");

const getMetrics = async (req, res) => {
  const total = await Student.countDocuments();
  const vaccinated = await Student.countDocuments({
    vaccinated: { $exists: true, $ne: [] },
  });
  const upcomingDrives = await Drive.find({
    date: { $gte: new Date(), $lte: moment().add(30, "days").toDate() },
  });
  res.json({
    totalStudents: total,
    vaccinatedCount: vaccinated,
    vaccinatedPercentage: total ? ((vaccinated / total) * 100).toFixed(2) : 0,
    upcomingDrives,
  });
};

module.exports = { getMetrics };
