import React, { useEffect, useState } from "react";
import { BACKEND_URL } from "../../config";
import axios from "axios";
import AppBar from "../Components/AppBar";

const VaccinationDrives = () => {
  const [drives, setDrives] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formState, setFormState] = useState({
    date: "",
    doses: "",
    vaccineName: "",
    applicableClasses: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchDrives();
  }, []);

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

  const handleEdit = (drive) => {
    setEditingId(drive._id);
    setFormState({
      date: drive.date.slice(0, 10),
      doses: drive.availableDoses,
    });
  };

  const handleSave = async (id) => {
    const body = {
      date: new Date(formState.date),
      availableDoses: formState.doses,
    };
    console.log(body);

    try {
      const res = await axios.put(`${BACKEND_URL}/api/drives/${id}`, body, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      });

      if (res) {
        setMessage("Drive updated successfully.");
        setEditingId(null);
        fetchDrives();
      } else {
        setMessage("Failed to update drive.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error occurred while saving.");
    }
  };

  const handleAddDrive = async () => {
    if (
      !formState.date ||
      !formState.vaccineName ||
      !formState.doses ||
      !formState.applicableClasses
    ) {
      setMessage("Please fill in all fields.");
      return;
    }

    const body = {
      date: new Date(formState.date),
      vaccineName: formState.vaccineName,
      availableDoses: Number(formState.doses),
      applicableClasses: formState.applicableClasses,
    };

    try {
      const res = await axios.post(`${BACKEND_URL}/api/drives`, body, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      });

      if (res) {
        setMessage("New drive added successfully.");
        setFormState({
          date: "",
          doses: "",
          vaccineName: "",
          applicableClasses: "",
        });
        fetchDrives(); // Refresh the table
      } else {
        setMessage("Failed to add drive.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error occurred while adding.");
    }
  };

  const today = new Date();

  return (
    <>
      <AppBar heading="Upcoming Vaccination Drives"></AppBar>
      <div className="max-w-full mx-auto mt-10 p-6  shadow rounded-lg min-h-screen">
        {message && (
          <p className="text-center mb-4 text-green-600 font-medium">
            {message}
          </p>
        )}

        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2">Date</th>
              <th className="border px-3 py-2">Vaccine</th>
              <th className="border px-3 py-2">Doses</th>
              <th className="border px-3 py-2">Grades</th>
              <th className="border px-3 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {drives.map((drive) => {
              const isPast = new Date(drive.date) < today;
              const isEditing = editingId === drive._id;

              return (
                <>
                  <tr key={drive._id}>
                    <td className="border px-3 py-2">
                      {isEditing ? (
                        <input
                          type="date"
                          value={formState.date}
                          onChange={(e) =>
                            setFormState({ ...formState, date: e.target.value })
                          }
                          className="border px-2 py-1 rounded"
                        />
                      ) : (
                        drive.date.slice(0, 10)
                      )}
                    </td>
                    <td className="border px-3 py-2">{drive.vaccineName}</td>
                    <td className="border px-3 py-2">
                      {isEditing ? (
                        <input
                          type="number"
                          value={formState.availableDoses}
                          onChange={(e) =>
                            setFormState({
                              ...formState,
                              doses: e.target.value,
                            })
                          }
                          className="border px-2 py-1 rounded"
                        />
                      ) : (
                        drive.availableDoses
                      )}
                    </td>
                    <td className="border px-3 py-2">
                      {drive.applicableClasses}
                    </td>
                    <td className="border px-3 py-2">
                      {isPast ? (
                        <span className="text-gray-400">Not Editable</span>
                      ) : isEditing ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSave(drive._id)}
                            className="bg-green-600 text-white px-3 py-1 rounded"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="bg-gray-400 text-white px-3 py-1 rounded"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEdit(drive)}
                          className="bg-blue-600 text-white px-3 py-1 rounded"
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                </>
              );
            })}
          </tbody>
        </table>
        <h2 className="text-xl font-semibold mt-8 mb-4 text-center">
          Add New Vaccination Drive
        </h2>

        <div className="flex flex-col md:flex-row gap-4 mb-6 justify-center">
          <input
            type="date"
            value={formState.date}
            onChange={(e) =>
              setFormState({ ...formState, date: e.target.value })
            }
            className="border px-3 py-2 rounded"
          />
          <input
            type="text"
            placeholder="Vaccine Name"
            value={formState.vaccineName || ""}
            onChange={(e) =>
              setFormState({
                ...formState,
                vaccineName: e.target.value,
              })
            }
            className="border px-3 py-2 rounded"
          />
          <input
            type="number"
            placeholder="Available Doses"
            value={formState.doses}
            onChange={(e) =>
              setFormState({ ...formState, doses: e.target.value })
            }
            className="border px-3 py-2 rounded"
          />
          <input
            type="text"
            placeholder="Applicable Classes (e.g. 1,2,3)"
            value={formState.applicableClasses || ""}
            onChange={(e) =>
              setFormState({
                ...formState,
                applicableClasses: e.target.value,
              })
            }
            className="border px-3 py-2 rounded"
          />
          <button
            onClick={handleAddDrive}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Add Drive
          </button>
        </div>
      </div>
    </>
  );
};

export default VaccinationDrives;
