import React, { useEffect, useContext, useCallback, useState } from "react";
// import { PaystackButton } from "react-paystack";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/infoMsg/Message";
import Spinner from "../../components/Spinner/Spinner";
import { RiChat1Fill } from "react-icons/ri";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { WebSocketContext } from "../../WebSocket";
import Secure from "../../components/Secure/Secure";
import paystack from "../../img/paystack.png";
import { useNavigate, useParams } from "react-router-dom";
import {
  getOrderDetails,
  payOrder,
  deliverOrder,
  doctorHasBeenPaid,
} from "../../actions/orderActions";

import {
  CONSULTATIONORDER_PAY_RESET,
  CONSULTATIONORDER_DELIVER_RESET,
  DOCTORHASBEENPAID_RESET,
} from "../../constants/orderConstants";

import ImageViewer from "react-simple-image-viewer";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import { toast } from "react-toastify";

import styled from "./OrderScreen.module.css";

// extend dayjs plugins
dayjs.extend(utc);
dayjs.extend(timezone);

const OrderScreen = ({ match, history }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  // get id from match params
  const orderId = id;
  // set dispatch to a constant variable
  const dispatch = useDispatch();

  const [currentImage, setCurrentImage] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  // get all needed states from the store using useSelector hook
  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;

  const chat = useSelector((state) => state.chat);
  const { chatWithDoctor, chatWithPatient } = chat;

  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const {
    loading: loadingDeliver,
    error: errorDelivered,
    success: successDeliver,
  } = orderDeliver;

  const doctorIsPaid = useSelector((state) => state.doctorIsPaid);
  const {
    loading: loadingDoctorIsPaid,
    error: errorDoctorIsPaid,
    success: successDoctorIsPaid,
  } = doctorIsPaid;

  // const verifyPaystack = useSelector((state) => state.verifyPaystack);
  // const { success: successverifyPaystack, paymentResult } = verifyPaystack;

  const patientLogin = useSelector((state) => state.patientLogin);
  const { patientInfo } = patientLogin;

  const doctorLogin = useSelector((state) => state.doctorLogin);
  const { doctorInfo } = doctorLogin;

  const adminLogin = useSelector((state) => state.adminLogin);
  const { adminInfo } = adminLogin;

  const wlbs = useContext(WebSocketContext);

  // set useEffect to load all initial data on page load
  useEffect(() => {
    if (!patientInfo && !doctorInfo && !adminInfo) {
      navigate("/");
      toast.warning("please login");
    }

    if (
      !order ||
      successDeliver ||
      successDoctorIsPaid ||
      order._id !== orderId
    ) {
      dispatch({ type: CONSULTATIONORDER_DELIVER_RESET });
      dispatch({ type: DOCTORHASBEENPAID_RESET });
      dispatch(getOrderDetails(orderId));
    }

    // show and start chat for only logged in user with order paid for
    if (order) {
      if (order.isPaid && !order.isConfirmed) {
        const docID = order.consultationorderItem.doctor;
        const patientID = order.patient;
        const loggedInUser = patientInfo
          ? patientInfo._id
          : doctorInfo
          ? doctorInfo._id
          : null;

        const chatDataD = {
          docID: docID,
          isDoctor: true,
        };

        const chatDataP = {
          patientID: patientID,
          isPatient: true,
        };

        new Promise((res) => {
          dispatch(
            wlbs.chatUsersDetail({
              chatDataP: chatDataP,
              chatDataD: chatDataD,
              loggedInUser,
            })
          );
          setTimeout(res, 1000);
        }).then(() => {
          dispatch(wlbs.loadRoomMsgs());
        });
      }
    }
  }, [
    dispatch,
    orderId,
    successDeliver,
    successDoctorIsPaid,
    order,
    navigate,
    patientInfo,
    doctorInfo,
    adminInfo,
    wlbs,
  ]);

  useEffect(() => {
    if (successPay) {
      dispatch({ type: CONSULTATIONORDER_PAY_RESET });
      dispatch(getOrderDetails(orderId));
    } else {
      dispatch(getOrderDetails(orderId));
    }

    // if (!successPay && successverifyPaystack && orderId) {
    //   const paymentDetail = {
    //     id: paymentResult.data.data.customer.id,
    //     status: paymentResult.data.status,
    //     update_time: paymentResult.data.data.paidAt,
    //     email_address: paymentResult.data.data.customer.email,
    //   };

    // const amountPaid = Number(paymentResult.data.data.amount / 100);

    // const receiptDetail = {
    //   reference: paymentResult.data.data.reference,
    //   id: paymentResult.data.data.customer.id,
    //   paidAt: paymentResult.data.data.paidAt,
    //   email_address: paymentResult.data.data.customer.email,
    //   amount: amountPaid,
    //   last4Digit: paymentResult.data.data.authorization.last4,
    //   bank: paymentResult.data.data.authorization.bank,
    //   card_type: paymentResult.data.data.authorization.card_type,
    //   currency: paymentResult.data.data.currency,
    //   channel: paymentResult.data.data.authorization.channel,
    // };

    // dispatch pay order action
    // dispatch(payOrder(orderId, paymentDetail));

    // dispatch send receipt action
    // dispatch(sendReceipt({ orderId, receiptDetail }));
    // }

    //eslint-disable-next-line
  }, [dispatch, orderId, successPay]);

  //payment Handler
  const paymentHandler = () => {
    // dispatch pay order action
    console.log("payorder");
    dispatch(payOrder(orderId));
  };

  // delivered handler
  const deliverHandler = () => {
    dispatch(deliverOrder(order));
  };

  const doctorIsPaidHandler = () => {
    dispatch(doctorHasBeenPaid(order));
  };

  // chat handler
  const chatHandler = () => {
    dispatch(wlbs.clearActiveMsgs());
    const chatPath = doctorInfo
      ? `/docdashboard/chatroom`
      : patientInfo
      ? `/dashboard/chatroom`
      : null;
    navigate(chatPath);
  };

  const formatDate = (mydate) => {
    let event = new Date(mydate);
    let date = JSON.stringify(event);
    date = date.slice(1, 11);
    return date;
  };

  const dt = new Date();
  const date = dayjs.utc(dt, "z").add(1, "hour").tz("Africa/Lagos").format();
  // modifiedDate = new Date(date).toISOString();
  const modifiedDate = new Date(date).toISOString();

  let isExpired;
  if (order) {
    isExpired = modifiedDate > order.orderExpiryDate;
  }

  const images = [
    order && order.mycomplaint.image ? order.mycomplaint.image : null,
  ];

  const openImageViewer = useCallback((index) => {
    setCurrentImage(index);
    setIsViewerOpen(true);
  }, []);

  const closeImageViewer = () => {
    setCurrentImage(0);
    setIsViewerOpen(false);
  };

  return loading ? (
    <Spinner />
  ) : error ? (
    <Message message="dangerMessage">{error}</Message>
  ) : order ? (
    <React.Fragment>
      {order.isPaid && !order.isConfirmed && !isExpired && (
        <div className={styled.chatPanel}>
          <div>
            {patientInfo &&
              chatWithDoctor &&
              order.isPaid &&
              !order.isConfirmed &&
              !isExpired && (
                <div
                  onClick={chatHandler}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <RiChat1Fill
                    data-tip="click to start chat"
                    data-for="chatting"
                    className={styled.chatBox}
                  />
                  <span>{`Join Dr ${chatWithDoctor.name} in consulting room`}</span>
                </div>
              )}

            {doctorInfo &&
              chatWithPatient &&
              order.isPaid &&
              !order.isConfirmed && (
                <div
                  onClick={chatHandler}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <RiChat1Fill
                    data-tip="click to start chat"
                    data-for="chatting"
                    className={styled.chatBox}
                  />
                  <span>{`Join ${chatWithPatient.name} in consulting room`}</span>
                  <ReactTooltip id="chatting" />
                </div>
              )}
          </div>
        </div>
      )}
      {doctorInfo && (
        <div
          style={{
            width: "300px",
            borderRadius: "10px",
            margin: " 15px",
            padding: "10px",
            backgroundColor: "#000",
            color: "#fff",
          }}
        >
          <small>
            <b>TIPS: </b>
            Don't share personal phone numbers during chats.
            <br />
            Don't write prescriptions in chat box.
            <br />
            Always use the prescription tool on your dashboard
          </small>
        </div>
      )}
      <div className={styled.container}>
        <div className={styled.title__wrapper}>
          <h1 className={styled.title}>Consultation Order</h1>
          {order.isPaid && (
            <div className={styled.paid}>
              Paid on {order.paidAt.substring(0, 10)}
            </div>
          )}
        </div>

        <section className={styled.first__section}>
          <div className={styled.left}>
            <div className={styled.consultation__price}>
              <h2>CONSULTATION FEE</h2>
              <p>
                <strong>Rate:</strong>
                <span className={styled.rate}>
                  ₦{order.consultationPrice} per consultation
                </span>
              </p>
            </div>

            <div className={styled.payment__method}>
              <h2>PAYMENT METHOD</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethods}
              </p>
              {order.isPaid ? (
                <div className={styled.paid}>
                  Paid on {order.paidAt.substring(0, 10)}
                </div>
              ) : (
                <div className={styled.notPaid}>Not Paid</div>
              )}
            </div>

            {!order.isPaid && !isExpired && patientInfo && (
              <div className={styled.payment__btn}>
                <React.Fragment>
                  {loadingPay ? (
                    <Spinner />
                  ) : (
                    <button className={styled.btn} onClick={paymentHandler}>
                      Pay from Wallet
                    </button>
                  )}
                </React.Fragment>
                <img
                  src={paystack}
                  alt="paystack"
                  style={{ marginTop: "5px" }}
                />
                <Secure textColor="#000000" />
                <div
                  style={{
                    color: "#00008b",
                    fontSize: "0.8rem",
                    fontWeight: "bold",
                  }}
                >
                  Final step!, Just a click away from Dr{" "}
                  {order.consultationorderItem.firstName}
                </div>
              </div>
            )}
          </div>
          <div className={styled.right}>
            <div className={styled.complaint}>
              <h2>COMPLAINT</h2>
              {order.mycomplaint && (
                <React.Fragment>
                  <div>
                    <p>
                      <strong>First Name:</strong> {order.mycomplaint.firstName}
                      ,
                    </p>
                    <p>
                      <strong>Last Name:</strong> {order.mycomplaint.lastName},
                    </p>

                    <p>
                      <strong>Age:</strong>{" "}
                      {order && order.mycomplaint ? order.mycomplaint.age : ""},
                    </p>
                    <p>
                      <strong>Gender:</strong>{" "}
                      {order && order.gender ? order.gender.age : ""},
                    </p>
                    <p>
                      <strong>Complaint:</strong> {order.mycomplaint.complaint},
                    </p>
                  </div>
                </React.Fragment>
              )}

              {images.length > 0 &&
                images.map((src, index) => (
                  <img
                    src={src}
                    onClick={() => openImageViewer(index)}
                    key={index}
                    style={{ margin: "2px" }}
                    alt=""
                    className={styled.complaintImg}
                  />
                ))}

              {isViewerOpen && (
                <ImageViewer
                  src={images}
                  currentIndex={currentImage}
                  onClose={closeImageViewer}
                  disableScroll={false}
                  backgroundStyle={{
                    backgroundColor: "rgba(0,0,0,0.9)",
                  }}
                  closeOnClickOutside={true}
                />
              )}
            </div>
          </div>
        </section>

        <section className={styled.second__section}>
          <div className={styled.left}>
            <h2>CONSULTING DOCTOR</h2>

            {order.consultationorderItem && (
              <React.Fragment>
                <div className={styled.consultOrder}>
                  <p>
                    <strong>Name:</strong> Dr.{" "}
                    {order.consultationorderItem.firstName},
                  </p>
                  <p>
                    <strong>Specialty:</strong>{" "}
                    {order.consultationorderItem.specialty},
                  </p>
                  <div>
                    <h2>Consultation status</h2>

                    {order.isConfirmed ? (
                      <div className={styled.paid}>Completed</div>
                    ) : (
                      <div className={styled.notPaid}>Not Completed</div>
                    )}
                    {order.doctorIsPaid && (
                      <div
                        style={{ marginTop: "1rem" }}
                        className={styled.paid}
                      >
                        Doctor paid
                      </div>
                    )}

                    {loadingDeliver && <Spinner />}
                    {errorDelivered && (
                      <div className={styled.notPaid}>{errorDelivered}</div>
                    )}
                    {doctorInfo &&
                      order.isPaid &&
                      order.summaryWritten &&
                      !order.isConfirmed && (
                        <div>
                          <button
                            type="button"
                            className={styled.btn}
                            onClick={deliverHandler}
                          >
                            Mark As Completed
                          </button>
                        </div>
                      )}

                    {loadingDoctorIsPaid && <Spinner />}
                    {errorDoctorIsPaid && (
                      <div className={styled.paid}>{errorDelivered}</div>
                    )}
                    {adminInfo &&
                      order.isPaid &&
                      order.isConfirmed &&
                      !order.doctorIsPaid && (
                        <div>
                          <button
                            type="button"
                            className={styled.btn}
                            onClick={doctorIsPaidHandler}
                          >
                            Mark Doctor As Paid
                          </button>
                        </div>
                      )}
                  </div>
                </div>
              </React.Fragment>
            )}
          </div>
          <div className={styled.right}>
            <div className={styled.imgBox}>
              <img
                src={order.consultationorderItem.image}
                alt="doctor"
                style={{ width: "300px", height: "250px" }}
              />
            </div>
          </div>
        </section>
      </div>

      {/* <section>
        {order.mycomplaint.image && (
          <div className={styled.imgBox}>
            <img
              src={order.mycomplaint.image}
              alt="chosen"
              // style={{ height: "250px" }}
            />
          </div>
        )}
      </section> */}
    </React.Fragment>
  ) : (
    <div>No Orders yets</div>
  );
};

export default OrderScreen;
