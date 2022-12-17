import React, { useEffect, useState } from "react";
import { FaMortarPestle } from "react-icons/fa";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Logo from "../../img/SitiboxLOGO-min.png";
// import ReactHtmlParser from "react-html-parser";

import Message from "../../components/Message/Message";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../components/Spinner/Spinner";
import { useParams, useNavigate } from "react-router-dom";
import { prescriptionDetail } from "../../actions/patientActions";
import { updatePrescriptionDetailAction } from "../../actions/doctorActions";
import { UPDATEPRESCRIPTION_DETAIL_RESET } from "../../constants/doctorConstants";
import { PRESCRIPTION_DETAIL_RESET } from "../../constants/patientConstants";
// import Back from "../../components/Back/Back";

import styled from "./NewPrescriptionScreen.module.css";

const EditPrescriptionScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const prescriptionId = id;

  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [addCKEditorData, setCKEditorData] = useState("Enter prescription");
  const [addedData, showData] = useState(0);

  // login state
  const doctorLogin = useSelector((state) => state.doctorLogin);
  const { doctorInfo } = doctorLogin;

  const myprescriptionDetail = useSelector(
    (state) => state.myprescriptionDetail
  );
  const { loading, error, prescription } = myprescriptionDetail;

  const updatePrescriptionDetail = useSelector(
    (state) => state.updatePrescriptionDetail
  );
  const {
    loading: loadingUpdate,
    success: successUpdate,
    error: errorUpdate,
  } = updatePrescriptionDetail;

  // capitalize
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  // userInfo will be null if not logged in
  useEffect(() => {
    if (!doctorInfo) {
      navigate("/doclogin");
    }

    if (!prescription || prescription._id !== prescriptionId) {
      dispatch(prescriptionDetail({ prescriptionId }));
    }

    if (prescription) {
      const fullName =
        capitalizeFirstLetter(prescription.patient.firstName) +
        " " +
        capitalizeFirstLetter(prescription.patient.lastName);
      setName(prescription.patient.firstName ? fullName : "");
      setAge(prescription.presDetail.age ? prescription.presDetail.age : "");
      setCKEditorData(
        prescription.presDetail.prescription
          ? prescription.presDetail.prescription
          : ""
      );
    }

    if (successUpdate) {
      dispatch({ type: UPDATEPRESCRIPTION_DETAIL_RESET });
      dispatch({ type: PRESCRIPTION_DETAIL_RESET });
      navigate("/docdashboard/docprescriptions");
    }
  }, [
    dispatch,
    navigate,
    doctorInfo,
    prescription,
    prescriptionId,
    successUpdate,
  ]);

  const submitHandler = (e) => {
    e.preventDefault();

    const myData = {
      name: name,
      age: age,
      prescription: addCKEditorData,
    };

    // Dispatch register
    dispatch(updatePrescriptionDetailAction({ myData, prescriptionId }));
  };

  const today = new Date();

  return (
    <React.Fragment>
      {/* <Back url='docdashboard/docprescriptions'/> */}
      <div className={styled.newPrescriptionScreen}>
        <div className={styled.newPrescriptionHeader}>
          <h2>
            <FaMortarPestle /> PRESCRIPTION
          </h2>
          <div className={styled.spacer}></div>
        </div>
        <div className={styled.prescriptionformWrapper}>
          <form className={styled.prescriptionForm} onSubmit={submitHandler}>
            <div className={styled.formControl}>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Patient name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></input>
            </div>

            <div className={styled.formControl}>
              <label htmlFor="age">Age</label>
              <input
                type="number"
                id="age"
                name="age"
                placeholder="Patient Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              ></input>
            </div>

            <CKEditor
              editor={ClassicEditor}
              data={addCKEditorData}
              onReady={(editor) => {
                // console.log("Editor is ready to use!", editor);
              }}
              onChange={(event, editor) => {
                const data = editor.getData();
                setCKEditorData(data);
              }}
              onBlur={(event, editor) => {
                // console.log("Blur.", editor);
              }}
              onFocus={(event, editor) => {
                // console.log("Focus.", editor);
              }}
            />

            {errorUpdate && (
              <Message message="dangerMessage">{errorUpdate}</Message>
            )}
            <div className={styled.formActions}>
              {loadingUpdate ? (
                <Spinner />
              ) : (
                <button type="submit">update prescription</button>
              )}
            </div>
          </form>
        </div>
        <div className={styled.formActions}>
          <button onClick={() => showData(!addedData)}>
            {addedData ? "Hide Preview" : "Preview"}
          </button>
        </div>
      </div>

      {/* show preview */}
      <div>
        {addedData ? (
          <div className={styled.invoiceBox}>
            <table cellPadding="0" cellSpacing="0">
              <tr className={styled.top}>
                <td colSpan="2">
                  <table>
                    <tr className={styled.topRow}>
                      <td className={styled.title}>
                        <h2>SITIBOX</h2>
                      </td>
                      <td>
                        <img src={Logo} alt="prescription" width="100px" />
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr className={styled.information}>
                <td colSpan="2">
                  <table>
                    <tr>
                      <td>
                        <p
                          style={{ color: "blue", fontWeight: "bold" }}
                        >{`Dr ${doctorInfo.firstName}`}</p>
                        <p>{doctorInfo.specialty}</p>
                      </td>
                      <td>
                        {/* <p>Prescription number: {values.prescriptionNumber}</p> */}
                        <p>
                          Date:{" "}
                          {`${today.getDate()} / ${
                            today.getMonth() + 1
                          } / ${today.getFullYear()}`}
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr className={styled.heading}>
                <td>Prescription(s)</td>
              </tr>
              <tr className={styled.item}>
                <td>{/* <div>{ReactHtmlParser(addCKEditorData)}</div> */}</td>
              </tr>
            </table>

            <tr className={styled.patientInfo}>
              <td>
                <table>
                  <tr>
                    <td>
                      <p
                        style={{
                          color: "blue",
                          fontWeight: "bold",
                          marginTop: "2rem",
                        }}
                      >
                        Name: {name}
                      </p>
                      <p>Age: {age}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <br />
            <div
              className={styled.justifyCenter}
              style={{
                backgroundColor: "var(--primaryColor)",
                padding: "1.3rem",
              }}
            >
              <p>https://sitibox.9jaclinic.com</p>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </React.Fragment>
  );
};

export default EditPrescriptionScreen;
