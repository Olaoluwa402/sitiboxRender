import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
import { FaUserEdit } from "react-icons/fa";
import Message from "../../components/Message/Message";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../components/Spinner/Spinner";
// import useForm from "../../components/useForm/useDoctorProfileUpdateForm";
// import selectOption from "../../components/selectOption";
import validate from "../../components/validateInfo/validatePatientProfileUpdate";
import PhoneInput from "react-phone-number-input";
import { PATIENT_UPDATE_PROFILE_RESET } from "../../constants/patientConstants";
import {
  getPatientDetails,
  updatePatientProfile,
} from "../../actions/patientActions";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import styled from "./PatientProfileUpdateScreen.module.css";
import "react-phone-number-input/style.css";

const PatientProfileUpdateScreen = ({ location, history }) => {
  const [errors, setErrors] = useState({});
  const [phoneValue, setPhoneValue] = useState();
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const patientDetails = useSelector((state) => state.patientDetails);
  const { loading, error, patient } = patientDetails;

  const patientUpdateProfile = useSelector(
    (state) => state.patientUpdateProfile
  );
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success,
  } = patientUpdateProfile;

  const patientLogin = useSelector((state) => state.patientLogin);
  const { patientInfo } = patientLogin;

  // const { genderOptions, specialtyOptions } = selectOption();

  // userInfo will be null if not logged in
  useEffect(() => {
    if (!patientInfo) {
      navigate("/");
    }
    if (!patient && !patient.phone) {
      dispatch(getPatientDetails("profile"));
    } else {
      setPhoneValue(patient.phone);
    }

    if (success) {
      dispatch({ type: PATIENT_UPDATE_PROFILE_RESET });
      navigate("/dashboard/profile");
      toast.success("success", "profile successfully updated");
    }
  }, [dispatch, navigate, patientInfo, patient, patient.phone, success]);

  const submitHandler = (e) => {
    e.preventDefault();
    // set errors
    setErrors(validate({ phoneValue }));

    const myData = {
      phone: phoneValue,
    };
    // // Dispatch register
    dispatch(updatePatientProfile({ myData }));
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
        ) : patient ? (
          <div className={styled.registerformWrapper}>
            <form className={styled.registerForm} onSubmit={submitHandler}>
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

              {loadingUpdate && <Spinner />}
              {errorUpdate && (
                <Message message="dangerMessage">{errorUpdate}</Message>
              )}
              <div className={styled.formActions}>
                <button type="submit">UPDATE</button>
              </div>
            </form>
          </div>
        ) : (
          <div style={{ marginTop: "2rem" }}>
            <h3>No patient yet</h3>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default PatientProfileUpdateScreen;
