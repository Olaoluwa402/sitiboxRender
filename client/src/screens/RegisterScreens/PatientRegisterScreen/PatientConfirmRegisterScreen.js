import React, { useEffect } from "react";
import Message from "../../../components/Message/Message";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../../components/Spinner/Spinner";
import { useParams, useNavigate } from "react-router-dom";
import { patientRegistrationConfirmation } from "../../../actions/patientActions";
import { toast } from "react-toastify";

import styled from "./PatientConfirmRegisterScreen.module.css";

const PatientConfirmRegisterScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { token: emailToken } = useParams();

  const patientConfirmRegister = useSelector(
    (state) => state.patientConfirmRegister
  );
  const { loading, error, patientInfo } = patientConfirmRegister;

  // useEffect
  // userInfo will be null if not logged in
  useEffect(() => {
    if (emailToken) {
      dispatch(patientRegistrationConfirmation({ emailToken }));
    }
    if (patientInfo) {
      navigate("/");
      toast.success("Registration Complete. Thanks you.");
    }
  }, [dispatch, emailToken, navigate, patientInfo]);

  return (
    <React.Fragment>
      <div className={styled.container}>
        {loading ? (
          <Spinner />
        ) : error ? (
          <Message message="dangerMessage">{error}</Message>
        ) : patientInfo ? (
          <div className={styled.registerScreen}>
            <p>Registration is complete. Thanks</p>
          </div>
        ) : null}
      </div>
    </React.Fragment>
  );
};

export default PatientConfirmRegisterScreen;
