import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Link } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../../config";
import AppBar from "../Components/AppBar";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const Dashboard = () => {
  const [vaccinationCounts, setVaccinationCounts] = useState({
    vaccinated: 0,
    notVaccinated: 0,
  });
  const [registered, setRegistered] = useState(0);
  const [upcomingDrives, setUpcomingDrives] = useState([]);
  const [drives, setDrives] = useState([]);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/dashboard/metrics`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      });
      const data = res.data;
      console.log(data);

      const vaccinatedCount = data.vaccinatedCount;
      const totalStudents = data.totalStudents;
      const notVaccinatedCount = totalStudents - vaccinatedCount;

      setVaccinationCounts({
        vaccinated: vaccinatedCount,
        notVaccinated: notVaccinatedCount,
      });
      setRegistered(totalStudents);
      setUpcomingDrives(data.upcomingDrives || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDrives = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/drives`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      });
      const data = res.data;
      console.log(data);
      setDrives(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchDrives();
  }, []);

  const barData = {
    labels: ["Vaccinated", "Not Vaccinated"],
    datasets: [
      {
        label: "Students",
        data: [vaccinationCounts.vaccinated, vaccinationCounts.notVaccinated],
        backgroundColor: ["#10B981", "#F59E0B"],
        borderRadius: 8,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (context) {
            let total =
              vaccinationCounts.vaccinated + vaccinationCounts.notVaccinated;
            let percent = ((context.raw / total) * 100).toFixed(1);
            return `${context.raw} students (${percent}%)`;
          },
        },
      },
    },
  };

  return (
    <>
      <div>
        <AppBar heading="Dashboard" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Vaccination Status Bar Chart */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Vaccination Status</h2>
          <Bar data={barData} options={barOptions} />
        </div>

        {/* Drives Overview Cards */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Vaccination Drives</h2>
          {drives.length === 0 ? (
            <p className="text-gray-600">No drives available</p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {drives.map((drive, index) => (
                <div
                  key={index}
                  className="border p-4 rounded-lg shadow-sm hover:shadow-md transition"
                >
                  <h3 className="text-lg font-semibold">
                    {drive.vaccineName || `Drive ${index + 1}`}
                  </h3>
                  <p className="text-gray-600">
                    Date:{" "}
                    {drive.date
                      ? new Date(drive.date).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })
                      : "N/A"}
                  </p>

                  <p className="text-gray-600">
                    Available Doses: {drive.availableDoses || "N/A"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
