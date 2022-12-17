import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaBookMedical } from "react-icons/fa";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Logo from "../../img/SitiboxLOGO-min.png";
// import ReactHtmlParser from "react-html-parser";
import { useParams, useNavigate } from "react-router-dom";
import Message from "../../components/Message/Message";
import Spinner from "../../components/Spinner/Spinner";
import { updateReferralDetailAction } from "../../actions/doctorActions";
import {
  UPDATEREFERRAL_DETAIL_RESET,
  REFERRAL_DETAIL_RESET,
} from "../../constants/doctorConstants";
import { getReferralDetail } from "../../actions/doctorActions";

import styled from "./NewReferralScreen.module.css";

function EditReferralScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id } = useParams();
  const referralId = id;

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [errors, setErrors] = useState({});
  const [addCKEditorData, setCKEditorData] = useState("Referral detail");
  const [addedData, showData] = useState(0);

  // login state
  const doctorLogin = useSelector((state) => state.doctorLogin);
  const { doctorInfo } = doctorLogin;

  const referralDetail = useSelector((state) => state.referralDetail);
  const { loading, error, referral } = referralDetail;

  const updateReferralDetail = useSelector(
    (state) => state.updateReferralDetail
  );
  const {
    loading: loadingUpdate,
    success: successUpdate,
    error: errorUpdate,
  } = updateReferralDetail;

  // capitalize
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  // userInfo will be null if not logged in
  useEffect(() => {
    if (!doctorInfo) {
      navigate("/doclogin");
    }

    if (!referral || referral._id !== referralId) {
      dispatch(getReferralDetail({ referralId }));
    }

    if (referral) {
      const fullName =
        capitalizeFirstLetter(referral.patient.firstName) +
        " " +
        capitalizeFirstLetter(referral.patient.lastName);
      setName(referral.patient.firstName ? fullName : "");
      setAge(referral.referralDetail.age ? referral.referralDetail.age : "");
      setCKEditorData(
        referral.referralDetail.referral ? referral.referralDetail.referral : ""
      );
    }

    if (successUpdate) {
      dispatch({ type: UPDATEREFERRAL_DETAIL_RESET });
      dispatch({ type: REFERRAL_DETAIL_RESET });
      navigate("/docdashboard/referrals");
    }
  }, [dispatch, navigate, doctorInfo, referral, referralId, successUpdate]);

  const submitHandler = (e) => {
    e.preventDefault();

    const myData = {
      name: name,
      age: age,
      referral: addCKEditorData,
    };

    // Dispatch register
    dispatch(updateReferralDetailAction({ myData, referralId }));
  };

  const today = new Date();
  return (
    <React.Fragment>
      <div className={styled.newReferralScreen}>
        <div className={styled.newReferralHeader}>
          <h2>
            <FaBookMedical /> REFERRAL
          </h2>
          <div className={styled.spacer}></div>
        </div>
        <div className={styled.referralformWrapper}>
          <form className={styled.referralForm} onSubmit={submitHandler}>
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
                <button type="submit">update Referral</button>
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
          <div className={styled.referralBox}>
            <table cellPadding="0" cellSpacing="0">
              <tr className={styled.top}>
                <td colSpan="2">
                  <table>
                    <tr className={styled.topRow}>
                      <td className={styled.title}>
                        <h2>SITIBOX</h2>
                      </td>
                      <td>
                        <img src={Logo} alt="9jaclinic" width="100px" />
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
                <td>Referral(s)</td>
              </tr>
              {/* <tr className={styled.item}>
                   <td><div>{ReactHtmlParser(addCKEditorData)}</div></td>
                </tr> */}
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
              <p>https://www.sitibox.9jaclinic.com</p>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </React.Fragment>
  );
}

export default EditReferralScreen;
