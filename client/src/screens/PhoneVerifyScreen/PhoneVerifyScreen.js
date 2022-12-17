import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  verifyDocPhone,
  verifyDocPhoneCode,
} from "../../actions/doctorActions";
import Message from "../../components/Message/Message";
import Spinner from "../../components/Spinner/Spinner";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { DOCTORPHONECODEVERIFY_RESET } from "../../constants/doctorConstants";

import styled from "./PhoneVerifyScreen.module.css";

const PhoneVerifyScreen = ({ history }) => {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const dispatch = useDispatch();

  const docPhoneVerify = useSelector((state) => state.docPhoneVerify);
  const { phoneVerifyInfo } = docPhoneVerify;

  const docPhoneCodeVerify = useSelector((state) => state.docPhoneCodeVerify);
  const { loading, error, success } = docPhoneCodeVerify;

  const doctorLogin = useSelector((state) => state.doctorLogin);
  const { doctorInfo } = doctorLogin;

  const phone = doctorInfo.phone;

  const toText = phone.toString(); //convert to string
  const lastChar = toText.slice(-4); //gets last four character
  const lastDigit = +lastChar; //convert last character to number

  // DocInfo will be null if not logged in
  useEffect(() => {
    if (!doctorInfo) {
      navigate("/doclogin");
    }

    if (!doctorInfo.phoneVerified && !success) {
      dispatch(verifyDocPhone());
    }
    if (success) {
      dispatch({ type: DOCTORPHONECODEVERIFY_RESET });
      navigate("/docdashboard/docprofile");
      toast.success(`phone verification successful`);
    }
  }, [dispatch, navigate, doctorInfo, success]);

  // get new code
  const newCodeHandler = () => {
    dispatch(verifyDocPhone());
  };

  // submit verification code
  const submitHandler = (e) => {
    e.preventDefault();
    if (!code) {
      return;
    }

    if (phoneVerifyInfo) {
      dispatch(
        verifyDocPhoneCode({ code: code, verifyId: phoneVerifyInfo.request_id })
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
