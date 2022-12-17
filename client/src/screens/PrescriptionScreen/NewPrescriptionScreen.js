import React, { useEffect, useState } from "react";
import { FaMortarPestle } from "react-icons/fa";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Logo from "../../img/SitiboxLOGO-min.png";
// import ReactHtmlParser from "react-html-parser";

import Message from "../../components/Message/Message";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../components/Spinner/Spinner";
import useForm from "../../components/useForm/usePrescriptionForm";
import validate from "../../components/validateInfo/validatePrescriptionInfo";
import { sendPrescription } from "../../actions/doctorActions";
import { getOrderDetails } from "../../actions/orderActions";
import { NEWPRESCRIPTION_RESET } from "../../constants/doctorConstants";
import Back from "../../components/Back/Back";
import { useParams, useNavigate } from "react-router-dom";

import styled from "./NewPrescriptionScreen.module.css";

const NewPrescriptionScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const orderId = id;

  const dispatch = useDispatch();
  const [addCKEditorData, setCKEditorData] = useState("Enter prescription");
  const [addedData, showData] = useState(0);

  // login state
  const doctorLogin = useSelector((state) => state.doctorLogin);
  const { doctorInfo } = doctorLogin;

  const sendPrescript = useSelector((state) => state.sendPrescript);
  const { loading, success, error } = sendPrescript;

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order } = orderDetails;

  // capitalize
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  // userInfo will be null if not logged in
  useEffect(() => {
    if (!doctorInfo) {
      navigate("/doclogin");
    }

    if (!order || order._id !== orderId) {
      dispatch(getOrderDetails(orderId));
    }

    if (order) {
      const fullName =
        capitalizeFirstLetter(order.mycomplaint.firstName) +
        " " +
        capitalizeFirstLetter(order.mycomplaint.lastName);
      setValues({
        name: order.mycomplaint.firstName ? fullName : "",
        age: order.mycomplaint.age ? order.mycomplaint.age : "",
      });
    }

    if (success) {
      dispatch({ type: NEWPRESCRIPTION_RESET });
      navigate("/docdashboard/docprescriptions");
    }
  }, [dispatch, navigate, doctorInfo, order, orderId, success]);

  let patientId;
  if (order) {
    patientId = order.patient._id;
  }

  const { handleChange, values, setValues, errors, submitHandler } = useForm(
    validate,
    dispatch,
    sendPrescription,
    addCKEditorData,
    patientId,
    orderId
  );

  const today = new Date();

  return (
    <React.Fragment>
      <Back url="/docdashboard" />
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
                value={values.name}
                onChange={handleChange}
              ></input>
              {errors.name && <p>{errors.name}</p>}
            </div>

            <div className={styled.formControl}>
              <label htmlFor="age">Age</label>
              <input
                type="number"
                id="age"
                name="age"
                placeholder="Patient Age"
                value={values.age}
                onChange={handleChange}
              ></input>
              {errors.age && <p>{errors.age}</p>}
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
            {errors.age && <p>{errors.age}</p>}

            {loading && <Spinner />}
            {error && <Message message="dangerMessage">{error}</Message>}
            <div className={styled.formActions}>
              <button type="submit">Send prescription</button>
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
                        <p>Prescription number: {values.prescriptionNumber}</p>
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
                        Mr/Miss/Mrs: {values.name}
                      </p>
                      <p>Age: {values.age}</p>
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

export default NewPrescriptionScreen;
