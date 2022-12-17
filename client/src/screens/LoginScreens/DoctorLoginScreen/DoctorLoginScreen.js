import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaRegEnvelope } from "react-icons/fa";
import { FaKey } from "react-icons/fa";
import { FaSignInAlt } from "react-icons/fa";
import { loginDoctor } from "../../../actions/doctorActions";
import Message from "../../../components/Message/Message";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../../components/Spinner/Spinner";
import Secure from "../../../components/Secure/Secure";
import loginImg from "../../../img/access.png";
import { WebSocketContext } from "../../../WebSocket";
import { toast } from "react-toastify";
import ExtraInfo from "../../../components/ExtraInfo/ExtraInfo";
import Layout from "../../../components/Layout/Layout";

import styled from "./DoctorLoginScreen.module.css";

const DoctorLoginScreen = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const wlbs = useContext(WebSocketContext);
  const dispatch = useDispatch();

  const doctorLogin = useSelector((state) => state.doctorLogin);
  const { loading, error, doctorInfo } = doctorLogin;

  // userInfo will be null if not logged in
  useEffect(() => {
    if (doctorInfo) {
      navigate("/docdashboard");
    }
  }, [navigate, doctorInfo]);

  useEffect(() => {
    if (doctorInfo && doctorInfo.doctorIsVerified === false) {
      setTimeout(() => {
        toast.success(
          `Hello ${doctorInfo.username}, Pls complete your profile so you can be verified and start taking appointments`,
          { autoClose: 30000 }
        );
      }, 2000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitHandler = (e) => {
    e.preventDefault();
    // Dispatch login
    dispatch(loginDoctor(email, password, wlbs));
  };
  return (
    <Layout>
      <div className={styled.container}>
        <div className={styled.left}>
          <div className={styled.loginscreenWrapper}>
            <div className={styled.loginHeader}>
              <h3>Doctor</h3>
              <img src={loginImg} width="200px" height="200px" alt="login" />
            </div>

            <div className={styled.loginformWrapper}>
              <form className={styled.loginForm} onSubmit={submitHandler}>
                <div className={styled.formControl}>
                  <label htmlFor="email">
                    <FaRegEnvelope className={styled.loginIcons} />
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  ></input>
                </div>
                <div className={styled.formControl}>
                  <label htmlFor="password">
                    <FaKey className={styled.loginIcons} />
                  </label>
                  <input
                    type="password"
                    id="password"
                    placeholder="Enter your password"
                    value={password}
                    autoComplete="false"
                    onChange={(e) => setPassword(e.target.value)}
                  ></input>
                </div>
                {error && <Message message="dangerMessage">{error}</Message>}
                {loading && <Spinner />}
                <div className={styled.formActions}>
                  <button type="submit">
                    <FaSignInAlt /> LOGIN
                  </button>
                </div>
                <p>
                  Don't have an account yet?{" "}
                  <Link to="/docregister" className={styled.loginLink}>
                    Register
                  </Link>
                </p>
                <p>
                  <Link to="/dforgotpw" className={styled.loginLink}>
                    Forgot password
                  </Link>
                </p>
              </form>
              {/* secure */}
              <Secure />
            </div>
          </div>
        </div>
        <div className={styled.right}>
          <ExtraInfo />
        </div>
      </div>
    </Layout>
  );
};

export default DoctorLoginScreen;
