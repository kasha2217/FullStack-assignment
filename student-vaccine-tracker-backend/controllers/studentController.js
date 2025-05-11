const fs = require("fs");
const csv = require("csv-parser");
const multer = require("multer");
const Student = require("../models/student");
const upload = multer({ dest: "uploads/" });

exports.createStudent = async (req, res) => {
  const student = new Student(req.body);
  await student.save();
  res.status(201).json(student);
};

exports.getStudents = async (req, res) => {
  const { name, class: cls, studentId, vaccinated } = req.query;
  const query = {};
  if (name) query.name = new RegExp(name, "i");
  if (cls) query.class = cls;
  if (studentId) query.studentId = studentId;
  if (vaccinated === "true") query.vaccinated = { $ne: [] };
  if (vaccinated === "false") query.vaccinated = { $eq: [] };
  const students = await Student.find(query);
  res.json(students);
};

exports.updateStudent = async (req, res) => {
  const updated = await Student.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updated);
};

exports.vaccinateStudent = async (req, res) => {
  const { vaccine, driveId } = req.body;
  const student = await Student.findById(req.params.id);
  const alreadyVaccinated = student.vaccinated.find(
    (v) => v.vaccine === vaccine
  );
  if (alreadyVaccinated)
    return res
      .status(400)
      .json({ error: "Already vaccinated for this vaccine" });
  student.vaccinated.push({ vaccine, driveId, date: new Date() });
  await student.save();
  res.json(student);
};

// exports.importStudents = [
//   upload.single("file"),
//   (req, res) => {
//     const results = [];
//     fs.createReadStream(req.file.path)
//       .pipe(csv())
//       .on("data", (data) => results.push(data))
//       .on("end", async () => {
//         await Student.insertMany(results);
//         fs.unlinkSync(req.file.path);
//         res.json({ message: "Imported successfully" });
//       });
//   },
// ];

exports.importStudents = [
  upload.single("file"),
  (req, res) => {
    const results = [];
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        try {
          await Student.insertMany(results);
          fs.unlinkSync(req.file.path);
          res.json({ message: "Imported successfully" });
        } catch (error) {
          console.error("Error importing students:", error);
          fs.unlinkSync(req.file.path);
          res.status(500).json({ message: "Import failed", error: error.message });
        }
      });
  },
];
