import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { MdVerifiedUser } from "react-icons/md";
import { BiCheckShield } from "react-icons/bi";
import { FaTimes } from "react-icons/fa";
import Rating from "../../components/Rating";
import avatar from "../../img/avatar.png";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack";
import { useNavigate } from "react-router-dom";
import { getDoctorProfile } from "../../actions/doctorActions";
import Message from "../../components/Message/Message";
import Spinner from "../../components/Spinner/Spinner";

import styled from "./DoctorProfileScreen.module.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

const DoctorProfileScreen = ({ history }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [addedLicenseData, showLicenseData] = useState(0);
  const [addedFellowshipData, showFellowshipData] = useState(0);
  // for submit event
  const [viewPdf, setViewPdf] = useState(null);

  const [viewLicensePdf, setViewLicensePdf] = useState(null);

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const doctorProfile = useSelector((state) => state.doctorProfile);
  const { loading, error, doctor } = doctorProfile;

  const doctorLogin = useSelector((state) => state.doctorLogin);
  const { doctorInfo } = doctorLogin;

  // doctorInfo will be null if not logged in
  useEffect(() => {
    if (!doctorInfo) {
      navigate("/doclogin");
    }
    dispatch(getDoctorProfile("profile"));
  }, [dispatch, navigate, doctorInfo]);

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

  // capitalize
  function capitalizeFirstLetter(string) {
    if (string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
  }

  return (
    <React.Fragment>
      {/*<Link to="/docdashboard" style={{position:"absolute", top:"150px", left:"100px", fontSize:"2rem"}}><ImArrowLeft /> {" "} Back</Link>*/}
      {loading ? (
        <Spinner />
      ) : error ? (
        <Message message="dangerMessage">{error}</Message>
      ) : doctor && doctor.firstName ? (
        <React.Fragment>
          <div className={styled.wrapper}>
            <div className={styled.left}>
              <h3>
                <Link to="/docdashboard/document" style={{ color: "#ffffff" }}>
                  Change profile picture
                </Link>
              </h3>
              <img
                src={doctor && doctor.image ? doctor.image : avatar}
                alt="doctor"
                width="300"
              />
              <h4 style={{ textTransform: "capitalize" }}>
                Dr{" "}
                {doctor.firstName
                  ? capitalizeFirstLetter(doctor.firstName)
                  : null}{" "}
                {doctor.lastName
                  ? capitalizeFirstLetter(doctor.lastName)
                  : null}
              </h4>
              <p>{doctor.specialty}</p>
            </div>
            <div className={styled.right}>
              <h2
                style={{
                  textAlign: "center",
                  fontSize: "2rem",
                }}
              >
                PROFILE
              </h2>
              <div className={styled.info}>
                <h3>Information</h3>
                <Link to="/docdashboard/docprofileupdate">Edit</Link>
                <div className="info_data">
                  <div className={styled.data}>
                    <h4>INGRESS CODE</h4>
                    <p>{doctor.ingressCode}</p>
                  </div>
                  <div className={styled.data}>
                    <h4>Email</h4>
                    <p>{doctor.email}</p>
                  </div>
                  <div className={styled.data}>
                    <h4>
                      Phone{" "}
                      {doctor.phoneVerified ? (
                        <span style={{ color: "green" }}>
                          verified <MdVerifiedUser />
                        </span>
                      ) : (
                        <Link to="/docdashboard/verifyphone">Verify phone</Link>
                      )}
                    </h4>
                    <p>{doctor.phone}</p>
                  </div>

                  <div className={styled.data}>
                    <h4>Bio</h4>
                    <p>{doctor.biodata}</p>
                  </div>
                </div>
              </div>

              <div className={styled.projects}>
                <h3>Extra Details</h3>
                <div className={styled.projectsData}>
                  <div className={styled.data}>
                    <h4>Ratings</h4>
                    <div>
                      <Rating
                        value={doctor.rating}
                        text={`${doctor.numReviews} reviews`}
                      />
                    </div>
                  </div>
                  <div className={styled.data}>
                    <h4>Reviews</h4>
                    <p>
                      <Link
                        to="/docdashboard/docProfile"
                        style={{ textDecoration: "none" }}
                      >
                        Patients Reviews.
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styled.tableWrapper}>
            <h4>
              Other Information <Link to="/docdashboard/document"> Edit</Link>
            </h4>
            <table className="table-sm">
              <tbody>
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
                  <th>License</th>
                  <td>
                    {doctor.licenseImage ? (
                      <>
                        <BiCheckShield style={{ color: "green" }} />
                        {/* <span
                          onClick={() =>
                            previewPDF({
                              url: doctor.licenseImage,
                              key: "license",
                            })
                          }
                          style={{ color: "green", cursor: "pointer" }}
                        >
                          {addedLicenseData ? "Hide Preview" : "Preview"}
                        </span> */}
                      </>
                    ) : (
                      <>
                        <FaTimes style={{ color: "red" }} />
                        <Link
                          to="/docdashboard/document"
                          style={{ color: "green" }}
                        >
                          {" "}
                          upload
                        </Link>
                      </>
                    )}
                  </td>
                </tr>

                <tr>
                  <th>Fellowship result</th>
                  <td>
                    {doctor.fellowshipExamImage ? (
                      <>
                        <BiCheckShield style={{ color: "green" }} />

                        {/* <span
                          onClick={() =>
                            previewPDF({
                              url: doctor.fellowshipExamImage,
                              key: "fellowship",
                            })
                          }
                          style={{ color: "green", cursor: "pointer" }}
                        >
                          {addedFellowshipData ? "Hide Preview" : "Preview"}
                        </span> */}
                      </>
                    ) : (
                      <>
                        <FaTimes style={{ color: "red" }} />
                        <Link
                          to="/docdashboard/document"
                          style={{ color: "green" }}
                        >
                          {" "}
                          upload
                        </Link>
                      </>
                    )}
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
                <Document file={viewPdf} onLoadSuccess={onDocumentLoadSuccess}>
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
    </React.Fragment>
  );
};

export default DoctorProfileScreen;
