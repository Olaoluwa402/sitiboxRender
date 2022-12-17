import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import selectOption from "../../components/selectOption";
import validate from "../../components/validateInfo/validateInfoC";
import ConsultationSteps from "../../components/ConsultationSteps/ConsultationSteps";
import { saveComplaint } from "../../actions/initiateActions";
// import DayPickerInput from "react-day-picker/DayPickerInput";
// import { DateUtils } from "react-day-picker";
import dateFnsFormat from "date-fns/format";
import dateFnsParse from "date-fns/parse";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import ExtraInfo from "../../components/ExtraInfo/ExtraInfo";
import Secure from "../../components/Secure/Secure";
import Layout from "../../components/Layout/Layout";
import { useNavigate } from "react-router-dom";

import styled from "./ComplaintScreen.module.css";
// import "react-day-picker/lib/style.css";
import "react-phone-number-input/style.css";

const ComplaintScreen = ({ history }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [disabled, setDisabled] = useState(false);

  const patientLogin = useSelector((state) => state.patientLogin);
  const { patientInfo } = patientLogin;

  const doctorLogin = useSelector((state) => state.doctorLogin);
  const { doctorInfo } = doctorLogin;

  const initiate = useSelector((state) => state.initiate);
  const { initiateItem, addComplaint } = initiate;

  useEffect(() => {
    // if patient is loggedIn and has previous complaint and a doctor selected not completed, redirect to final stage
    if (patientInfo && initiateItem.name !== undefined && addComplaint) {
      navigate("/request");
      toast.success(
        `welcome back ${patientInfo.clinicName}, pickup from where you left`
      );
    }

    if (!doctorInfo) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [navigate, patientInfo, doctorInfo, initiateItem, addComplaint]);

  const { genderOptions } = selectOption();

  const [values, setValues] = useState({
    complaint:
      addComplaint && addComplaint.complaint ? addComplaint.complaint : "",
    fileInput: "",
    firstName:
      addComplaint && addComplaint.firstName ? addComplaint.firstName : "",
    lastName:
      addComplaint && addComplaint.lastName ? addComplaint.lastName : "",
  });

  const [errors, setErrors] = useState({});
  const [birthDate, setBirthDate] = useState(undefined);
  const [file, setFile] = useState({});
  const [previewSource, setPreviewSource] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "fileInput") {
      const fileUpload = e.target.files[0];
      previewFile(fileUpload);
      setFile(fileUpload);
    }

    setValues({
      ...values,
      [name]: value,
    });
  };

  const previewFile = (file) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  // handle date change
  const handleDayChange = (day) => {
    setBirthDate(day);
  };

  // parse Date

  const parseDate = (str, format, locale) => {
    const parsed = dateFnsParse(str, format, new Date(), { locale });
    // if (DateUtils.isDate(parsed)) {
    //   return parsed;
    // }
    return undefined;
  };
  // format Date
  const formatDate = (date, format, locale) => {
    return dateFnsFormat(date, format, { locale });
  };

  const FORMAT = "dd/MM/yyyy";

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

  if (birthDate) {
    calculateYear(birthDate);
  }

  const submitHandler = (e) => {
    e.preventDefault();

    // set errors
    setErrors(validate({ values, age, birthDate }));

    // Dispatch register
    const data = {
      complaint: values.complaint,
      //   gender: values.gender,
      file: previewSource,
      //   age: age,
      //   firstName: values.firstName,
      //   lastName: values.lastName,
      //   birthdate: birthDate,
    };

    if (data.complaint) {
      dispatch(saveComplaint(data));
      navigate("/pickdoctor");
    } else {
      return;
    }
  };

  return (
    <Layout>
      <ConsultationSteps step1 />
      <div className={styled.container}>
        <div className={styled.left}>
          <div className={styled.complaint}>
            <div className={styled.complaintHeader}>
              <h2>Drop Your Complain</h2>
            </div>
            <div className={styled.complaintformWrapper}>
              <form className={styled.complaintForm} onSubmit={submitHandler}>
                <div className={styled.formControl}>
                  {errors.complaint && <p>{errors.complaint}</p>}
                  <label
                    htmlFor="Complaint"
                    style={{ fontSize: "1rem", fontWeight: "bolder" }}
                  >
                    List your complaint(s), duration (how long) for each and any
                    other explanation. <br />
                    <em style={{ fontSize: "0.9rem", fontWeight: "normal" }}>
                      (OPTIONAL) Include any treatment you may have received so
                      far, and/or results of medical tests. Indicate if you have
                      any known background medical condition or if you are using
                      any drug(s) presently. If you have any allergy (or react
                      to any drug or food), please also indicate. If female, you
                      may indicate your Last Menstrual Period date
                    </em>
                  </label>
                  <textarea
                    type="text"
                    id="complaint"
                    name="complaint"
                    value={values.complaint}
                    cols="30"
                    rows="10"
                    onChange={handleChange}
                  ></textarea>
                </div>

                <div className={styled.formControl}>
                  {errors.fileInput && <p>{errors.fileInput}</p>}
                  <label style={{ marginTop: "1rem" }} htmlFor="avatar">
                    UPLOAD SUPPORTING PICTURE -{" "}
                    <em style={{ fontSize: "0.9rem", fontWeight: "normal" }}>
                      If applicable, any supporting picture that better explains
                      your complaints e.g. skin rash, swelling etc. (optional)
                    </em>
                  </label>
                  <input
                    type="file"
                    accept=".png, .jpg, .jpeg"
                    id="file"
                    name="fileInput"
                    value={values.fileInput}
                    onChange={handleChange}
                  ></input>
                  {previewSource && (
                    <img
                      src={previewSource}
                      alt="chosen"
                      style={{ height: "300px" }}
                    />
                  )}
                </div>
                <hr />
                {/* <div className={styled.formControl}>
							<h5>Details of person with complaint</h5>
						</div> */}
                {/* <div className={styled.formControl}>
						{errors.firstname && <p>{errors.firstname}</p>}
							<label htmlFor="firstName">First Name</label>
							<input
								type="text"
								id="firstName"
								name="firstName"
								placeholder="Enter first name"
								value={values.firstName}
								onChange={handleChange}
							></input>
						</div> */}

                {/* <div className={styled.formControl}>
						{errors.lastname && <p>{errors.lastname}</p>}
							<label htmlFor="lastName">Last Name</label>
							<input
								type="text"
								id="lastName"
								name="lastName"
								placeholder="Enter lst name"
								value={values.lastName}
								onChange={handleChange}
							></input>
							
						</div> */}

                {/* <div className={styled.formControl}>
						{errors.birthdate && <p>{errors.birthdate}</p>}
							<label htmlFor="date">
								Date of Birth{" "}
								{age && age > 0 ? (
									<span className={styled.birth}>
										{age}yr(s)
									</span>
								) : null} 
							</label>
							
					        <DayPickerInput
					        	  formatDate={formatDate}
							      format={FORMAT}
							      parseDate={parseDate}
							      placeholder={`${dateFnsFormat(new Date(), FORMAT)}`}
					        	onDayChange={handleDayChange} 
					        />
							
						</div> */}

                {/* <div className={styled.formControl}>
						{errors.gender && <p>{errors.gender}</p>}
							<label htmlFor="gender">Gender</label>
							<select name="gender" onChange={handleChange}>
								{genderOptions.map((option, index) => (
									<option key={index} value={option.value}>
										{option.label}
									</option>
								))} 
							</select>
							
						</div> */}

                <div className={styled.formActions}>
                  <button disabled={disabled ? true : false} type="submit">
                    CONTINUE
                  </button>
                </div>
                <Secure />
              </form>
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

export default ComplaintScreen;
