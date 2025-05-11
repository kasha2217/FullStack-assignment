import { useState } from "react";
import "./App.css";
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import ManageStudent from "./pages/ManageStudent";
import VaccinationReport from "./pages/VaccinationReport";
import VaccinationDrives from "./pages/VaccinationDrives";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login/>}></Route>
          <Route path="/dashboard" element={<Dashboard/>}></Route>
          <Route path="/students" element = {<ManageStudent/>}></Route>
          <Route path="/studentData" element={<></>}></Route>
          <Route path="/vaccinationReport" element={<VaccinationReport/>}></Route>
          <Route path="/vaccinationDrives" element={<VaccinationDrives/>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
