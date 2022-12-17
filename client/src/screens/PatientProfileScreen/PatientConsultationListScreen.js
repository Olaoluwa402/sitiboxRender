import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaTimes } from "react-icons/fa";

import Message from "../../components/Message/Message";
import Spinner from "../../components/Spinner/Spinner";
import { listMyOrders } from "../../actions/orderActions";
import WalletBalance from "../../components/wallet/WalletBalance/WalletBalance";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import $ from "jquery";

import styled from "./PatientConsultationListScreen.module.css";

// extend dayjs plugins
dayjs.extend(utc);
dayjs.extend(timezone);

const PatientConsultationListScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const patientLogin = useSelector((state) => state.patientLogin);
  const { patientInfo } = patientLogin;

  const orderListMy = useSelector((state) => state.orderListMy);
  const { loading: loadingOrders, error: errorOrders, orders } = orderListMy;

  // patientInfo will be null if not logged in
  useEffect(() => {
    if (!patientInfo) {
      navigate("/");
    } else {
      dispatch(listMyOrders());
    }
  }, [dispatch, navigate, patientInfo]);

  $(function () {
    $(".fold-table tr.view").on("click", function () {
      $(this).toggleClass("open").next(".fold").toggleClass("open");
    });
  });

  const dt = new Date();
  const date = dayjs.utc(dt, "z").add(1, "hour").tz("Africa/Lagos").format();
  // modifiedDate = new Date(date).toISOString();
  const modifiedDate = new Date(date).toISOString();

  // capitalize
  function capitalizeFirstLetter(string) {
    if (string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
  }

  return (
    <React.Fragment>
      {/* wallet */}
      <WalletBalance />

      {/* consultation */}
      <div className={styled.container}>
        <h1>My Consultations</h1>
        {loadingOrders ? (
          <Spinner />
        ) : errorOrders ? (
          <Message message="dangerMessage">{errorOrders}</Message>
        ) : orders && orders.length > 0 ? (
          <div className={` accordion-table ${styled.tableWrapper}`}>
            <table className={`fold-table ${styled.foldTable}`}>
              <thead>
                <tr>
                  <th>DATE</th>
                  <th>DOCTOR</th>
                  <th>PAID</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <>
                    <tr className={`view`}>
                      <td>{order.createdAt.substring(0, 10)}</td>
                      <td>
                        {capitalizeFirstLetter(
                          order.consultationorderItem.firstName
                        ) +
                          " " +
                          capitalizeFirstLetter(
                            order.consultationorderItem.lastName
                          )}
                      </td>
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
                    </tr>
                    <tr className="fold">
                      <td colSpan="100%">
                        <div className="fold-content" style={{ width: "100%" }}>
                          <table style={{ width: "60%" }}>
                            <tbody>
                              <tr>
                                <td>
                                  <h2>Order Related</h2>
                                </td>
                              </tr>
                              <tr>
                                <th>First Name</th>
                                <td>
                                  {capitalizeFirstLetter(
                                    order.consultationorderItem.firstName
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <th>Last Name</th>
                                <td>
                                  {capitalizeFirstLetter(
                                    order.consultationorderItem.lastName
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <th>FEE</th>
                                <td>{order.consultationPrice}</td>
                              </tr>
                              <tr>
                                <th>
                                  <Link to={`dashboard/order/${order._id}`}>
                                    <button className={styled.btn}>
                                      Consult
                                    </button>
                                  </Link>
                                </th>
                                <td></td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  </>
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

export default PatientConsultationListScreen;
