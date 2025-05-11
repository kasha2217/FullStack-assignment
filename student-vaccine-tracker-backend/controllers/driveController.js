const moment = require("moment");
const Drive = require("../models/vaccinationDrive");

const createDrive = async (req, res) => {
  const { vaccineName, date, availableDoses, applicableClasses } = req.body;
  const driveDate = new Date(date);
  if (moment(driveDate).diff(moment(), "days") < 15)
    return res
      .status(400)
      .json({ error: "Drive must be scheduled at least 15 days in advance" });
  const overlapping = await Drive.findOne({ date: driveDate });
  if (overlapping)
    return res
      .status(400)
      .json({ error: "Drive already scheduled for this date" });
  const drive = new Drive({
    vaccineName,
    date: driveDate,
    availableDoses,
    applicableClasses,
  });
  await drive.save();
  res.status(201).json(drive);
};

const updateDrive = async (req, res) => {
  const drive = await Drive.findById(req.params.id);
  if (!drive) return res.status(404).json({ error: "Drive not found" });
  if (new Date(drive.date) <= new Date())
    return res.status(400).json({ error: "Cannot edit past drives" });
  const updated = await Drive.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updated);
};

const getDrives = async (req, res) => {
  const drives = await Drive.find();
  res.json(drives);
};

module.exports = { getDrives, createDrive, updateDrive };
