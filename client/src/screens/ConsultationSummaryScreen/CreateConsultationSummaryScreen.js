import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaBookMedical } from "react-icons/fa";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Logo from "../../img/SitiboxLOGO-min.png";
// import ReactHtmlParser from "react-html-parser";
import { useNavigate, useParams } from "react-router-dom";
import Message from "../../components/Message/Message";
import Spinner from "../../components/Spinner/Spinner";
import validate from "../../components/validateInfo/validateConsultSummary";
import { createConsultationSummary } from "../../actions/doctorActions";
import { getOrderDetails } from "../../actions/orderActions";
import { CREATECONSULTATION_SUMMARY_RESET } from "../../constants/doctorConstants";

import styled from "./CreateConsultationSummaryScreen.module.css";

const CreateConsultationsummaryScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const orderId = id;

  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [errors, setErrors] = useState({});
  const [addCKEditorData, setCKEditorData] = useState("Enter summary");
  const [addedData, showData] = useState(0);

  // login state
  const doctorLogin = useSelector((state) => state.doctorLogin);
  const { doctorInfo } = doctorLogin;

  const consultationSummary = useSelector((state) => state.consultationSummary);
  const { loading, success, error } = consultationSummary;

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
      setName(order.mycomplaint.firstName ? fullName : "");
      setAge(order.mycomplaint.age ? order.mycomplaint.age : "");
    }

    if (success) {
      dispatch({ type: CREATECONSULTATION_SUMMARY_RESET });
      navigate("/docdashboard/summaries");
    }
  }, [dispatch, navigate, doctorInfo, order, orderId, success]);

  let patientId;
  if (order) {
    patientId = order.patient._id;
  }

  const submitHandler = (e) => {
    e.preventDefault();

    // set errors
    setErrors(validate({ name, age, addCKEditorData }));

    if (name && age && addCKEditorData && patientId) {
      const myData = {
        name: name,
        age: age,
        summary: addCKEditorData,
        patient: patientId,
        orderId: orderId,
      };

      // Dispatch register
      dispatch(createConsultationSummary({ myData }));
    } else {
      return;
    }
  };

  const today = new Date();
  return (
    <React.Fragment>
      <div className={styled.newSummaryScreen}>
        <div className={styled.newSummaryHeader}>
          <h2>
            <FaBookMedical /> SUMMARY
          </h2>
          <div className={styled.spacer}></div>
        </div>
        <div className={styled.summaryformWrapper}>
          <form className={styled.summaryForm} onSubmit={submitHandler}>
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
              {errors.name && <p>{errors.name}</p>}
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
              <button type="submit">Create summary</button>
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
          <div className={styled.summaryBox}>
            <table cellPadding="0" cellSpacing="0">
              <tr className={styled.top}>
                <td colSpan="2">
                  <table>
                    <tr className={styled.topRow}>
                      <td className={styled.title}>
                        <h2>SITIBOX</h2>
                      </td>
                      <td>
                        <img src={Logo} alt="summary" width="100px" />
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
                <td>Summary(s)</td>
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
                        Mr/Miss/Mrs: {name}
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

export default CreateConsultationsummaryScreen;
