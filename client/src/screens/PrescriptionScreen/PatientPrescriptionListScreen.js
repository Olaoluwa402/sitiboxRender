import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import Message from "../../components/Message/Message";
import Spinner from "../../components/Spinner/Spinner";
import { patientPrescriptionList } from "../../actions/patientActions";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import styled from "./PatientPrescriptionListScreen.module.css";

const PatientPrescriptionListScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const patientLogin = useSelector((state) => state.patientLogin);
  const { patientInfo } = patientLogin;

  const myprescriptionList = useSelector((state) => state.myprescriptionList);
  const { loading, error, prescriptions } = myprescriptionList;

  // doctor Info will be null if not logged in
  useEffect(() => {
    if (!patientInfo) {
      navigate("/login");
      toast.warning("Please login!");
    } else {
      dispatch(patientPrescriptionList());
    }
  }, [dispatch, navigate, patientInfo]);

  // capitalize
  function capitalizeFirstLetter(string) {
    if (string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
  }

  return (
    <React.Fragment>
      <div className={styled.container}>
        <h1>My Prescriptions</h1>
        {loading ? (
          <Spinner />
        ) : error ? (
          <Message message="dangerMessage">{error}</Message>
        ) : prescriptions && prescriptions.length > 0 ? (
          <div className={styled.tableWrapper}>
            <table className="table-sm">
              <thead>
                <tr>
                  <th>DATE</th>
                  <th>NAME</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {prescriptions.map((prescription) => (
                  <tr key={prescription._id}>
                    <td>{prescription.createdAt.substring(0, 10)}</td>
                    <td>
                      {capitalizeFirstLetter(prescription.patient.firstName)}{" "}
                      {capitalizeFirstLetter(prescription.patient.lastName)}
                    </td>

                    <td>
                      <Link to={`/dashboard/prescription/${prescription._id}`}>
                        <button className={styled.btn}>View</button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ marginTop: "2rem" }}>
            <h3>No prescription yet</h3>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default PatientPrescriptionListScreen;
