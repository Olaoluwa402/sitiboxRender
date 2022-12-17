import React, { useEffect } from "react";
import Logo from "../../img/SitiboxLOGO-min.png";
import jsPDF from "jspdf";

import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/Message/Message";
import Spinner from "../../components/Spinner/Spinner";
import { getReferralDetail } from "../../actions/doctorActions";
// import ReactHtmlParser from "react-html-parser";
import { useParams } from "react-router-dom";
import styled from "./ReferralScreen.module.css";

const ReferralScreen = () => {
  const { id } = useParams();
  const referralId = id;
  const dispatch = useDispatch();

  const referralDetail = useSelector((state) => state.referralDetail);
  const { loading, error, referral } = referralDetail;

  // doctor Info will be null if not logged in
  useEffect(() => {
    if (referralId) {
      dispatch(getReferralDetail({ referralId }));
    }
  }, [dispatch, referralId]);

  const generatePdf = () => {
    let doc = new jsPDF("p", "pt", "a4");
    doc.html(document.querySelector("#referral"), {
      callback: function (pdf) {
        pdf.save("referral.pdf");
      },
    });
  };

  const today = new Date();
  return (
    <React.Fragment>
      {loading ? (
        <Spinner />
      ) : error ? (
        <Message message="dangerMessage">{error}</Message>
      ) : referral ? (
        <React.Fragment>
          <div className={styled.download}>
            <button onClick={generatePdf} type="primary">
              download pdf
            </button>
          </div>
          <div className={styled.referralBox} id="referral">
            <table cellPadding="0" cellSpacing="0">
              <tr className={styled.top}>
                <td colSpan="2">
                  <table>
                    <tr className={styled.topRow}>
                      <td className={styled.title}>
                        <h2>SITIBOX</h2>
                      </td>
                      <td>
                        <img src={Logo} alt="sitibox" width="100px" />
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
                        <p style={{ color: "blue", fontWeight: "bold" }}>
                          Dr {referral.referralDetail.doctorName}
                        </p>
                        <p>{referral.referralDetail.doctorSpecialty}</p>
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
              <tr className={styled.item}>
                {/* <td><div>{ReactHtmlParser(referral.referralDetail.referral)}</div></td> */}
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
                        Name: {referral.referralDetail.name}
                      </p>
                      <p>Age: {referral.referralDetail.age}</p>
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
                color: "#ffffff",
                padding: "1.3rem",
              }}
            >
              <p>https://www.sitibox.9jaclinic.com</p>
            </div>
          </div>
        </React.Fragment>
      ) : null}
    </React.Fragment>
  );
};

export default ReferralScreen;
