import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";

import Message from "../../components/Message/Message";
import Spinner from "../../components/Spinner/Spinner";
import { listDoctorConsultationRequest } from "../../actions/orderActions";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { BiCheckShield } from "react-icons/bi";
import $ from "jquery";
import WalletBalance from "../../components/wallet/WalletBalance/WalletBalance";

import styled from "./DoctorConsultationListScreen.module.css";

// extend dayjs plugins
dayjs.extend(utc);
dayjs.extend(timezone);

const DoctorConsultationListScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const doctorLogin = useSelector((state) => state.doctorLogin);
  const { doctorInfo } = doctorLogin;

  const doctorConsultationRequests = useSelector(
    (state) => state.doctorConsultationRequests
  );
  const { loading, error, orders } = doctorConsultationRequests;

  // doctor Info will be null if not logged in
  useEffect(() => {
    if (!doctorInfo) {
      navigate("/");
      toast.warning("Only registered doctors are authorized!");
    } else {
      dispatch(listDoctorConsultationRequest());
    }
  }, [dispatch, navigate, doctorInfo]);

  $(function () {
    $(".fold-table tr.view").on("click", function () {
      $(this).toggleClass("open").next(".fold").toggleClass("open");
    });
  });

  // capitalize
  function capitalizeFirstLetter(string) {
    if (string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
  }

  const dt = new Date();
  const date = dayjs.utc(dt, "z").add(1, "hour").tz("Africa/Lagos").format();
  // modifiedDate = new Date(date).toISOString();
  const modifiedDate = new Date(date).toISOString();

  // action handlers
  const prescriptionHandler = (id) => {
    navigate(`/docdashboard/newprescription/${id}`);
  };

  const caseHandler = (id) => {
    navigate(`/docdashboard/newsummary/${id}`);
  };

  const referralHandler = (id) => {
    navigate(`/docdashboard/newreferral/${id}`);
  };

  return (
    <React.Fragment>
      {/* wallet */}
      <WalletBalance />

      {/* consultation */}
      <div className={styled.container}>
        <h1>Consultations Request(s)</h1>
        {loading ? (
          <Spinner />
        ) : error ? (
          <Message message="dangerMessage">{error}</Message>
        ) : orders && orders.length > 0 ? (
          <div className={` accordion-table ${styled.tableWrapper}`}>
            <table className={`fold-table ${styled.foldTable}`}>
              <thead>
                <tr>
                  <th>DATE</th>
                  <th>CLIENT</th>
                  <th>PAID</th>
                  <th>STATUS</th>
                  <th>DOCTOR PAID</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <>
                    <tr key={order._id} className={`view`}>
                      <td>{order.createdAt.substring(0, 10)}</td>
                      <td>
                        {order.patient
                          ? `${capitalizeFirstLetter(
                              order.mycomplaint.firstName
                            )} ${capitalizeFirstLetter(
                              order.mycomplaint.lastName
                            )}`
                          : "Patient Deleted"}
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
                      <td>
                        {order.doctorIsPaid ? (
                          <BiCheckShield style={{ color: "green" }} />
                        ) : (
                          <FaTimes style={{ color: "red" }} />
                        )}
                      </td>
                    </tr>
                    <tr className="fold">
                      <td colspan="100%">
                        <div class="fold-content" style={{ width: "100%" }}>
                          <table style={{ width: "60%" }}>
                            <tbody>
                              <h2>Order Related</h2>
                              <tr>
                                <th>Clinic Name</th>
                                <td>
                                  {order.patient
                                    ? capitalizeFirstLetter(
                                        order.patient.clinicName
                                      )
                                    : "Patient Deleted"}
                                </td>
                              </tr>
                              <tr>
                                <th>FEE</th>
                                <td>{order.consultationPrice}</td>
                              </tr>
                              <tr>
                                <th>
                                  <Link to={`/docdashboard/order/${order._id}`}>
                                    <button className={styled.btn}>
                                      Consult
                                    </button>
                                  </Link>
                                </th>
                                <td></td>
                              </tr>
                              <tr>
                                <th>
                                  <button
                                    className={styled.btn}
                                    disabled={
                                      order.isPaid &&
                                      modifiedDate < order.orderExpiryDate &&
                                      !order.isConfirmed
                                        ? false
                                        : true
                                    }
                                    onClick={() =>
                                      prescriptionHandler(order._id)
                                    }
                                  >
                                    Send prescription
                                  </button>
                                </th>
                                <td></td>
                              </tr>
                              <tr>
                                <th>
                                  <button
                                    className={styled.btn}
                                    disabled={
                                      order.isPaid &&
                                      modifiedDate < order.orderExpiryDate &&
                                      !order.isConfirmed
                                        ? false
                                        : true
                                    }
                                    onClick={() => caseHandler(order._id)}
                                  >
                                    Write Summary
                                  </button>
                                </th>
                                <td></td>
                              </tr>
                              <tr>
                                <th>
                                  <button
                                    className={styled.btn}
                                    disabled={
                                      order.isPaid &&
                                      modifiedDate < order.orderExpiryDate &&
                                      !order.isConfirmed
                                        ? false
                                        : true
                                    }
                                    onClick={() => referralHandler(order._id)}
                                  >
                                    Write Referral
                                  </button>
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
            <h3>No orders yet</h3>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default DoctorConsultationListScreen;
