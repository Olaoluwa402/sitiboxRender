import React, { useState } from "react";
import Navbar from "../../components/DoctorDashboard/Navbar/NavbarDM";
import Sidebar from "../../components/DoctorDashboard/Sidebar/SidebarDM";
import { Outlet } from "react-router-dom";
import "./DDashboard.css";

const DoctorDashboard = () => {
  const [sidebarOpen, setsidebarOpen] = useState(false);

  const openSidebar = () => {
    setsidebarOpen(true);
  };
  const closeSidebar = () => {
    setsidebarOpen(false);
  };

  return (
    <React.Fragment>
      <div className="containerDDASHBOARD">
        <Navbar sidebarOpen={sidebarOpen} openSidebar={openSidebar} />
        <main className="MainDM" id="mainDM">
          {<Outlet />}
        </main>
        <Sidebar sidebarOpen={sidebarOpen} closeSidebar={closeSidebar} />
      </div>
    </React.Fragment>
  );
};

export default DoctorDashboard;
