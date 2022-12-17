import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import { BiCheckShield } from "react-icons/bi";

import Message from "../../components/Message/Message";
import Spinner from "../../components/Spinner/Spinner";
import { listAllConsultationRequest } from "../../actions/orderActions";
import { toast } from "react-toastify";

import styled from "./AdminDefaultScreen.module.css";

const AdminDefaultScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const adminLogin = useSelector((state) => state.adminLogin);
  const { adminInfo } = adminLogin;

  const allConsultationRequests = useSelector(
    (state) => state.allConsultationRequests
  );
  const { loading, error, orders } = allConsultationRequests;

  // doctor Info will be null if not logged in
  useEffect(() => {
    if (!adminInfo) {
      navigate("/adminlogin");
      toast.warning("Admins only!");
    } else {
      dispatch(listAllConsultationRequest());
    }
  }, [dispatch, navigate, adminInfo]);

  // capitalize
  function capitalizeFirstLetter(string) {
    if (string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
  }

  return (
    <React.Fragment>
      <div className={styled.container}>
        <h1>All Consultations</h1>
        {loading ? (
          <Spinner />
        ) : error ? (
          <Message message="dangerMessage">{error}</Message>
        ) : orders && orders.length > 0 ? (
          <div className={styled.tableWrapper}>
            <table className="table-sm">
              <thead>
                <tr>
                  <th>DATE</th>
                  <th>PATIENT</th>
                  <th>DOCTOR</th>
                  <th>FEE</th>
                  <th>PAID</th>
                  <th>STATUS</th>
                  <th>DOCTOR PAID</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order.createdAt.substring(0, 10)}</td>
                    <td>
                      {order.patient
                        ? capitalizeFirstLetter(order.patient.clinicName)
                        : "Patient Deleted"}
                    </td>
                    <td>
                      {adminInfo ? (
                        <Link
                          to={`/admindashboard/doctors/${order.consultationorderItem.doctor}`}
                        >
                          {order.consultationorderItem.firstName +
                            " " +
                            order.consultationorderItem.lastName}
                        </Link>
                      ) : (
                        order.consultationorderItem.firstName +
                        " " +
                        order.consultationorderItem.lastName
                      )}
                    </td>
                    <td>{order.consultationPrice}</td>
                    <td>
                      {order.isPaid ? (
                        order.paidAt.substring(0, 10)
                      ) : (
                        <FaTimes style={{ color: "red" }} />
                      )}
                    </td>
                    <td>
                      {order.isConfirmed ? (
                        <span>
                          Completed & closed@{" "}
                          {order.isConfirmedAt.substring(0, 10)}{" "}
                        </span>
                      ) : (
                        <FaTimes style={{ color: "red" }} />
                      )}
                    </td>
                    <td>
                      {order.doctorIsPaid ? (
                        <BiCheckShield style={{ color: "green" }} />
                      ) : (
                        <FaTimes style={{ color: "red" }} />
                      )}
                    </td>
                    <td>
                      <Link to={`/admindashboard/order/${order._id}`}>
                        <button className={styled.btn}>Consult</button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ marginTop: "2rem" }}>
            <h3>No order yet</h3>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default AdminDefaultScreen;
