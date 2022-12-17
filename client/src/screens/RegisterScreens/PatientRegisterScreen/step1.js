import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { checkEmailClinicName } from "../../../actions/regStepActions";
import { CLEAR_EMAIL_STATUS } from "../../../constants/regStepConstants";
import Message from "../../../components/Message/Message";
import Secure from "../../../components/Secure/Secure";
import ExtraInfo from "../../../components/ExtraInfo/ExtraInfo";

import styled from "./PatientRegisterScreen.module.css";

const RegStep1 = () => {
  const navigate = useNavigate();
  // initial states declaration
  const [email, setEmail] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const initiateRegSteps = useSelector((state) => state.initiateRegSteps);
  const { error, addData1, emailStatus } = initiateRegSteps;

  let emailExist;
  if (emailStatus) {
    emailExist = emailStatus.emailExist;
  }

  let clinicNameExist;
  if (clinicNameExist) {
    clinicNameExist = emailStatus.clinicNameExist;
  }

  useEffect(() => {
    if (emailExist === false || clinicNameExist === false) {
      navigate("/regstep2");
      dispatch({
        type: CLEAR_EMAIL_STATUS,
      });
    }
  }, [dispatch, emailExist, navigate, clinicNameExist]);

  const validate = ({ email, clinicName }) => {
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

    if (!clinicName) {
      errors.clinicName = "Please, provide a unique clinic name!";
    }

    return errors;
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setErrors(validate({ email, clinicName }));
    if (!email || !clinicName) {
      return;
    }

    dispatch(checkEmailClinicName({ email, clinicName }));
  };

  return (
    <React.Fragment>
      <div className={styled.container}>
        <div className={styled.left}>
          <div className={styled.registerScreen}>
            <div className={styled.registerHeader}>
              <h2>
                <FaUserPlus /> PATIENT SIGN-UP
              </h2>
            </div>
            <div className={styled.registerformWrapper}>
              <form className={styled.registerForm} onSubmit={submitHandler}>
                <div className={styled.formControl}>
                  {errors.clinicName && <p>{errors.clinicName}</p>}
                  <label htmlFor="clinicName">Clinic Username</label>
                  <input
                    type="text"
                    id="clinicName"
                    name="clinicName"
                    placeholder="Enter preferred clinic username"
                    value={clinicName}
                    onChange={(e) => setClinicName(e.target.value)}
                  ></input>
                </div>

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
                {clinicNameExist && (
                  <Message message="dangerMessage">
                    {emailStatus.message}
                  </Message>
                )}

                <div className={styled.formActions}>
                  <button type="submit">NEXT</button>
                </div>
                <p>
                  Already have an account?{" "}
                  <Link to="/login" className={styled.loginLink}>
                    Login
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
    </React.Fragment>
  );
};

export default RegStep1;
