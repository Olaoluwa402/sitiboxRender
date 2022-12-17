import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SideBar from "./Sidebar/Sidebar";
import NavBar from "./Navbar/Navbar";
import { ToastContainer } from "react-toastify";
import { Outlet } from "react-router-dom";

import "react-toastify/dist/ReactToastify.css";
import styles from "./Layout.module.css";

const Layout = () => {
  const navigate = useNavigate();
  //get store
  const store = useSelector((store) => store.doctorLogin);
  const { doctorInfo } = store;

  useEffect(() => {
    if (!doctorInfo) {
      navigate("/doclogin");
    }
  }, [navigate, doctorInfo]);

  return (
    <div className={styles.layout}>
      <NavBar />
      <SideBar />
      {/*message alert  */}
      <ToastContainer
        position="top-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <main className={`${styles.main}`}>{<Outlet />}</main>
    </div>
  );
};

export default Layout;
