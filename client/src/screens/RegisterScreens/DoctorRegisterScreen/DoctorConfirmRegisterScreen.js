import React, { useEffect } from "react";
import Message from "../../../components/Message/Message";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../../components/Spinner/Spinner";
import { useParams, useNavigate } from "react-router-dom";
import { doctorRegistrationConfirmation } from "../../../actions/doctorActions";
import { toast } from "react-toastify";

import styled from "./DoctorConfirmRegisterScreen.module.css";

const DoctorConfirmRegisterScreen = ({ location, history }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { token } = useParams();

  const doctorConfirmRegister = useSelector(
    (state) => state.doctorConfirmRegister
  );
  const { loading, error, doctorInfo } = doctorConfirmRegister;

  // useEffect
  // userInfo will be null if not logged in
  useEffect(() => {
    if (token) {
      dispatch(doctorRegistrationConfirmation({ emailToken: token }));
    }
    if (doctorInfo) {
      navigate("/");
      toast.success("Registration Complete. Thank you.");
    }
  }, [dispatch, token, navigate, doctorInfo]);

  return (
    <React.Fragment>
      <div className={styled.container}>
        {loading ? (
          <Spinner />
        ) : error ? (
          <Message message="defaultMessage">{error}</Message>
        ) : doctorInfo ? (
          <div className={styled.registerScreen}>
            <p>Registration is complete. Thanks</p>
          </div>
        ) : null}
      </div>
    </React.Fragment>
  );
};

export default DoctorConfirmRegisterScreen;
