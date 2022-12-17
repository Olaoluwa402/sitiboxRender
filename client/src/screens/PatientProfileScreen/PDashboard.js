import React, { useState } from "react";
import Navbar from "../../components/PatientDashboard/Layout/Navbar/Navbar";
import Sidebar from "../../components/PatientDashboard/Layout/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";
// import "./PDashboard.css";

const PatientDashboard = () => {
  const [sidebarOpen, setsidebarOpen] = useState(false);

  const openSidebar = () => {
    setsidebarOpen(true);
  };
  const closeSidebar = () => {
    setsidebarOpen(false);
  };

  return (
    <React.Fragment>
      <div className="containerPDASHBOARD">
        <Navbar sidebarOpen={sidebarOpen} openSidebar={openSidebar} />
        <main className="mainPM" id="mainPM">
          {<Outlet />}
        </main>
        <Sidebar sidebarOpen={sidebarOpen} closeSidebar={closeSidebar} />
      </div>
    </React.Fragment>
  );
};

export default PatientDashboard;
