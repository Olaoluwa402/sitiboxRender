import React, { useEffect } from "react";
import { AiFillIdcard } from "react-icons/ai";
import { GiStethoscope } from "react-icons/gi";
import { useDispatch, useSelector } from "react-redux";
import { addToInitiate } from "../../actions/initiateActions";
import Message from "../../components/Message/Message";
import { INITIATE_CLEAR_ITEMS } from "../../constants/initiateConstants";
import Layout from "../../components/Layout/Layout";
import { useNavigate, useParams } from "react-router";
import ConsultationSteps from "../../components/ConsultationSteps/ConsultationSteps";

import styled from "./SelectedDoctorScreen.module.css";

const SelectedDoctorScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const doctorId = id;
  const dispatch = useDispatch();

  const initiate = useSelector((state) => state.initiate);
  const { error, initiateItem, addComplaint } = initiate;

  const patientLogin = useSelector((state) => state.patientLogin);
  const { patientInfo } = patientLogin;

  useEffect(() => {
    if (doctorId) {
      dispatch(addToInitiate(doctorId));
    }
  }, [dispatch, doctorId]);

  const checkoutHandler = () => {
    navigate("/login?redirect=request");
  };

  // convert to date
  let event = new Date(addComplaint.birthdate);
  let date = JSON.stringify(event);
  date = date.slice(1, 11);

  const editComplaintHandler = () => {
    dispatch({ type: INITIATE_CLEAR_ITEMS });
    localStorage.removeItem("initiateItem");
    navigate("/complaint");
  };

  return (
    <Layout>
      <React.Fragment>
        <ConsultationSteps step1 step2 step3 />
        <div className={styled.wrapper}>
          {error ? (
            <Message message="dangerMessage">{error}</Message>
          ) : addComplaint !== undefined && initiateItem !== undefined ? (
            <React.Fragment>
              <div className={styled.leftCol}>
                <div>
                  <div className={styled.iconWrapper}>
                    <GiStethoscope className={styled.icons} />
                    <h2>Consulting Doctor</h2>
                  </div>
                  <p>
                    <strong>Name:</strong> Dr {initiateItem.firstName},
                  </p>
                  <p>
                    <strong>Specialty:</strong> {initiateItem.specialty},
                  </p>
                  <div className={styled.imgBox}>
                    <img src={initiateItem.image} alt="doctor" />
                  </div>
                </div>
                <div className={styled.btnBox}>
                  <button
                    type="button"
                    className={styled.btn}
                    disabled={!initiateItem && !addComplaint}
                    onClick={checkoutHandler}
                  >
                    Continue
                  </button>
                </div>
              </div>

              <div className={styled.rightCol}>
                <div className={styled.btnBox}>
                  <button
                    type="button"
                    className={styled.btn}
                    onClick={editComplaintHandler}
                  >
                    Edit Complaint
                  </button>
                </div>

                <div className={styled.iconWrapper}>
                  <AiFillIdcard className={styled.icons} />
                  <h2>Complaint Summary</h2>
                </div>
                <p>
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

                <p>
                  <strong>Complaint:</strong> {addComplaint.complaint},
                </p>
                {addComplaint.file && (
                  <div className={styled.imgBox}>
                    <img src={addComplaint.file} alt="chosen" />
                  </div>
                )}
              </div>
            </React.Fragment>
          ) : null}
        </div>
      </React.Fragment>
    </Layout>
  );
};

export default SelectedDoctorScreen;
