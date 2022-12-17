import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../../components/AdminDashboard/Navbar/NavbarAdmin";
import Sidebar from "../../components/AdminDashboard/Sidebar/SidebarAdmin";

import "./ADashboard.css";

const ADashboard = () => {
  const [sidebarOpen, setsidebarOpen] = useState(false);

  const openSidebar = () => {
    setsidebarOpen(true);
  };
  const closeSidebar = () => {
    setsidebarOpen(false);
  };

  return (
    <React.Fragment>
      <div className="containerAdminDASHBOARD">
        <Navbar sidebarOpen={sidebarOpen} openSidebar={openSidebar} />
        <main className="MainAdmin" id="mainAdmin">
          {<Outlet />}
        </main>
        <Sidebar sidebarOpen={sidebarOpen} closeSidebar={closeSidebar} />
      </div>
    </React.Fragment>
  );
};

export default ADashboard;
