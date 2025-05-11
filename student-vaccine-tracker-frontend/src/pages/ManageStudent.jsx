import { useEffect, useState } from "react";
import Papa from "papaparse";
import { useRef } from "react";
import { BACKEND_URL } from "../../config";
import AppBar from "../Components/AppBar";
import axios from "axios";
import ReactSelect from "react-select";
import { useNavigate } from "react-router-dom";

const ManageStudent = () => {
  const [formData, setFormData] = useState({
    name: "",
    class: "",
    vaccine: "",
    studentId: "",
  });
  const [studentData, setStudentData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [vaccines, setVaccines] = useState([]);
  const [csvData, setCsvData] = useState([]); // parsed data for preview
  const [selectedFile, setSelectedFile] = useState(null); // file for submission
  const [assignments, setAssignments] = useState({});
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const recordsPerPage = 5;
  const [csvPreview, setCsvPreview] = useState([]);

  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setCsvData(file); // Save the raw file for submission

    // Just for preview, parse the file
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        console.log("Parsed CSV Data:", results.data);
        setCsvPreview(results.data); // New state to preview data
      },
    });
  };

  const handleBulkSubmit = async () => {
    if (!csvData) {
      alert("Please select a CSV file first.");
      return;
    }

    console.log("Submitting Bulk File:", csvData);

    try {
      const formData = new FormData();
      formData.append("file", csvData); // Now submitting the real file

      const res = await axios.post(
        `${BACKEND_URL}/api/students/import`,
        formData,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwt"),
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Bulk Import Success:", res.data);
      alert("Bulk import successful!");
      fetchStudents(); // refresh students table
      setCsvPreview()
    } catch (err) {
      console.error("Bulk Import Error:", err);
      alert("Bulk import failed.");
    }
  };

  const changeHandler = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const postData = async () => {
    try {
      const res = await axios.post(`${BACKEND_URL}/api/students`, formData, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      });
      console.log(res);
      alert("Student added successfully!");

      setFormData({
        name: "",
        class: "",
        studentId: "",
      });
      fetchStudents(); // refresh after add
    } catch (err) {
      console.error("Error posting data:", err);
    }
  };

  const fetchVaccines = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/drives`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      });
      const data = res.data;
      console.log(data);
      const options = data.map((vac) => ({
        value: vac._id,
        label: vac.vaccineName,
      }));
      setVaccines(options);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/students`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      });
      const data = response.data;
      console.log(data);
      setStudentData(data);
      setTotalPages(data.totalPages || 1);

      const initialAssignments = {};
      data.forEach((student) => {
        initialAssignments[student._id] =
          student.vaccines?.map((vac) => vac._id) || [];
      });
      setAssignments(initialAssignments);
    } catch (err) {
      console.error("Error fetching report:", err);
    }
  };

  const handleSubmit = (e) => {
    console.log("entered");

    e.preventDefault();
    postData();
  };

  useEffect(() => {
    fetchVaccines();
    fetchStudents();
  }, []);

  const handleVaccineChange = (studentId, selectedVaccines) => {
    setAssignments((prev) => ({
      ...prev,
      [studentId]: selectedVaccines,
    }));
  };

  const saveStudentVaccines = async (studentId) => {
    const selectedVaccine = assignments[studentId];
    const selectedDetails = selectedVaccine.map((vacId) => {
      const vacObj = vaccines.find((v) => v.value === vacId);
      return {
        vaccine: vacObj?.label,
        driveId: vacObj?.value,
      };
    });
    for (var i = 0; i < selectedDetails.length; i++) {
      try {
        const res = await axios.post(
          `${BACKEND_URL}/api/students/${studentId}/vaccinate`,
          selectedDetails[i],
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
          }
        );
        console.log(res);
      } catch (err) {
        console.error("Error saving vaccines:", err);
      }
    }
    alert("Vaccine assigned to student successfully!");
    window.location.reload();
  };

  return (
    <>
      <div>
        <AppBar heading="Manage Students" />
      </div>
      <div className="w-full h-full mx-auto p-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column: Individual Student Form */}
          <div className="flex-1 bg-white shadow-md rounded-lg p-6 mt-10">
            <h3 className="text-xl font-semibold mb-4 text-center">
              Add Individual Student
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block text-md font-medium">Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={changeHandler}
                className="w-full mt-1 border border-gray-300 rounded-md px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                placeholder="Name"
                required
              />

              <label className="block text-md font-medium">Class</label>
              <input
                name="class"
                value={formData.class}
                onChange={changeHandler}
                className="w-full mt-1 border border-gray-300 rounded-md px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                placeholder="Class"
              />
              <label className="block text-md font-medium">Student ID</label>
              <input
                name="studentId"
                value={formData.studentId}
                onChange={changeHandler}
                className="w-full mt-1 border border-gray-300 rounded-md px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                placeholder="Student Id"
              />
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="mt-4 px-6 py-2 bg-green-700 text-white font-semibold rounded hover:bg-blue-700"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>

          {/* Middle Column: Bulk Upload Section */}
          {/* Middle Column: Bulk Upload Section */}
          <div className="flex-1 bg-white shadow-md rounded-lg p-6 mt-10 ">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Bulk Upload Students (CSV)
            </h2>
            <div className="mb-4 flex items-center w-full h-full justify-center">
              <input
                type="file"
                accept=".csv"
                ref={fileInputRef}
                onChange={handleCSVUpload}
              />
            </div>

            {csvPreview.length > 0 && csvPreview[0] && (
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300">
                  <thead className="bg-gray-100">
                    <tr>
                      {Object.keys(csvPreview[0]).map((header) => (
                        <th
                          key={header}
                          className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {csvPreview.map((row, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        {Object.keys(row).map((header) => (
                          <td
                            key={header}
                            className="px-4 py-2 border text-sm text-gray-800"
                          >
                            {row[header]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {csvPreview.length > 0 && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={handleBulkSubmit}
                  className="px-6 py-2 bg-green-700 text-white font-semibold rounded hover:bg-green-800"
                >
                  Submit CSV
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Students Table with Vaccine Assignment */}
          <div className="flex-1 bg-white shadow-md rounded-lg p-6 mt-10">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Assign Vaccines to Students
            </h2>

            <table className="w-full border text-sm mb-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-2 py-1">Student ID</th>
                  <th className="border px-2 py-1">Name</th>
                  <th className="border px-2 py-1">Select Vaccines</th>
                  <th className="border px-2 py-1">Action</th>
                </tr>
              </thead>
              <tbody>
                {studentData
                  .slice((page - 1) * recordsPerPage, page * recordsPerPage)
                  .map((student) => (
                    <tr key={student._id}>
                      <td className="border px-2 py-1">{student.studentId}</td>
                      <td className="border px-2 py-1">{student.name}</td>
                      <td className="border px-2 py-1">
                        <ReactSelect
                          isMulti
                          options={vaccines}
                          value={vaccines.filter((opt) =>
                            (assignments[student._id] || []).includes(opt.value)
                          )}
                          onChange={(selectedOptions) => {
                            const selectedIds = selectedOptions.map(
                              (opt) => opt.value
                            );
                            handleVaccineChange(student._id, selectedIds);
                          }}
                          className="w-full"
                        />
                      </td>
                      <td className="border px-2 py-1">
                        <button
                          onClick={() => saveStudentVaccines(student._id)}
                          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          Save
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {/* Pagination Buttons */}
            <div className="flex justify-center gap-4">
              <button
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
                className={`px-3 py-1 rounded ${
                  page === 1
                    ? "bg-gray-300"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                Previous
              </button>
              <span className="text-md font-semibold mt-1">Page {page}</span>
              <button
                disabled={
                  page >= Math.ceil(studentData.length / recordsPerPage)
                }
                onClick={() => setPage((prev) => prev + 1)}
                className={`px-3 py-1 rounded ${
                  page >= Math.ceil(studentData.length / recordsPerPage)
                    ? "bg-gray-300"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageStudent;
