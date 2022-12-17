import React, { useState, useEffect } from "react";
import { FaRegEnvelope } from "react-icons/fa";
import { FaKey } from "react-icons/fa";
import { FaSignInAlt } from "react-icons/fa";
import { loginAdmin } from "../../../actions/adminActions";
import Message from "../../../components/Message/Message";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../../components/Spinner/Spinner";
import loginImg from "../../../img/access.png";
import Layout from "../../../components/Layout/Layout";
import { useNavigate } from "react-router-dom";

import styled from "../LoginScreen/LoginScreen.module.css";

const AdminLoginScreen = ({ location, history }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const adminLogin = useSelector((state) => state.adminLogin);
  const { loading, error, adminInfo } = adminLogin;

  // userInfo will be null if not logged in
  useEffect(() => {
    if (adminInfo) {
      navigate("/admindashboard");
    }
  }, [navigate, adminInfo]);

  const submitHandler = (e) => {
    e.preventDefault();
    // Dispatch login
    dispatch(loginAdmin(email, password));
  };
  return (
    <Layout>
      <div className={styled.loginscreenWrapper}>
        <div className={styled.loginHeader}>
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
                <FaSignInAlt /> ADMIN LOGIN
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AdminLoginScreen;
