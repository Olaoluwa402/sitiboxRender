import React, { useState, useEffect } from "react";
import Message from "../../../components/Message/Message";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../../components/Spinner/Spinner";
import { passwordReset } from "../../../actions/patientActions";
import makeToast from "../../../Toaster";
import Layout from "../../../components/Layout/Layout";

import styled from "./ForgotScreen.module.css";

const ForgotScreen = () => {
  const [email, setEmail] = useState("");

  const dispatch = useDispatch();

  const resetPassword = useSelector((state) => state.resetPassword);
  const { loading: loadingReset, error: errorReset, pwupdate } = resetPassword;

  // userInfo will be null if not logged in
  useEffect(() => {}, []);

  const submitHandler = (e) => {
    e.preventDefault();
    if (
      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      makeToast("error", "Invalid email");
      return;
    } else {
      dispatch(passwordReset(email));
    }
  };

  return (
    <Layout>
      <div className={styled.loginscreenWrapper}>
        <div className={styled.loginHeader}>
          <h2>FORGOT PASSWORD</h2>
        </div>

        <div className={styled.loginformWrapper}>
          <form className={styled.loginForm} onSubmit={submitHandler}>
            <div className={styled.formControl}>
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={email}
                autoFocus
                onChange={(e) => setEmail(e.target.value)}
              ></input>
            </div>
            {loadingReset && <Spinner />}
            {pwupdate && <Message message="defaultMessage">{pwupdate}</Message>}
            {errorReset && (
              <Message message="dangerMessage">{errorReset}</Message>
            )}
            <div className={styled.formActions}>
              <button type="submit">Reset Password</button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ForgotScreen;
