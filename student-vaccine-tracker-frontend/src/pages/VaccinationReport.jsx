import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { BACKEND_URL } from "../../config";
import AppBar from "../Components/AppBar";

const VaccinationReport = () => {
  const [selectedVaccine, setSelectedVaccine] = useState("");
  const [vaccineList, setVaccineList] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [page, setPage] = useState(1);

  const recordsPerPage = 5;

  // Fetch student data
  const fetchReport = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/students`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      });
      const data = response.data;
      console.log(data);
      setReportData(data);
    } catch (err) {
      console.error("Error fetching report:", err);
    }
  };

  // Fetch vaccine list
  const fetchDrives = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/drives`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      });
      const data = res.data;
      const names = [...new Set(data.map((drive) => drive.vaccineName))]; // unique names
      setVaccineList(names);
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReport();
    fetchDrives();
  }, []);

  // Filter logic
  const filteredReport = useMemo(() => {
    if (!selectedVaccine) return reportData;
    return reportData.filter((student) =>
      student.vaccinated.some(
        (v) => v.vaccine.toLowerCase() === selectedVaccine.toLowerCase()
      )
    );
  }, [selectedVaccine, reportData]);

  // Paginate logic (5 records per page)
  const paginatedReport = useMemo(() => {
    const startIndex = (page - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    return filteredReport.slice(startIndex, endIndex);
  }, [filteredReport, page]);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(filteredReport.length / recordsPerPage) || 1;
  }, [filteredReport]);

  const handleVaccineChange = (e) => {
    setSelectedVaccine(e.target.value);
    setPage(1);
  };

  const prevPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const nextPage = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const exportToCSV = () => {
    const headers = ["Name", "Grade", "Status", "Dates", "Vaccines"];
    const rows = filteredReport.map((student) => [
      student.name,
      student.class,
      student.vaccinated.length > 0 ? "Yes" : "No",
      student.vaccinated
        .map((v) =>
          new Date(v.date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        )
        .join("; "),
      student.vaccinated.map((v) => v.vaccine).join("; "),
    ]);

    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "vaccination_report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <AppBar heading="Vaccination Report"></AppBar>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Filter */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Filter by Vaccine</label>
          <select
            value={selectedVaccine}
            onChange={handleVaccineChange}
            className="border px-3 py-2 rounded w-full md:w-64"
          >
            <option value="">All Vaccines</option>
            {vaccineList.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Grade</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Dates</th>
                <th className="p-2 border">Vaccines</th>
              </tr>
            </thead>
            <tbody>
              {paginatedReport.length > 0 ? (
                paginatedReport.map((student, index) => (
                  <tr key={student.studentId || student._id || index}>
                    <td className="p-2 border">{student.name}</td>
                    <td className="p-2 border">{student.class}</td>
                    <td className="p-2 border">
                      {student.vaccinated.length > 0 ? "Yes" : "No"}
                    </td>
                    <td className="p-2 border">
                      {student.vaccinated.map((vaccine, i) => (
                        <div key={vaccine.driveId || i}>
                          {new Date(vaccine.date).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                      ))}
                    </td>
                    <td className="p-2 border">
                      {student.vaccinated.map((vaccine, i) => (
                        <div key={vaccine.driveId || i}>{vaccine.vaccine}</div>
                      ))}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-4 text-center">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={prevPage}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={nextPage}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>

        {/* Export */}
        <div className="mt-6">
          <button
            onClick={exportToCSV}
            className="px-6 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700"
          >
            Download CSV
          </button>
        </div>
      </div>
    </>
  );
};

export default VaccinationReport;
