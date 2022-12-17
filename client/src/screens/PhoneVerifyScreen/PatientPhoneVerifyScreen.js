import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  verifyPatientPhone,
  verifyPatientPhoneCode,
} from "../../actions/patientActions";
import Message from "../../components/Message/Message";
import Spinner from "../../components/Spinner/Spinner";
import { toast } from "react-toastify";
import { PATIENTPHONECODEVERIFY_RESET } from "../../constants/patientConstants";
import { useNavigate } from "react-router-dom";

import styled from "./PhoneVerifyScreen.module.css";

const PhoneVerifyScreen = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const dispatch = useDispatch();

  const patientPhoneVerify = useSelector((state) => state.patientPhoneVerify);
  const { patientPhoneVerifyInfo } = patientPhoneVerify;

  const patientPhoneCodeVerify = useSelector(
    (state) => state.patientPhoneCodeVerify
  );
  const { loading, error, success } = patientPhoneCodeVerify;

  const patientLogin = useSelector((state) => state.patientLogin);
  const { patientInfo } = patientLogin;

  const phone = patientInfo.phone;

  const toText = phone.toString(); //convert to string
  const lastChar = toText.slice(-4); //gets last four character
  const lastDigit = +lastChar; //convert last character to number

  // DocInfo will be null if not logged in
  useEffect(() => {
    if (!patientInfo) {
      navigate("/login");
    }
    if (!patientInfo.phoneVerified && !success) {
      dispatch(verifyPatientPhone());
    }
    if (success) {
      dispatch({ type: PATIENTPHONECODEVERIFY_RESET });
      navigate("/dashboard/profile");
      toast.success(`phone verification successful`);
    }
  }, [dispatch, navigate, patientInfo, success]);

  // get new code
  const newCodeHandler = () => {
    dispatch(verifyPatientPhone());
  };

  // submit verification code
  const submitHandler = (e) => {
    e.preventDefault();

    if (!code) {
      return;
    }

    if (patientPhoneVerifyInfo) {
      dispatch(
        verifyPatientPhoneCode({
          code: code,
          verifyId: patientPhoneVerifyInfo.request_id,
        })
      );
    }
  };

  return (
    <React.Fragment>
      <div className={styled.container}>
        <div className={styled.contentWrapper}>
          <div className={styled.verifyHeader}>
            {loading && <Spinner />}
            {error && <Message message="dangerMessage">{error}</Message>}
            <h2>Enter your verification code</h2>
          </div>
          <div className={styled.verifyBody}>
            <p>{`Check your phone ending in *** *** ${lastDigit} for a verification message or automated phone call`}</p>
            <p>
              Did not receive anything?{" "}
              <span className={styled.newCode} onClick={newCodeHandler}>
                Request a new code
              </span>
            </p>
          </div>
          <div className={styled.verifySubmit}>
            <form className={styled.loginForm} onSubmit={submitHandler}>
              <div className={styled.formControl}>
                <input
                  type="number"
                  id="code"
                  placeholder="verification code e.g. 1234 "
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                ></input>

                <button type="submit">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default PhoneVerifyScreen;
