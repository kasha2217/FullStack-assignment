const mongoose = require("mongoose");

const DriveSchema = new mongoose.Schema({
  vaccineName: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  availableDoses: {
    type: Number,
    required: true,
    min: [1, "Available doses must be at least 1"],
  },
  applicableClasses: {
    type: [String],
    required: true,
    validate: {
      validator: function (v) {
        return Array.isArray(v) && v.length > 0;
      },
      message: "Applicable classes must be a non-empty array",
    },
  },
});

const Drive = mongoose.model("Drive", DriveSchema);
module.exports = Drive;
