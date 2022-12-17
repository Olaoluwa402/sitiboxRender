import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { listDoctorConsultationRequest } from "../../actions/orderActions";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

// import Message from "../../components/Message/Message";
// import Spinner from "../../components/Spinner/Spinner";

// import styled from "./PaymentScreen.module.css";
import WalletBalance from "../../components/wallet/WalletBalance/WalletBalance";
// import Title from "../../components/Title";
import Transactions from "../../components/wallet/Transactions/Transactions";

const PaymentScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const doctorLogin = useSelector((state) => state.doctorLogin);
  const { doctorInfo } = doctorLogin;

  const doctorConsultationRequests = useSelector(
    (state) => state.doctorConsultationRequests
  );
  const { orders } = doctorConsultationRequests;

  // doctor Info will be null if not logged in
  useEffect(() => {
    if (!doctorInfo) {
      navigate("/");
      toast.warning("Only registered doctors are authorized!");
    } else {
      dispatch(listDoctorConsultationRequest());
    }
  }, [dispatch, navigate, doctorInfo]);

  // consultation in progress logic
  let consultationInProgress;
  if (orders) {
    consultationInProgress = orders.filter(
      (order) => order.isConfirmed === false && order.isPaid === true
    );
  }
  // consultation completed & doctor yet to be paid logic
  let consultationCompleted;
  if (orders) {
    consultationCompleted = orders.filter(
      (order) => order.isConfirmed === true && order.doctorIsPaid === false
    );
  }
  // doctor paid logic
  let doctorPaid;
  if (orders) {
    doctorPaid = orders.filter(
      (order) => order.isConfirmed === true && order.doctorIsPaid === true
    );
  }

  // doctor not yet paid logic
  let doctorNotPaid;
  if (orders) {
    doctorNotPaid = orders.filter(
      (order) => order.isConfirmed === true && order.doctorIsPaid === false
    );
  }

  return (
    <React.Fragment>
      <WalletBalance />
      <Transactions />

      {/* {loading ? (
        <Spinner />
      ) : error ? (
        <Message message="dangerMessage">{error}</Message>
      ) : orders ? (
        <div className={styled.container}>
          <div className={styled.paymentContainer}>
            <div className={`${styled.itemBox_1} ${styled.itemBox}`}>
              <Link to="/docdashboard" className={styled.itemHeader}>
                <h3>Total Orders</h3>
              </Link>
              <div className={styled.itemValue}>
                <p>{orders.length > 0 ? orders.length : 0}</p>
              </div>
            </div>
            <div className={`${styled.itemBox_2} ${styled.itemBox}`}>
              <div className={styled.itemHeader}>
                <h3>Consultation on</h3>
              </div>
              <div className={styled.itemValue}>
                <p>
                  {consultationInProgress.length > 0
                    ? consultationInProgress.length
                    : 0}
                </p>
              </div>
            </div>
            <div className={`${styled.itemBox_3} ${styled.itemBox}`}>
              <div className={styled.itemHeader}>
                <h3>Consultation Completed</h3>
              </div>
              <div className={styled.itemValue}>
                <p>
                  {consultationCompleted.length > 0
                    ? consultationCompleted.length
                    : 0}
                </p>
              </div>
            </div>
            <div className={`${styled.itemBox_4} ${styled.itemBox}`}>
              <div className={styled.itemHeader}>
                <h3>Amount Due</h3>
              </div>
              <div className={styled.itemValue}>
                <p>₦{`${consultationCompleted.length * 1200}`}</p>
              </div>
            </div>
            <div className={`${styled.itemBox_5} ${styled.itemBox}`}>
              <div className={styled.itemHeader}>
                <h3>Paid</h3>
              </div>
              <div className={styled.itemValue}>
                <p>{doctorPaid.length > 0 ? doctorPaid.length : 0}</p>
              </div>
            </div>
            <div className={`${styled.itemBox_6} ${styled.itemBox}`}>
              <div className={styled.itemHeader}>
                <h3>UnPaid</h3>
              </div>
              <div className={styled.itemValue}>
                <p>{doctorNotPaid.length > 0 ? doctorNotPaid.length : 0}</p>
              </div>
            </div>
          </div>
        </div>
      ) : null} */}
    </React.Fragment>
  );
};

export default PaymentScreen;
