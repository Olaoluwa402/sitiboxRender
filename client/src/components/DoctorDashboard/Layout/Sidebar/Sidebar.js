import React, { useContext } from "react";
import { Link } from "react-router-dom";
import logo from "../../../../img/SitiboxLOGO-min.png";
import { FaReceipt } from "react-icons/fa";
import { VscReferences } from "react-icons/vsc";
import { FaMortarPestle } from "react-icons/fa";
import { IoMdWallet } from "react-icons/io";
import { MdPayment } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { FaUser } from "react-icons/fa";
import { doctorLogout } from "../../../../actions/doctorActions";
import { useDispatch } from "react-redux";
import { WebSocketContext } from "../../../../WebSocket";

import { CiLogout, CiHome } from "react-icons/ci";

import styles from "./Sidebar.module.css";

const Sidebar = ({ sidebarOpen, closeSidebar }) => {
  const dispatch = useDispatch();
  const wlbs = useContext(WebSocketContext);
  const LogoutHandler = () => {
    dispatch(doctorLogout(wlbs.socket));
  };
  return (
    <>
      <div className={styles.container}>
        {/* logo */}
        <div className={styles.logoContainer}>
          <Link to="/" passHref className={styles.logo}>
            <img src={logo} alt="sitibox" />
          </Link>
        </div>

        {/* items */}
        <div className={styles.itemsContainer}>
          <ul>
            <li>
              <Link to="/docdashboard">
                <CiHome className={`${styles.icons} ${styles.homeIcon}`} />
              </Link>
              <Link to="/docdashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/docdashboard/profile">
                <FaUser className={`${styles.icons} ${styles.orderIcon}`} />
              </Link>
              <Link to="/docdashboard/profile">Profile</Link>
            </li>
            <li>
              <Link to="/docdashboard/pw">
                <RiLockPasswordLine
                  className={`${styles.icons} ${styles.planIcon}`}
                />
              </Link>
              <Link to="/docdashboard/pw">password</Link>
            </li>
            <li>
              <Link to="/docdashboard/wallet">
                <IoMdWallet className={`${styles.icons} ${styles.planIcon}`} />
              </Link>
              <Link to="/docdashboard/wallet">Wallet</Link>
            </li>
            <li>
              <Link to="/docdashboard/docprescriptions">
                <FaMortarPestle
                  className={`${styles.icons} ${styles.usersIcon}`}
                />
              </Link>
              <Link to="/docdashboard/docprescriptions">Prescriptions</Link>
            </li>
            <li>
              <Link to="/docdashboard/summaries">
                <FaReceipt
                  className={`${styles.icons} ${styles.analyticsIcon}`}
                />
              </Link>
              <Link to="/docdashboard/summaries">Case FIles</Link>
            </li>

            <li>
              <Link to="/dashboard/referrals">
                <VscReferences
                  className={`${styles.icons} ${styles.managementIcon}`}
                />
              </Link>
              <Link to="/dashboard/referrals">Referrals</Link>
            </li>

            <li>
              <Link to="/docdashboard/paydetail">
                <MdPayment
                  className={`${styles.icons} ${styles.managementIcon}`}
                />
              </Link>
              <Link to="/docdashboard/paydetail">Payment Details</Link>
            </li>
          </ul>
        </div>

        <div className={styles.spacer}></div>

        <div className={styles.logout} onClick={LogoutHandler}>
          <CiLogout className={`${styles.icons} ${styles.logoutIcon}`} />
          <span>Logout</span>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
