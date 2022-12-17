import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { saveRegStep1 } from "../../../actions/regStepActions";
import { CLEAR_EMAIL_STATUS } from "../../../constants/regStepConstants";
import Message from "../../../components/Message/Message";
import Secure from "../../../components/Secure/Secure";
import ExtraInfo from "../../../components/ExtraInfo/ExtraInfo";

import styled from "./DoctorRegisterScreen.module.css";

const DocRegStep1 = () => {
  const navigate = useNavigate();
  // initial states declaration
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const initiateRegSteps = useSelector((state) => state.initiateRegSteps);
  const { error, addData1, emailStatus } = initiateRegSteps;

  let emailExist;
  if (emailStatus) {
    emailExist = emailStatus.emailExist;
  }

  useEffect(() => {
    if (emailExist === false) {
      navigate("/docregstep2");
      dispatch({
        type: CLEAR_EMAIL_STATUS,
      });
    }
  }, [dispatch, navigate, emailExist]);

  const validate = ({ email }) => {
    let errors = {};
    // email
    if (!email) {
      errors.email = "Please, provide email!";
    } else if (
      !/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        email
      )
    ) {
      errors.email = "Email address is invalid";
    }

    return errors;
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setErrors(validate({ email }));
    if (!email) {
      return;
    }
    dispatch(saveRegStep1(email));
  };

  return (
    <React.Fragment>
      <div className={styled.container}>
        <div classname={styled.left}>
          <div className={styled.registerScreen}>
            <div className={styled.registerHeader}>
              <h2>
                <FaUserPlus /> DOCTOR SIGN-UP
              </h2>
            </div>
            <div className={styled.registerformWrapper}>
              <form className={styled.registerForm} onSubmit={submitHandler}>
                <div className={styled.formControl}>
                  {errors.email && <p>{errors.email}</p>}
                  <label htmlFor="email">E-mail</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  ></input>
                </div>

                {error && <Message message="dangerMessage">{error}</Message>}
                {emailExist && (
                  <Message message="dangerMessage">
                    {emailStatus.message}
                  </Message>
                )}

                <div className={styled.formActions}>
                  <button type="submit">NEXT</button>
                </div>
                <p>
                  Already have an account?{" "}
                  <Link to="/doclogin" className={styled.loginLink}>
                    Login
                  </Link>
                </p>
              </form>

              <Secure />
            </div>
          </div>
        </div>
        <div className={styled.right}>
          <ExtraInfo />
        </div>
      </div>
    </React.Fragment>
  );
};

export default DocRegStep1;
