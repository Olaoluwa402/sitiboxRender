import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BiCheckShield } from "react-icons/bi";
import { FaTimes } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

import Message from "../../components/Message/Message";
import Spinner from "../../components/Spinner/Spinner";
import { doctorAdminDetail, doctorVerified } from "../../actions/adminActions";
import { acctListOpenAccess } from "../../actions/doctorActions";
import { DOCTOR_VERIFY_RESET } from "../../constants/adminConstants";
import { toast } from "react-toastify";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack";
import AccountNumbersTable from "../../components/AccountNumbers/AccountNumbersTable";

import styled from "./DoctorDetailsScreen.module.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

const DoctorDetailsScreen = ({ history, match }) => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [addedLicenseData, showLicenseData] = useState(0);
  const [addedFellowshipData, showFellowshipData] = useState(0);
  // for submit event
  const [viewPdf, setViewPdf] = useState(null);

  const [viewLicensePdf, setViewLicensePdf] = useState(null);

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const { id } = useParams();
  const doctorId = id;

  const adminLogin = useSelector((state) => state.adminLogin);
  const { adminInfo } = adminLogin;

  const adminDoctorDetail = useSelector((state) => state.adminDoctorDetail);
  const { loading, error, doctor } = adminDoctorDetail;

  const acctsNumber = useSelector((state) => state.acctsNumber);
  const { loading: acctsLoading, error: acctsError, accts } = acctsNumber;

  const doctorVerify = useSelector((state) => state.doctorVerify);
  const {
    loading: loadingVerify,
    error: errorVerify,
    success: successVerify,
  } = doctorVerify;

  // doctor Info will be null if not logged in
  useEffect(() => {
    if (!adminInfo) {
      navigate("/adminLogin");
      toast.warning("Please login!");
    }

    if (doctorId || successVerify) {
      dispatch({ type: DOCTOR_VERIFY_RESET });
      dispatch(doctorAdminDetail({ doctorId }));
      dispatch(acctListOpenAccess({ doctorId }));
    }
  }, [dispatch, navigate, adminInfo, doctorId, successVerify]);

  const doctorVerifyHandler = (doctor) => {
    dispatch(doctorVerified(doctor));
  };

  // handle preview pdf
  const previewPDF = async ({ url, key }) => {
    if (key === "license") {
      showLicenseData(!addedLicenseData);

      setViewLicensePdf(url);
    }
    if (key === "fellowship") {
      showFellowshipData(!addedFellowshipData);

      setViewPdf(url);
    }
  };

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <React.Fragment>
      <div className={styled.container}>
        <h1>DOCTOR DETAILS</h1>
        {loading ? (
          <Spinner />
        ) : error ? (
          <Message message="dangerMessage">{error}</Message>
        ) : doctor ? (
          <React.Fragment>
            <div className={styled.tableWrapper}>
              <table className="table-sm">
                <tbody>
                  <tr>
                    <th>
                      <img
                        src={doctor.image}
                        alt="doctor"
                        width="100%"
                        height="400px"
                      />
                    </th>
                    <td style={{ fontWeight: "bold", display: "grid" }}>
                      <h4
                        style={{
                          margin: "auto",
                          fontSize: "2rem",
                          textTransform: "capitalize",
                        }}
                      >
                        Dr {doctor.firstName} {doctor.lastName}
                      </h4>
                      <h5>INGRESS CODE: {doctor.inviteCode}</h5>
                    </td>
                  </tr>
                  <tr>
                    <th>Specialty</th>
                    <td>{doctor.specialty}</td>
                  </tr>
                  <tr>
                    <th>Email</th>
                    <td>{doctor.email}</td>
                  </tr>

                  <tr>
                    <th>Phone</th>
                    <td>{doctor.phone}</td>
                  </tr>
                  <tr>
                    <th>Phone Verified</th>
                    <td>
                      {doctor.phoneVerified ? (
                        <BiCheckShield style={{ color: "green" }} />
                      ) : (
                        <FaTimes style={{ color: "red" }} />
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th>Doctor Verified</th>
                    <td>
                      {doctor.doctorIsVerified ? (
                        <BiCheckShield style={{ color: "green" }} />
                      ) : (
                        <FaTimes style={{ color: "red" }} />
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th>Biodata</th>
                    <td>{doctor.biodata}</td>
                  </tr>

                  <tr>
                    <th>License</th>
                    <td>
                      {doctor.licenseImage ? (
                        <>
                          <BiCheckShield style={{ color: "green" }} />
                          <span
                            onClick={() =>
                              previewPDF({
                                url: doctor.licenseImage,
                                key: "license",
                              })
                            }
                            style={{ color: "green", cursor: "pointer" }}
                          >
                            {addedLicenseData ? "Hide Preview" : "Preview"}
                          </span>
                        </>
                      ) : (
                        <>
                          <FaTimes style={{ color: "red" }} />
                        </>
                      )}
                    </td>
                  </tr>

                  <tr>
                    <th>Fellowship Certificate</th>
                    <td>
                      {doctor.fellowshipExamImage ? (
                        <>
                          <BiCheckShield style={{ color: "green" }} />

                          <span
                            onClick={() =>
                              previewPDF({
                                url: doctor.fellowshipExamImage,
                                key: "fellowship",
                              })
                            }
                            style={{ color: "green", cursor: "pointer" }}
                          >
                            {addedFellowshipData ? "Hide Preview" : "Preview"}
                          </span>
                        </>
                      ) : (
                        <>
                          <FaTimes style={{ color: "red" }} />
                        </>
                      )}
                    </td>
                  </tr>

                  <tr>
                    <th>
                      {loadingVerify && <Spinner />}
                      {errorVerify && (
                        <Message message="dangerMessage">{errorVerify}</Message>
                      )}
                    </th>
                    <td>
                      <button
                        className={styled.btn}
                        onClick={() => doctorVerifyHandler(doctor)}
                      >
                        {doctor.doctorIsVerified ? "Unverify" : "Verify"}
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {addedLicenseData ? (
              <>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Document
                    file={viewPdf}
                    onLoadSuccess={onDocumentLoadSuccess}
                  >
                    {Array.from(new Array(numPages), (el, index) => (
                      <Page key={`page_${index + 1}`} pageNumber={index + 1} />
                    ))}
                  </Document>
                </div>
              </>
            ) : null}

            {addedFellowshipData ? (
              <>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Document
                    file={viewLicensePdf}
                    onLoadSuccess={onDocumentLoadSuccess}
                  >
                    {Array.from(new Array(numPages), (el, index) => (
                      <Page key={`page_${index + 1}`} pageNumber={index + 1} />
                    ))}
                  </Document>
                </div>
              </>
            ) : null}
          </React.Fragment>
        ) : null}
      </div>

      {acctsLoading ? (
        <Spinner />
      ) : acctsError ? (
        <Message message="dangerMessage">{acctsError}</Message>
      ) : accts && accts.length > 0 ? (
        <AccountNumbersTable accts={accts} />
      ) : (
        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <h3>No account added yet</h3>
        </div>
      )}
    </React.Fragment>
  );
};

export default DoctorDetailsScreen;
