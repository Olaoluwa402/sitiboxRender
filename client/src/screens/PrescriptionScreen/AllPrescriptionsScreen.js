import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import Message from "../../components/Message/Message";
import Spinner from "../../components/Spinner/Spinner";
import { allPrescriptionsList } from "../../actions/adminActions";
import { toast } from "react-toastify";

import styled from "./DoctorPrescriptionListScreen.module.css";

const AllPrescriptionsScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const adminLogin = useSelector((state) => state.adminLogin);
  const { adminInfo } = adminLogin;

  const allPrescriptions = useSelector((state) => state.allPrescriptions);
  const { loading, error, prescriptions } = allPrescriptions;

  // doctor Info will be null if not logged in
  useEffect(() => {
    if (!adminInfo) {
      navigate("/adminlogin");
      toast.warning("Please login!");
    } else {
      dispatch(allPrescriptionsList());
    }
  }, [dispatch, navigate, adminInfo]);

  return (
    <React.Fragment>
      <div className={styled.container}>
        <h1>All Prescriptions</h1>
        {loading ? (
          <Spinner />
        ) : error ? (
          <Message message="dangerMessage">{error}</Message>
        ) : prescriptions && prescriptions.length > 0 ? (
          <div className={styled.tableWrapper}>
            <table className="table-sm">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>DATE</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {prescriptions.map((prescription) => (
                  <tr key={prescription._id}>
                    <td>{prescription._id}</td>
                    <td>{prescription.createdAt.substring(0, 10)}</td>
                    <td>
                      <Link
                        to={`/admindashboard/prescription/${prescription._id}`}
                      >
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

export default AllPrescriptionsScreen;
