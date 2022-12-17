import React, { useEffect } from "react";
import Logo from "../../img/SitiboxLOGO-min.png";
import { jsPDF } from "jspdf";

import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/Message/Message";
import Spinner from "../../components/Spinner/Spinner";
import { prescriptionDetail } from "../../actions/patientActions";

// import ReactHtmlParser from "react-html-parser";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

import styled from "./PrescriptionScreen.module.css";

const PrescriptionScreen = ({ match, history }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const prescriptionId = id;
  const dispatch = useDispatch();

  const patientLogin = useSelector((state) => state.patientLogin);
  const { patientInfo } = patientLogin;

  const doctorLogin = useSelector((state) => state.doctorLogin);
  const { doctorInfo } = doctorLogin;

  const myprescriptionDetail = useSelector(
    (state) => state.myprescriptionDetail
  );
  const { loading, error, prescription } = myprescriptionDetail;

  // doctor Info will be null if not logged in
  useEffect(() => {
    if (!patientInfo && !doctorInfo) {
      navigate("/");
      toast.warning("Only accessible to loggedIn Patient or Doctor!");
    }

    if (prescriptionId) {
      dispatch(prescriptionDetail({ prescriptionId }));
    }
  }, [dispatch, navigate, patientInfo, doctorInfo, prescriptionId]);

  const generatePdf = () => {
    let doc = new jsPDF("p", "pt", "a4");
    doc.html(document.querySelector("#prescription"), {
      callback: function (pdf) {
        pdf.save("prescription.pdf");
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
      ) : prescription ? (
        <React.Fragment>
          <div className={styled.download}>
            <button onClick={generatePdf} type="primary">
              download pdf
            </button>
          </div>
          <div className={styled.invoiceBox} id="prescription">
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
                          style={{
                            color: "blue",
                            fontWeight: "bold",
                            textTransform: "capitalize",
                          }}
                        >
                          Dr {prescription.presDetail.doctorName}
                        </p>
                        <p>{prescription.presDetail.doctorSpecialty}</p>
                      </td>
                      <td>
                        <p>
                          Prescription No:{" "}
                          {prescription.presDetail.prescriptionNumber}
                        </p>
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
                <td>
                  <div>
                    {/* {ReactHtmlParser(prescription.presDetail.prescription)} */}
                  </div>
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
                          testTransform: "capitalize",
                        }}
                      >
                        Name: {prescription.presDetail.name}
                      </p>
                      <p>Age: {prescription.presDetail.age}</p>
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
          <h3>No prescription yet</h3>
        </div>
      )}
    </React.Fragment>
  );
};

export default PrescriptionScreen;
