import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BiCheckShield } from "react-icons/bi";
import { FaTimes } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import Message from "../../components/Message/Message";
import Spinner from "../../components/Spinner/Spinner";
import { patientAdminDetail } from "../../actions/adminActions";
import { toast } from "react-toastify";
import avatar from "../../img/avatar.png";

import styled from "./PatientDetailsScreen.module.css";

const PatientDetailsScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { id } = useParams();
  const patientId = id;

  const adminLogin = useSelector((state) => state.adminLogin);
  const { adminInfo } = adminLogin;

  const adminPatientDetail = useSelector((state) => state.adminPatientDetail);
  const { loading, error, patient } = adminPatientDetail;

  // doctor Info will be null if not logged in
  useEffect(() => {
    if (!adminInfo) {
      navigate("/adminLogin");
      toast.warning("Please login!");
    }

    if (patientId) {
      dispatch(patientAdminDetail({ patientId }));
    }
  }, [dispatch, navigate, adminInfo, patientId]);

  return (
    <React.Fragment>
      <div className={styled.container}>
        <h1>PATIENT DETAILS</h1>
        {loading ? (
          <Spinner />
        ) : error ? (
          <Message message="dangerMessage">{error}</Message>
        ) : patient ? (
          <React.Fragment>
            <div className={styled.tableWrapper}>
              <table className="table-sm">
                <tr>
                  <th>
                    <img
                      src={patient.image ? patient.image : avatar}
                      alt="patient"
                      width="250px"
                      height="250px"
                    />
                  </th>
                  <td
                    style={{
                      fontSize: "2rem",
                      fontWeight: "bold",
                      display: "grid",
                    }}
                  >
                    <h4 style={{ margin: "auto" }}>{patient.clinicName}</h4>
                  </td>
                </tr>
                <tr>
                  <th>Email</th>
                  <td>{patient.email}</td>
                </tr>
                <tr>
                  <th>Phone</th>
                  <td>{patient.phone}</td>
                </tr>
                <tr>
                  <th>Phone Verified</th>
                  <td>
                    {patient.phoneVerified ? (
                      <BiCheckShield style={{ color: "green" }} />
                    ) : (
                      <FaTimes style={{ color: "red" }} />
                    )}
                  </td>
                </tr>
              </table>
            </div>
          </React.Fragment>
        ) : null}
      </div>
    </React.Fragment>
  );
};

export default PatientDetailsScreen;
