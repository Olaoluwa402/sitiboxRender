import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { saveRegStep2 } from "../../../actions/regStepActions";
import Message from "../../../components/Message/Message";
import PasswordStrengthIndicator from "../../../components/PasswordStrenghtIndicator/index";

import styled from "./DoctorRegisterScreen.module.css";

// password validate regx
const isNumberRegx = /\d/;
const specialCharacterRegx = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

const RegStep2 = () => {
  const navigate = useNavigate();
  // initial states declaration
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  const [passwordFocused, setPasswordFocused] = useState(false);
  const [passwordValidity, setPasswordValidity] = useState({
    minChar: null,
    number: null,
    specialChar: null,
    pwMatched: null,
  });

  const dispatch = useDispatch();
  const initiateRegSteps = useSelector((state) => state.initiateRegSteps);
  const { error, addData2 } = initiateRegSteps;

  // onchange password
  const onChangePassword = (password) => {
    setPassword(password);

    setPasswordValidity({
      minChar: password.length >= 8 ? true : false,
      number: isNumberRegx.test(password) ? true : false,
      specialChar: specialCharacterRegx.test(password) ? true : false,
      pwMatched: false,
    });
  };

  // onchange confirm password
  const onChangeConfirmPassword = (confirmPassword) => {
    setConfirmPassword(confirmPassword);

    setPasswordValidity({
      minChar: passwordValidity.minChar,
      number: passwordValidity.number,
      specialChar: passwordValidity.specialChar,
      pwMatched: password === confirmPassword ? true : false,
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      return;
    }

    if (password !== confirmPassword) {
      return;
    }

    dispatch(saveRegStep2(password));
    navigate("/docregstep3");
  };

  return (
    <React.Fragment>
      <div className={styled.registerScreen}>
        <div className={styled.registerHeader}>
          <h2>
            <FaUserPlus /> DOCTOR SIGN-UP
          </h2>
        </div>
        <div className={styled.registerformWrapper}>
          <form className={styled.registerForm} onSubmit={submitHandler}>
            <div className={styled.formControl}>
              {/* {errors.password && <p>{errors.password}</p>} */}
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={password}
                onFocus={() => setPasswordFocused(true)}
                onChange={(e) => onChangePassword(e.target.value)}
              ></input>
              {passwordFocused && (
                <PasswordStrengthIndicator validity={passwordValidity} />
              )}
            </div>
            <div className={styled.formControl}>
              {/* {errors.confirmPassword && <p>{errors.confirmPassword}</p>} */}
              <label htmlFor="password">Confirm password</label>
              <input
                type="password"
                id="password"
                name="confirmPassword"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => onChangeConfirmPassword(e.target.value)}
              ></input>
            </div>

            {error && <Message message="dangerMessage">{error}</Message>}

            <div className={styled.formActions}>
              <button type="submit">NEXT</button>
            </div>
          </form>
        </div>
      </div>
    </React.Fragment>
  );
};

export default RegStep2;
