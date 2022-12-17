import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import Message from "../../components/Message/Message";
import Spinner from "../../components/Spinner/Spinner";
import { doctorPrescriptionList } from "../../actions/doctorActions";
import { toast } from "react-toastify";

import styled from "./DoctorPrescriptionListScreen.module.css";

const DoctorPrescriptionListScreen = ({ history, location }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const doctorLogin = useSelector((state) => state.doctorLogin);
  const { doctorInfo } = doctorLogin;

  const docprescriptionList = useSelector((state) => state.docprescriptionList);
  const { loading, error, docprescriptions } = docprescriptionList;

  // doctor Info will be null if not logged in
  useEffect(() => {
    if (!doctorInfo) {
      navigate("/doclogin");
      toast.warning("Please login!");
    } else {
      dispatch(doctorPrescriptionList());
    }
  }, [dispatch, navigate, doctorInfo]);

  // capitalize
  function capitalizeFirstLetter(string) {
    if (string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
  }

  return (
    <React.Fragment>
      <div className={styled.container}>
        <h1>Patients Prescriptions</h1>
        {loading ? (
          <Spinner />
        ) : error ? (
          <Message message="dangerMessage">{error}</Message>
        ) : docprescriptions && docprescriptions.length > 0 ? (
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
                {docprescriptions.map((prescription) => (
                  <tr key={prescription._id}>
                    <td>{prescription.createdAt.substring(0, 10)}</td>
                    <td>
                      {capitalizeFirstLetter(prescription.patient.firstName)}{" "}
                      {capitalizeFirstLetter(prescription.patient.lastName)}
                    </td>

                    <td>
                      <Link
                        to={`/docdashboard/prescription/${prescription._id}`}
                      >
                        <button className={styled.btn}>View</button>
                      </Link>
                    </td>
                    <td>
                      <Link
                        to={`/docdashboard/prescription/${prescription._id}/edit`}
                      >
                        <button className={styled.btn}>Edit</button>
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

export default DoctorPrescriptionListScreen;
