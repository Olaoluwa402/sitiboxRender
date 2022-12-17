import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaUserPlus } from "react-icons/fa";
import Message from "../../../components/Message/Message";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../../components/Spinner/Spinner";
import { registerDoctor } from "../../../actions/doctorActions";
import useForm from "../../../components/useForm/useFormD";
import PhoneInput from "react-phone-number-input";
import selectOption from "../../../components/selectOption";
import validate from "../../../components/validateInfo/validateInfoD";
// import DayPickerInput from 'react-day-picker/DayPickerInput';
// import { DateUtils } from 'react-day-picker';
import dateFnsFormat from "date-fns/format";
import dateFnsParse from "date-fns/parse";
import { DOCTOR_REGISTER_RESET } from "../../../constants/doctorConstants";
import { useNavigate } from "react-router-dom";
import styled from "./DoctorRegisterScreen.module.css";
// import 'react-day-picker/lib/style.css';
import "react-phone-number-input/style.css";

// password validate regx
const isNumberRegx = /\d/;
const specialCharacterRegx = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

const DoctorRegisterScreen = () => {
  const navigate = useNavigate();
  // initial states declaration
  const [selectedDate, setSelectedDate] = useState(undefined);

  const [Checked, setChecked] = useState(null);

  let years;
  const dispatch = useDispatch();
  const [phoneValue, setPhoneValue] = useState();
  const { genderOptions, specialtyOptions } = selectOption();

  const doctorRegister = useSelector((state) => state.doctorRegister);
  const { loading, error, success, register } = doctorRegister;

  // userInfo will be null if not logged in
  useEffect(() => {
    if (register) {
      dispatch({ type: DOCTOR_REGISTER_RESET });
      navigate("/reg-welcome");
    }
  }, [navigate, dispatch, register]);

  let age;
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

  const { handleChange, values, errors, submitHandler } = useForm(
    validate,
    dispatch,
    registerDoctor,
    phoneValue,
    selectedDate,
    age,
    Checked
  );

  return (
    <React.Fragment>
      <div className={styled.registerScreen}>
        <div className={styled.registerHeader}>
          <h2>
            <FaUserPlus /> DOCTOR SIGN-UP
          </h2>
        </div>
        {loading && <Spinner />}
        {error && <Message message="dangerMessage">{error}</Message>}
        <div className={styled.registerformWrapper}>
          <form className={styled.registerForm} onSubmit={submitHandler}>
            <h3 style={{ color: "green" }}>Personal Data</h3>
            <hr className={styled.hr} />
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
              {/* 							
					        <DayPickerInput
					        	  formatDate={formatDate}
							      format={FORMAT}
							      parseDate={parseDate}
							      placeholder={`${dateFnsFormat(new Date(), FORMAT)}`}
					        	onDayChange={handleDayChange} 
					        /> */}
            </div>

            <div className={styled.formControl}>
              {errors.gender && <p>{errors.gender}</p>}
              <label htmlFor="specialty">Specialty</label>
              <select
                name="specialty"
                value={values.specialty}
                onChange={handleChange}
              >
                {specialtyOptions.map((option, index) => (
                  <option key={index} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className={styled.formControl}>
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

            <hr className={styled.hr} />
            <h3 style={{ color: "green", marginBottom: "1.2rem" }}>Others</h3>

            <div className={styled.formControl}>
              {errors.biodata && <p>{errors.biodata}</p>}
              <label htmlFor="biodata">
                Biodata (Brief introduction of yourself to patients)
              </label>
              <textarea
                type="text"
                id="biodata"
                name="biodata"
                value={values.biodata}
                cols="30"
                rows="10"
                onChange={handleChange}
              >
                Enter your Professional statement
              </textarea>
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
          </form>
        </div>
      </div>
    </React.Fragment>
  );
};

export default DoctorRegisterScreen;
