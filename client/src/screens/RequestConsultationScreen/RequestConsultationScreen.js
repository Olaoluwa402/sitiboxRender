import React, { useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiFillIdcard } from "react-icons/ai";
import { GiStethoscope } from "react-icons/gi";
import { RiSecurePaymentLine } from "react-icons/ri";
import Message from "../../components/Message/Message";
import Spinner from "../../components/Spinner/Spinner";
import Layout from "../../components/Layout/Layout";
import ImageViewer from "react-simple-image-viewer";
import {
  createConsultationOrder,
  getPromoCode,
} from "../../actions/orderActions";
import {
  CONSULTATIONORDER_CREATE_RESET,
  PROMO_CODE_RESET,
} from "../../constants/orderConstants";
import { useNavigate } from "react-router-dom";
import { INITIATE_CLEAR_ITEMS } from "../../constants/initiateConstants";
import { toast } from "react-toastify";

import styled from "./RequestConsultationScreen.module.css";

const RequestConsultationScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [code, setCode] = useState("");

  const [currentImage, setCurrentImage] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const initiate = useSelector((state) => state.initiate);
  const { initiateItem, addComplaint } = initiate;

  const orderCreate = useSelector((state) => state.orderCreate);
  const { loading, order, success, error } = orderCreate;

  const patientLogin = useSelector((state) => state.patientLogin);
  const { patientInfo } = patientLogin;

  const codepromo = useSelector((state) => state.codepromo);
  const {
    loading: loadingPromo,
    success: successPromo,
    error: errorPromo,
    mcode,
  } = codepromo;

  useEffect(() => {
    if (!patientInfo) {
      navigate("/login");
      toast.warning("Not authorized! Only logged-In patients");
    } else {
      if (success) {
        navigate(`/dashboard/order/${order._id}`);
        dispatch({ type: CONSULTATIONORDER_CREATE_RESET });
        dispatch({ type: PROMO_CODE_RESET });
      }
    }
    // eslint-disable-next-line
  }, [navigate, success, patientInfo]);

  //   Calculate price
  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };

  const regularConsultationPrice = 1500;
  const promoPrice = 1000;

  const placeOrderHandler = () => {
    if (mcode) {
      initiate.consultationPrice = addDecimals(Number(promoPrice).toFixed(2));

      dispatch(
        createConsultationOrder({
          consultationorderItem: initiateItem,
          complaint: addComplaint,
          paymentMethods: "Paystack",
          consultationPrice: initiate.consultationPrice,
        })
      );
    } else {
      initiate.consultationPrice = addDecimals(
        Number(regularConsultationPrice).toFixed(2)
      );

      dispatch(
        createConsultationOrder({
          consultationorderItem: initiateItem,
          complaint: addComplaint,
          paymentMethods: "Paystack",
          consultationPrice: initiate.consultationPrice,
        })
      );
    }
  };

  const editComplaintHandler = () => {
    dispatch({ type: INITIATE_CLEAR_ITEMS });
    localStorage.removeItem("initiateItem");
    navigate("/complaint");
  };

  const promocodeHandler = (e) => {
    e.preventDefault();
    if (!code) return;
    if (code) {
      dispatch(getPromoCode({ code }));
      setCode(" ");
    }
  };

  // convert to date
  let event = new Date(addComplaint.birthdate);
  let date = JSON.stringify(event);
  date = date.slice(1, 11);

  // image viewer
  const images = [addComplaint && addComplaint.file ? addComplaint.file : null];

  const openImageViewer = useCallback((index) => {
    setCurrentImage(index);
    setIsViewerOpen(true);
  }, []);

  const closeImageViewer = () => {
    setCurrentImage(0);
    setIsViewerOpen(false);
  };

  return (
    <Layout>
      <React.Fragment>
        <div className={styled.container}>
          <div className={styled.wrapper}>
            <div className={styled.leftCol}>
              <div className={styled.iconWrapper}>
                <RiSecurePaymentLine className={styled.icons} />
                <h2>Payment</h2>
              </div>
              <div className={styled.promoStyled}>
                <label htmlFor="promo">
                  Promo code:
                  {successPromo ? (
                    <span className={styled.discount}>₦{promoPrice}</span>
                  ) : null}
                </label>
                <input
                  type="text"
                  name="promo"
                  placeholder="Have promo code? enter it here"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
                {loadingPromo && <Spinner />}
                {errorPromo && (
                  <Message message="dangerMessage">{errorPromo}</Message>
                )}
                {successPromo && (
                  <Message message="defaultMessage">Successful!</Message>
                )}

                {successPromo ? (
                  <div className={styled.btnBox}>
                    <button
                      type="button"
                      className={styled.btn}
                      disabled={!initiateItem && !addComplaint}
                      onClick={placeOrderHandler}
                    >
                      Create consultation order
                    </button>
                  </div>
                ) : (
                  <div
                    className={styled.btnBox}
                    style={{ marginBottom: "2rem" }}
                  >
                    <button onClick={promocodeHandler} className={styled.btn}>
                      Enter
                    </button>
                  </div>
                )}

                <div className={styled.btnBox}>
                  <button
                    type="button"
                    className={styled.btn}
                    disabled={!initiateItem && !addComplaint}
                    onClick={placeOrderHandler}
                  >
                    Create consultation
                  </button>
                </div>
              </div>
              <div>
                <h2>Consultation Fee</h2>
                <p>
                  <strong>Promo:</strong>
                  <span className={styled.rate}>₦1200</span>
                </p>
                <p>
                  <strong>Regular:</strong>
                  <span className={styled.rate}>
                    <del>₦{regularConsultationPrice} per consultation</del>
                  </span>
                </p>
              </div>

              <div>
                {error && <Message message="dangerMessage">{error}</Message>}
                {loading && <Spinner />}
              </div>

              <div className={styled.boxes}>
                <h2>Payment Method</h2>
                <p>
                  <strong>Method: </strong>
                  {`Paystack`}
                </p>
              </div>
            </div>

            <div className={styled.rightCol}>
              <div className={styled.boxes}>
                <div className={styled.iconWrapper}>
                  <AiFillIdcard className={styled.icons} />
                  <h2>Complaint Summary</h2>
                </div>
                {addComplaint && (
                  <React.Fragment>
                    <div className={styled.btnBox}>
                      <button
                        type="button"
                        className={styled.btn}
                        onClick={editComplaintHandler}
                      >
                        Edit Complaint
                      </button>
                    </div>

                    <p style={{ marginTop: "0.6rem" }}>
                      <strong>First Name:</strong>{" "}
                      {patientInfo && patientInfo.firstName
                        ? patientInfo.firstName
                        : ""}
                      ,
                    </p>
                    <p>
                      <strong>Last Name:</strong>{" "}
                      {patientInfo && patientInfo.lastName
                        ? patientInfo.lastName
                        : ""}
                      ,
                    </p>

                    {/* <p>
                    <strong>Birth Date:</strong>{" "}
                    {patientInfo && patientInfo.birthDate
                      ? patientInfo.birthDate.substring(0, 10)
                      : ""}
                    ,
                  </p> */}

                    <p>
                      <strong>Gender:</strong>{" "}
                      {patientInfo && patientInfo.gender
                        ? patientInfo.gender
                        : ""}
                      ,
                    </p>
                    <p>
                      <strong>Complaint:</strong> {addComplaint.complaint},
                    </p>

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
                  </React.Fragment>
                )}
              </div>
            </div>
          </div>

          <section className={styled.section__two}>
            <div className={styled.boxes}>
              <div className={styled.iconWrapper}>
                <GiStethoscope className={styled.icons} />
                <h2>Doctor for consultation</h2>
              </div>
              {initiateItem && (
                <React.Fragment>
                  <p>
                    <strong>Name:</strong> Dr {initiateItem.firstName},
                  </p>
                  <p>
                    <strong>Specialty:</strong> {initiateItem.specialty},
                  </p>
                  <div className={styled.imgBox}>
                    <img src={initiateItem.image} alt="doctor" />
                  </div>
                </React.Fragment>
              )}
            </div>
          </section>
        </div>
      </React.Fragment>
    </Layout>
  );
};

export default RequestConsultationScreen;
