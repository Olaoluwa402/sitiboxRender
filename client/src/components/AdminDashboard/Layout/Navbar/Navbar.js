import React from "react";
import { BiChevronDown } from "react-icons/bi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { useSelector } from "react-redux";
import avatar from "../../../../img/avatar.png";

import { Link } from "react-router-dom";

import styles from "./Navbar.module.css";

const NavBar = () => {
  const patientLogin = useSelector((state) => state.patientLogin);
  const { patientInfo } = patientLogin;
  const pics = patientInfo && patientInfo.image ? patientInfo.image : avatar;

  return (
    <div className={styles.container}>
      <div className={styles.nav}>
        <div className={styles.nav_search}>
          <div>
            <Link to="/dashboard/profile">Profile</Link>
          </div>
          <div>
            <Link to="/dashboard" className="">
              Consultations
            </Link>
          </div>
        </div>

        <div className={styles.nav_items}>
          <ul>
            <li>
              <div
                className={styles.notification}
                // onClick={() => setShowNotification((prev) => !prev)}
              >
                <IoMdNotificationsOutline className={styles.notificationIcon} />
                <div className={styles.count}>
                  <span>2</span>
                </div>
              </div>
            </li>
            <li className={styles.profile}>
              <div className={styles.profileImage}>
                <img src={pics} alt="profile" />
              </div>
              <BiChevronDown className={styles.chevronIcon} />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
