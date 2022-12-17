import React, { useEffect } from "react";
import Logo from "../../img/SitiboxLOGO-min.png";
import { jsPDF } from "jspdf";

import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/Message/Message";
import Spinner from "../../components/Spinner/Spinner";
import { getSummaryDetail } from "../../actions/doctorActions";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
// import ReactHtmlParser from "react-html-parser";

import styled from "./ConsultationSummaryScreen.module.css";

const ConsultationSummaryScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const summaryId = id;
  const dispatch = useDispatch();

  const doctorLogin = useSelector((state) => state.doctorLogin);
  const { doctorInfo } = doctorLogin;

  const adminLogin = useSelector((state) => state.adminLogin);
  const { adminInfo } = adminLogin;

  const summaryDetail = useSelector((state) => state.summaryDetail);
  const { loading, error, summary } = summaryDetail;

  // doctor Info will be null if not logged in
  useEffect(() => {
    if (doctorInfo || adminInfo) {
      if (summaryId) {
        dispatch(getSummaryDetail({ summaryId }));
      } else {
        navigate("/");
        toast.warning("Not Authorized!");
      }
    }
  }, [dispatch, navigate, doctorInfo, summaryId, adminInfo]);

  const generatePdf = () => {
    let doc = new jsPDF("p", "pt", "a4");
    doc.html(document.querySelector("#summary"), {
      callback: function (pdf) {
        pdf.save("summary.pdf");
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
      ) : summary ? (
        <React.Fragment>
          <div className={styled.download}>
            <button onClick={generatePdf} type="primary">
              download pdf
            </button>
          </div>
          <div className={styled.summaryBox} id="summary">
            <table cellPadding="0" cellSpacing="0">
              <tr className={styled.top}>
                <td colSpan="2">
                  <table>
                    <tr className={styled.topRow}>
                      <td className={styled.title}>
                        <h2>SITIBOX</h2>
                      </td>
                      <td>
                        <img src={Logo} alt="summary" width="250px" />
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
                          style={{
                            color: "blue",
                            fontWeight: "bold",
                            textTransform: "capitalize",
                          }}
                        >
                          Dr {summary.summaryDetail.doctorName}
                        </p>
                        <p
                          style={{
                            textTransform: "capitalize",
                          }}
                        >
                          {summary.summaryDetail.doctorSpecialty}
                        </p>
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
                <td>
                  {/* <div>{ReactHtmlParser(summary.summaryDetail.summary)}</div> */}
                </td>
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
                          textTransform: "capitalize",
                        }}
                      >
                        Name: {summary.summaryDetail.name}
                      </p>
                      <p>Age: {summary.summaryDetail.age}</p>
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
      ) : (
        <div style={{ marginTop: "2rem" }}>
          <h3>No summary yet</h3>
        </div>
      )}
    </React.Fragment>
  );
};

export default ConsultationSummaryScreen;
