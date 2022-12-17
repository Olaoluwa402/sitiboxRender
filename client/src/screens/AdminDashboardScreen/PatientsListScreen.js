import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import { BiCheckShield } from "react-icons/bi";
import { FaTrash } from "react-icons/fa";

import Message from "../../components/Message/Message";
import Spinner from "../../components/Spinner/Spinner";
import {
  getPatientsList,
  adminDeletePatient,
} from "../../actions/adminActions";
import { PATIENT_DELETE_RESET } from "../../constants/adminConstants";
import { toast } from "react-toastify";

import styled from "./PatientsListScreen.module.css";

const PatientsListScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const adminLogin = useSelector((state) => state.adminLogin);
  const { adminInfo } = adminLogin;

  const allPatients = useSelector((state) => state.allPatients);
  const { loading, error, patients } = allPatients;

  const patientDelete = useSelector((state) => state.patientDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = patientDelete;

  // doctor Info will be null if not logged in
  useEffect(() => {
    if (!adminInfo) {
      navigate("/adminlogin");
      toast.warning("Admins only!");
    } else {
      if (successDelete) {
        dispatch({ type: PATIENT_DELETE_RESET });
        dispatch(getPatientsList());
        toast.success("Successfully Deleted");
      } else {
        dispatch(getPatientsList());
      }
    }
  }, [dispatch, navigate, successDelete, adminInfo]);

  const deleteHandler = (id) => {
    if (
      window.confirm("Are you sure?, all associated resources will be removed")
    ) {
      dispatch(adminDeletePatient(id));
    }
  };

  return (
    <React.Fragment>
      <div className={styled.container}>
        <h1>All Patients</h1>
        {loadingDelete && <Spinner />}
        {errorDelete && (
          <Message message="dangerMessage">{errorDelete}</Message>
        )}
        {loading ? (
          <Spinner />
        ) : error ? (
          <Message message="dangerMessage">{error}</Message>
        ) : patients && patients.length > 0 ? (
          <div className={styled.tableWrapper}>
            <table className="table-sm">
              <thead>
                <tr>
                  <th>REG DATE</th>
                  <th>Clinic Name</th>
                  <th>Phone verified</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr key={patient._id}>
                    <td>{patient.createdAt.substring(0, 10)}</td>
                    <td>{patient.clinicName}</td>
                    <td>
                      {patient.phoneVerified ? (
                        <BiCheckShield style={{ color: "green" }} />
                      ) : (
                        <FaTimes style={{ color: "red" }} />
                      )}
                    </td>
                    <td>
                      <Link to={`/admindashboard/patients/${patient._id}`}>
                        <button className={styled.btn}>Details</button>
                      </Link>
                    </td>
                    <td>
                      <Link to={`/admindashboard/email/${patient._id}`}>
                        <button className={styled.btn}>Mail</button>
                      </Link>
                    </td>
                    <td>
                      <Link to={`/admindashboard/sms/${patient._id}`}>
                        <button className={styled.btn}>Sms</button>
                      </Link>
                    </td>
                    <td>
                      <button
                        className={styled.btn}
                        onClick={() => deleteHandler(patient._id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ marginTop: "2rem" }}>
            <h3>No data yet</h3>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default PatientsListScreen;
