import React, { useState, useEffect } from "react";
import { FaUserEdit } from "react-icons/fa";
import Message from "../../components/Message/Message";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../components/Spinner/Spinner";
import selectOption from "../../components/selectOption";
import validate from "../../components/validateInfo/validateDoctorProfileUpdate";
import {
  getDoctorProfile,
  updateDoctorProfile,
} from "../../actions/doctorActions";
import { DOCTOR_UPDATE_PROFILE_RESET } from "../../constants/doctorConstants";
import { toast } from "react-toastify";
import PhoneInput from "react-phone-number-input";
import { useNavigate } from "react-router-dom";

import styled from "./DoctorProfileUpdateScreen.module.css";
import "react-phone-number-input/style.css";

const DoctorProfileUpdateScreen = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneValue, setPhoneValue] = useState("");
  const [biodata, setBiodata] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();

  const doctorProfile = useSelector((state) => state.doctorProfile);
  const { loading, error, doctor } = doctorProfile;

  const doctorUpdateProfile = useSelector((state) => state.doctorUpdateProfile);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success,
  } = doctorUpdateProfile;

  const doctorLogin = useSelector((state) => state.doctorLogin);
  const { doctorInfo } = doctorLogin;

  const { specialtyOptions } = selectOption();

  // const redirect = location.search ? location.search.split("=")[1] : "/";

  // userInfo will be null if not logged in
  useEffect(() => {
    if (!doctorInfo) {
      navigate("/");
    }

    if (!doctor && !doctor.firstName) {
      dispatch(getDoctorProfile("profile"));
    } else {
      setFirstName(doctor.firstName);
      setLastName(doctor.lastName);
      setPhoneValue(doctor.phone);
      setBiodata(doctor.biodata);
      setSpecialty(doctor.specialty);
    }

    if (success) {
      dispatch({ type: DOCTOR_UPDATE_PROFILE_RESET });
      navigate("/docdashboard/docprofile");
      toast.success("profile successfully updated");
    }
  }, [dispatch, navigate, doctorInfo, doctor, success, doctor.firstName]);

  const submitHandler = (e) => {
    e.preventDefault();
    // set errors
    setErrors(validate({ firstName, phoneValue, lastName, biodata }));

    const myData = {
      firstName: firstName,
      lastName: lastName,
      specialty: specialty,
      phone: phoneValue,
      biodata: biodata,
    };

    console.log(myData);
    // Dispatch register
    dispatch(updateDoctorProfile({ myData }));
  };

  return (
    <React.Fragment>
      <div className={styled.registerScreen}>
        <div className={styled.registerHeader}>
          <h2>
            <FaUserEdit /> UPDATE PROFILE
          </h2>
        </div>
        {loading ? (
          <Spinner />
        ) : error ? (
          <Message message="dangerMessage">{error}</Message>
        ) : doctor ? (
          <div className={styled.registerformWrapper}>
            <form className={styled.registerForm} onSubmit={submitHandler}>
              <div className={styled.formControl}>
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="Enter first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                ></input>
                {errors.firstName && <p>{errors.firstName}</p>}
              </div>

              <div className={styled.formControl}>
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="Enter last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                ></input>
                {errors.lastName && <p>{errors.lastName}</p>}
              </div>

              <div className={styled.formControl}>
                <label htmlFor="phone">phone: {phoneValue}</label>
                <PhoneInput
                  placeholder="0906 000 0000"
                  value={phoneValue}
                  onChange={setPhoneValue}
                  defaultCountry="NG"
                />
                {errors.phoneValue && <p>{errors.phoneValue}</p>}
              </div>

              <div className={styled.formControl}>
                <label htmlFor="specialty">Specialty</label>
                <select
                  name="specialty"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                >
                  {specialtyOptions.map((option, index) => (
                    <option key={index} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <hr className={styled.hr} />
              <h3 style={{ color: "green", marginBottom: "1.2rem" }}>Others</h3>

              <div className={styled.formControl}>
                <label htmlFor="biodata">Biodata</label>
                <textarea
                  type="text"
                  id="biodata"
                  name="biodata"
                  value={biodata}
                  cols="30"
                  rows="10"
                  onChange={(e) => setBiodata(e.target.value)}
                >
                  Enter your Professional statement
                </textarea>
                {errors.biodata && <p>{errors.biodata}</p>}
              </div>
              {loadingUpdate && <Spinner />}
              {errorUpdate && (
                <Message message="dangerMessage">{errorUpdate}</Message>
              )}
              <div className={styled.formActions}>
                <button type="submit">UPDATE</button>
              </div>
            </form>
          </div>
        ) : null}
      </div>
    </React.Fragment>
  );
};

export default DoctorProfileUpdateScreen;
