import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserPlus } from "react-icons/fa";
import Message from "../../../components/Message/Message";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../../components/Spinner/Spinner";
import { registerPatient } from "../../../actions/patientActions";
import useForm from "../../../components/useForm/useFormP";
import validate from "../../../components/validateInfo/validateInfoP";
import selectOption from "../../../components/selectOption";
// import DayPickerInput from 'react-day-picker/DayPickerInput';
// import { DateUtils } from 'react-day-picker';
import dateFnsFormat from "date-fns/format";
import dateFnsParse from "date-fns/parse";

import PhoneInput from "react-phone-number-input";

import { PATIENT_REGISTER_RESET } from "../../../constants/patientConstants";
// import usePasswordToggle from "../../../components/usePasswordToggle/usePasswordToggle";
import PasswordStrengthIndicator from "../../../components/PasswordStrenghtIndicator/index";

import styled from "./PatientRegisterScreen.module.css";
import "react-datepicker/dist/react-datepicker.css";
// import "react-day-picker/lib/style.css";
import "react-phone-number-input/style.css";

// password validate regx
const isNumberRegx = /\d/;
const specialCharacterRegx = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

const PatientRegisterScreen = ({ location, history }) => {
  const navigate = useNavigate();
  // initial states declaration
  const [selectedDate, setSelectedDate] = useState(undefined);
  const [phoneValue, setPhoneValue] = useState();
  // const [PasswordInputType, ToggleIcon] = usePasswordToggle();
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [pword, setPword] = useState("");
  const [passwordValidity, setPasswordValidity] = useState({
    minChar: null,
    number: null,
    specialChar: null,
  });

  const [Checked, setChecked] = useState(null);

  let age;
  const dispatch = useDispatch();
  const { genderOptions } = selectOption();

  const patientRegister = useSelector((state) => state.patientRegister);
  const { loading, error, success, register } = patientRegister;

  /* End of initial state declaration*/

  // userInfo will be null if not logged in
  useEffect(() => {
    if (register) {
      dispatch({ type: PATIENT_REGISTER_RESET });
      navigate("/reg-welcome");
    }
  }, [dispatch, navigate, register]);

  // calculate age from selected date
  const calculateYear = (selectedDate) => {
    let DOB = selectedDate;
    let millisecondsBetweenDOBAnd1970 = Date.parse(DOB);

    let millisecondsBetweenNowAnd1970 = Date.now();

    let ageInMilliseconds =
      millisecondsBetweenNowAnd1970 - millisecondsBetweenDOBAnd1970;
    //--We will leverage Date.parse and now method to calculate age in milliseconds refer here https://www.w3schools.com/jsref/jsref_parse.asp
    let milliseconds = ageInMilliseconds;
    let second = 1000;
    let minute = second * 60;
    let hour = minute * 60;
    let day = hour * 24;
    let month = day * 30;
    /*using 30 as base as months can have 28, 29, 30 or 31 days depending a month in a year it itself is a different piece of comuptation*/
    let year = day * 365;

    // //let the age conversion begin
    age = Math.round(milliseconds / year);
  };

  if (selectedDate) {
    calculateYear(selectedDate);
  }
  // onchange password
  const onChangePassword = (password) => {
    setPword(password);

    setPasswordValidity({
      minChar: password.length >= 8 ? true : false,
      number: isNumberRegx.test(password) ? true : false,
      specialChar: specialCharacterRegx.test(password) ? true : false,
    });
  };

  const handleCheckBox = (e) => {
    const isChecked = e.target.value;
    setChecked(isChecked);
  };

  // handle date change
  const handleDayChange = (day) => {
    setSelectedDate(day);
  };

  // parse Date

  const parseDate = (str, format, locale) => {
    const parsed = dateFnsParse(str, format, new Date(), { locale });
    //   if (DateUtils.isDate(parsed)) {
    //     return parsed;
    //   }
    return undefined;
  };
  // format Date
  const formatDate = (date, format, locale) => {
    return dateFnsFormat(date, format, { locale });
  };

  const FORMAT = "dd/MM/yyyy";

  const { handleChange, values, errors, submitHandler } = useForm({
    validate,
    dispatch,
    registerPatient,
    phoneValue,
    selectedDate,
    age,
    pword,
    Checked,
  });

  return (
    <React.Fragment>
      <div className={styled.registerScreen}>
        <div className={styled.registerHeader}>
          <h2>
            <FaUserPlus /> {`PATIENT"S SIGN-UP`}
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
                value={values.clinicName}
                onChange={handleChange}
              ></input>
            </div>
            <div className={styled.formControl}>
              {errors.firstName && <p>{errors.firstName}</p>}
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                placeholder="Enter first name"
                value={values.firstName}
                onChange={handleChange}
              ></input>
            </div>

            <div className={styled.formControl}>
              {errors.lastName && <p>{errors.lastName}</p>}
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                placeholder="Enter last name"
                value={values.lastName}
                onChange={handleChange}
              ></input>
            </div>

            <div className={styled.formControl}>
              {errors.birthdate && <p>{errors.birthdate}</p>}
              <label htmlFor="date">
                Date of Birth{" "}
                {age && age > 0 ? (
                  <span className={styled.birth}>{age}yr(s)</span>
                ) : null}
              </label>

              {/* <DayPickerInput
					        	  formatDate={formatDate}
							      format={FORMAT}
							      parseDate={parseDate}
							      placeholder={`${dateFnsFormat(new Date(), FORMAT)}`}
					        	onDayChange={handleDayChange} 
					        /> */}
            </div>

            <div className={styled.formControl}>
              {errors.gender && <p>{errors.gender}</p>}
              <label htmlFor="gender">Gender</label>
              <select
                name="gender"
                value={values.gender}
                onChange={handleChange}
              >
                {genderOptions.map((option, index) => (
                  <option key={index} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className={styled.formControl}>
              {errors.phoneValue && <p>{errors.phoneValue}</p>}
              <label htmlFor="phone">phone: {phoneValue}</label>
              <PhoneInput
                placeholder="0906 000 0000"
                value={phoneValue}
                onChange={setPhoneValue}
                defaultCountry="NG"
              />
            </div>
            <div className={styled.formControl}>
              {errors.email && <p>{errors.email}</p>}
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={values.email}
                onChange={handleChange}
              ></input>
            </div>

            <div className={styled.formControl}>
              {errors.password && <p>{errors.password}</p>}
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={pword}
                onFocus={() => setPasswordFocused(true)}
                onChange={(e) => onChangePassword(e.target.value)}
              ></input>

              {passwordFocused && (
                <PasswordStrengthIndicator validity={passwordValidity} />
              )}
            </div>
            <div className={styled.formControl}>
              {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
              <label htmlFor="password">Confirm password</label>
              <input
                type="password"
                id="password"
                name="confirmPassword"
                placeholder="Confirm password"
                value={values.confirmPassword}
                onChange={handleChange}
              ></input>
            </div>

            <div className={styled.formControl}>
              {errors.isChecked && <p>{errors.isChecked}</p>}
              <label htmlFor="terms">
                <Link to="/terms">Terms and Conditions</Link>
              </label>

              <input
                type="checkbox"
                name="isChecked"
                value="true"
                checked={Checked || false}
                onChange={handleCheckBox}
              />
            </div>

            {success && (
              <Message message="defaultMessage">
                You are successfully registered. A confirmaton email has been
                sent your email.{" "}
              </Message>
            )}
            {loading && <Spinner />}
            {error && <Message message="dangerMessage">{error}</Message>}
            <div className={styled.formActions}>
              <button type="submit">SIGN-UP</button>
            </div>
            <p>
              Already have an account?{" "}
              <Link to="/login" className={styled.loginLink}>
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </React.Fragment>
  );
};

export default PatientRegisterScreen;
