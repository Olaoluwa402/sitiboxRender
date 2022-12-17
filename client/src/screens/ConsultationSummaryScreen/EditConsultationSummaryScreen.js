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
import Back from "../../components/Back/Back";
import { updateSummaryDetailAction } from "../../actions/doctorActions";
import { getSummaryDetail } from "../../actions/doctorActions";
import { UPDATESUMMARY_DETAIL_RESET } from "../../constants/doctorConstants";

import styled from "./EditConsultationSummaryScreen.module.css";

const EditConsultationsummaryScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const summaryId = id;

  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [addCKEditorData, setCKEditorData] = useState("");
  const [addedData, showData] = useState(0);

  // login state
  const doctorLogin = useSelector((state) => state.doctorLogin);
  const { doctorInfo } = doctorLogin;

  const updateSummaryDetail = useSelector((state) => state.updateSummaryDetail);
  const {
    loading: loadingUpdate,
    success: successUpdate,
    error: errorUpdate,
  } = updateSummaryDetail;

  const summaryDetail = useSelector((state) => state.summaryDetail);
  const { loading, error, summary } = summaryDetail;

  // capitalize
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  // userInfo will be null if not logged in
  useEffect(() => {
    if (!doctorInfo) {
      navigate("/doclogin");
    }

    if (!summary || (summaryId && summary._id !== summaryId)) {
      dispatch(getSummaryDetail({ summaryId }));
    }

    if (summary) {
      const fullName =
        capitalizeFirstLetter(summary.patient.firstName) +
        " " +
        capitalizeFirstLetter(summary.patient.lastName);
      setName(summary.patient.firstName ? fullName : "");
      setAge(summary.summaryDetail.age ? summary.summaryDetail.age : "");
      setCKEditorData(
        summary.summaryDetail.summary ? summary.summaryDetail.summary : ""
      );
    }

    if (successUpdate) {
      dispatch({ type: UPDATESUMMARY_DETAIL_RESET });
      navigate("/docdashboard/summaries");
    }
  }, [dispatch, navigate, doctorInfo, summary, summaryId, successUpdate]);

  const submitHandler = (e) => {
    e.preventDefault();

    const myData = {
      name: name,
      age: age,
      summary: addCKEditorData,
    };

    // Dispatch register
    dispatch(updateSummaryDetailAction({ myData, summaryId }));
  };

  const today = new Date();
  return (
    <React.Fragment>
      <Back url="/docdashboard/summaries" />
      <div className={styled.newSummaryScreen}>
        <div className={styled.newSummaryHeader}>
          <h2>
            <FaBookMedical /> CASE FILE
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
                <button type="submit">update summary</button>
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

export default EditConsultationsummaryScreen;
