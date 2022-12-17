import React, { useState, useEffect } from "react";
import Message from "../../../components/Message/Message";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import Spinner from "../../../components/Spinner/Spinner";
import validate from "../../../components/validateInfo/validateReset";
import { newPassword } from "../../../actions/patientActions";
import { toast } from "react-toastify";
import Layout from "../../../components/Layout/Layout";

import styled from "./ResetScreen.module.css";

const ResetScreen = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  const { token } = useParams();

  const dispatch = useDispatch();

  const passwordNew = useSelector((state) => state.passwordNew);
  const {
    loading: loadingNew,
    error: errorNew,
    success: successNew,
  } = passwordNew;

  // userInfo will be null if not logged in
  useEffect(() => {
    if (errorNew) {
      navigate("/forgotpw");
      toast.warning(errorNew);
    }

    if (successNew) {
      navigate("/login");
      toast.success(successNew.message);
    }
  }, [navigate, errorNew, successNew]);

  const submitHandler = async (e) => {
    e.preventDefault();

    // set errors
    setErrors(validate({ password, confirmPassword }));

    if (password && password === confirmPassword) {
      dispatch(newPassword(password, token));
    } else {
      return;
    }
  };

  return (
    <Layout>
      <div className={styled.loginscreenWrapper}>
        <div className={styled.loginHeader}>
          <h2>NEW PASSWORD</h2>
        </div>

        <div className={styled.loginformWrapper}>
          <form className={styled.loginForm} onSubmit={submitHandler}>
            <div className={styled.formControl}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="New password"
                autoComplete="false"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></input>
              {errors.password && <p>{errors.password}</p>}
            </div>
            <div className={styled.formControl}>
              <label htmlFor="password">Confirm password</label>
              <input
                type="password"
                id="password"
                name="confirmPassword"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              ></input>
              {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
            </div>
            {loadingNew && <Spinner />}
            {errorNew && <Message message="dangerMessage">{errorNew}</Message>}
            <div className={styled.formActions}>
              <button type="submit">Update Password</button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ResetScreen;
