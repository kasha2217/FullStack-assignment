const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  class: {
    type: String,
    required: true,
  },
  studentId: {
    type: String,
    required: true,
    unique: true,
  },
  vaccinated: [
    {
      vaccine: {
        type: String,
        required: true,
      },
      driveId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Drive",
        required: true,
      },
      date: {
        type: Date,
        required: true,
      },
    },
  ],
});

const Student = mongoose.model("Student", StudentSchema);
module.exports = Student;
