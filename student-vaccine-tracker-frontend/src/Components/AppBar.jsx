import React from "react";
import { Link } from "react-router-dom";

export default function AppBar({ heading }) {
  return (
    <>
      <div className="flex justify-between items-center bg-gray-100 py-px bg-lime-200">
        <h1 className="text-3xl font-semibold text-green-800">{heading}</h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link to="/students">
                <p className="text-green-800 hover:text-sky-700">
                  Manage Students
                </p>
              </Link>
            </li>
            <li>
              <a
                href="/vaccinationDrives"
                className="text-green-800 hover:text-sky-700"
              >
                Manage Vaccination
              </a>
            </li>
            <li>
              <Link to="/vaccinationReport">
                <p className="text-green-800 hover:text-sky-700">
                  Generate Reports
                </p>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}
