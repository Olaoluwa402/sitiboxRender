import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { MdVerifiedUser } from "react-icons/md";

import Message from "../../components/Message/Message";
import Spinner from "../../components/Spinner/Spinner";
import avatar from "../../img/avatar.png";
import { getPatientDetails } from "../../actions/patientActions";
import { useNavigate } from "react-router-dom";

import styled from "./PatientProfileScreen.module.css";

const PatientProfileScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const patientDetails = useSelector((state) => state.patientDetails);
  const { loading, error, patient } = patientDetails;

  const patientLogin = useSelector((state) => state.patientLogin);
  const { patientInfo } = patientLogin;

  // patientInfo will be null if not logged in
  useEffect(() => {
    if (!patientInfo) {
      navigate("/login");
    } else {
      dispatch(getPatientDetails("profile"));
    }
  }, [dispatch, navigate, patientInfo]);

  // sent text message to admin
  function capitalizeFirstLetter(string) {
    if (string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
  }

  return (
    <React.Fragment>
      {loading ? (
        <Spinner />
      ) : error ? (
        <Message message="dangerMessage">{error}</Message>
      ) : patient ? (
        <React.Fragment>
          <div className={styled.wrapper}>
            <div className={styled.left}>
              <h3>
                <Link to="/dashboard/document" style={{ color: "#ffffff" }}>
                  Change profile picture
                </Link>
              </h3>
              <img
                src={patient.image ? patient.image : avatar}
                alt="patient"
                width="300"
              />
              <h4>{capitalizeFirstLetter(patient.clinicName)}</h4>
              <p>{patient.gender}</p>
            </div>
            <div className={styled.right}>
              <h2 style={{ textAlign: "center", fontSize: "2rem" }}>PROFILE</h2>
              <div className={styled.info}>
                <h3>Information</h3>
                <Link to="/dashboard/profileupdate">Edit</Link>
                <div className="info_data">
                  <div className="data">
                    <h4>Email</h4>
                    <p>{patient.email}</p>
                  </div>
                  <div className="data">
                    <h4>
                      Phone{" "}
                      {patient.phoneVerified ? (
                        <span style={{ color: "green" }}>
                          verified <MdVerifiedUser />
                        </span>
                      ) : (
                        <Link to="/dashboard/verifyphone">Verify phone</Link>
                      )}
                    </h4>
                    <p>{patient.phone}</p>
                  </div>
                </div>
              </div>

              <div className={styled.projects}>
                <h3>Extra Details</h3>
                <div className={styled.projectsData}>
                  <div className={styled.data}>
                    <h4>One</h4>
                    <p>Sitibox 1.0</p>
                  </div>
                  <div className={styled.data}>
                    <h4>Two</h4>
                    <p>Sitibox 1.0</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </React.Fragment>
      ) : (
        <div style={{ marginTop: "2rem" }}>
          <h3>No patient yet</h3>
        </div>
      )}
    </React.Fragment>
  );
};

export default PatientProfileScreen;
