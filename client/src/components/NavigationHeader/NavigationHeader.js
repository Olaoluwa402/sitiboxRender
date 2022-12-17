import React, { useState, useEffect, useContext } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import style from "./NavigationHeader.module.css";
import { FaQuestionCircle } from "react-icons/fa";
import { FaFacebookSquare } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";
import { FaTwitterSquare } from "react-icons/fa";
import { FiLogIn } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import DrawerToggleButton from "../SideDrawer/DrawerToggleButton";
import { logout } from "../../actions/patientActions";
import { doctorLogout } from "../../actions/doctorActions";
import { adminLogout } from "../../actions/adminActions";
import logo from "../../img/SitiboxLOGO-min.png";
import { WebSocketContext } from "../../WebSocket";

const NavigationHeader = ({ drawerClickHandler, SideDrawerOpen }) => {
  let navigate = useNavigate();
  const [disablePatientTab, setDisablePatientTab] = useState(false);
  const [disableDoctorTab, setDisableDoctorTab] = useState(false);
  const wlbs = useContext(WebSocketContext);

  const dispatch = useDispatch();

  const patientLogin = useSelector((state) => state.patientLogin);
  const { patientInfo } = patientLogin;

  const doctorLogin = useSelector((state) => state.doctorLogin);
  const { doctorInfo } = doctorLogin;

  const adminLogin = useSelector((state) => state.adminLogin);
  const { adminInfo } = adminLogin;

  useEffect(() => {
    if (patientInfo) {
      setDisableDoctorTab(true);
    } else {
      setDisableDoctorTab(false);
    }

    if (doctorInfo) {
      setDisablePatientTab(true);
    } else {
      setDisablePatientTab(false);
    }
  }, [patientInfo, doctorInfo]);

  const logoutHandler = () => {
    dispatch(logout(wlbs.socket));
  };

  const doctorLogoutHandler = () => {
    dispatch(doctorLogout(wlbs.socket));
  };

  const adminLogoutHandler = () => {
    dispatch(adminLogout());
  };

  const docTabHandler = () => {
    navigate("/doclogin");
  };

  const patientTabHandler = () => {
    navigate("/login");
  };

  return (
    <React.Fragment>
      {/* floating social icon*/}
      <div className={style.fabContainer}>
        <div className={`${style.fabb} ${style.fabIconHolder}`}>
          <FaQuestionCircle className={`${style.fas} ${style.faQuestion}`} />
        </div>
        <ul className={style.fabOptions}>
          <li>
            <span className={style.fabLabel}>Facebook</span>
            <div className={style.fabIconHolder}>
              <a href="https://facebook.com/9jacliniccom-100442242196394">
                <FaFacebookSquare
                  className={`${style.fas} ${style.faFacebook}`}
                />
              </a>
            </div>
          </li>
          <li>
            <span className={style.fabLabel}>Instagram</span>
            <div className={style.fabIconHolder}>
              <a href="https://instagram.com/9jaclinic">
                <FaInstagramSquare
                  className={`${style.fas} ${style.faInstagram}`}
                />
              </a>
            </div>
          </li>
          <li>
            <span className={style.fabLabel}>Twitter</span>
            <div className={style.fabIconHolder}>
              <a href="https://twitter.com/9jaclinicHQ">
                <FaTwitterSquare
                  className={`${style.fas} ${style.faTwitter}`}
                />
              </a>
            </div>
          </li>
        </ul>
      </div>

      <div className={style.narbarOuter__wrapper}>
        <div className={`${style.navbarInner__wrapper} container`}>
          <DrawerToggleButton
            click={drawerClickHandler}
            SideDrawerOpen={SideDrawerOpen}
          />
          <NavLink
            to="/"
            className={`${style.navbar__brandlink} ${style.navBarLink}`}
          >
            <img src={logo} alt="9jaclinic" className={style.image} />
          </NavLink>

          <div className={style.navbar__left}>
            <NavLink to="/services" className={`${style.navBarLink}`}>
              Services
            </NavLink>

            <NavLink to="/contact" className={`${style.navBarLink}`}>
              Contact
            </NavLink>

            <a
              href="https://9jaclinic.com/blog"
              className={`${style.navBarLink}`}
              target="_blanck"
            >
              Blog
            </a>

            <NavLink to="/about" className={`${style.navBarLink}`}>
              About
            </NavLink>
            <NavLink to="/our-team" className={`${style.navBarLink}`}>
              Team
            </NavLink>
          </div>

          <div className={style.spacer}></div>

          <nav className={style.navbar__right}>
            <ul>
              <li className={`${style.dropdown}`}>
                <NavLink to="/consultants" className={`${style.navBarLink}`}>
                  Doctors
                </NavLink>
              </li>
              <li className={`${style.dropdown}`}>
                <NavLink to="/faq" className={`${style.navBarLink}`}>
                  FAQ
                </NavLink>
              </li>
              {
                <React.Fragment>
                  {!adminInfo && (
                    <React.Fragment>
                      <li className={`${style.dropdown}`}>
                        {patientInfo && patientInfo.clinicName ? (
                          <React.Fragment>
                            <span
                              className={`${style.navbar__rightlink} ${style.navBarLink} ${style.dropbtn}`}
                            >
                              <span style={{ textTransform: "capitalize" }}>
                                {patientInfo.clinicName}
                              </span>
                              <span className={style.mode}>[CLIENT MODE]</span>
                            </span>
                            <div className={`${style.dropdownContent}`}>
                              <Link to={`/dashboard`}>Dashboard</Link>
                              <Link to="" onClick={logoutHandler}>
                                Logout
                              </Link>
                            </div>
                          </React.Fragment>
                        ) : (
                          <button
                            type="button"
                            disabled={disablePatientTab}
                            className={`${style.navbar__rightlink} ${style.navBarLink} ${style.dropbtn}`}
                            style={{
                              display: `${disablePatientTab ? "none" : ""}`,
                            }}
                            onClick={patientTabHandler}
                          >
                            Client <FiLogIn className={style.loginIcon} />
                          </button>
                        )}
                      </li>

                      <li className={`${style.dropdown}`}>
                        {doctorInfo ? (
                          <React.Fragment>
                            <span
                              className={`${style.navbar__rightlink} ${style.navBarLink} ${style.dropbtn}`}
                            >
                              <span style={{ textTransform: "capitalize" }}>
                                Dr {doctorInfo.firstName}
                              </span>
                              <span className={style.mode}>[DOCTOR MODE]</span>
                            </span>
                            <div className={`${style.dropdownContent}`}>
                              <Link to={`/docdashboard`}>Dashboard</Link>
                              <Link to="" onClick={doctorLogoutHandler}>
                                Logout
                              </Link>
                            </div>
                          </React.Fragment>
                        ) : (
                          <button
                            type="button"
                            disabled={disableDoctorTab}
                            className={`${style.navbar__rightlink} ${style.navBarLink} ${style.dropbtn}`}
                            style={{
                              display: `${disableDoctorTab ? "none" : ""}`,
                            }}
                            onClick={docTabHandler}
                          >
                            Doctor <FiLogIn className={style.loginIcon} />
                          </button>
                        )}
                      </li>
                    </React.Fragment>
                  )}

                  {adminInfo && (
                    <li className={`${style.dropdown}`}>
                      <React.Fragment>
                        <div>
                          <span
                            className={`${style.navbar__rightlink} ${style.navBarLink} ${style.dropbtn}`}
                          >
                            <span style={{ textTransform: "capitalize" }}>
                              Admin
                            </span>
                            <span className={style.mode}>[Admin MODE]</span>
                          </span>
                        </div>
                        <div className={`${style.dropdownContent}`}>
                          <Link to="/admindashboard">Dashboard</Link>
                          <Link to="" onClick={adminLogoutHandler}>
                            Logout
                          </Link>
                        </div>
                      </React.Fragment>
                    </li>
                  )}
                </React.Fragment>
              }
            </ul>
          </nav>
        </div>
      </div>
    </React.Fragment>
  );
};

export default NavigationHeader;
