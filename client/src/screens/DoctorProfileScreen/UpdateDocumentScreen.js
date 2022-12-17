import React, { useState, useEffect } from "react";
import Message from "../../components/Message/Message";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../components/Spinner/Spinner";
import { FaUserEdit } from "react-icons/fa";
import { updateDocumentAction } from "../../actions/doctorActions";
import { UPDATE_DOCUMENT_RESET } from "../../constants/doctorConstants";
import { useNavigate } from "react-router-dom";

import styles from "./UpdateDocumentScreen.module.css";

const UpdateDocumentScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [values, setValues] = useState({
    profile: "",
    fellowshipExamPDF: "",
    licensePDF: "",
  });

  const doctorLogin = useSelector((state) => state.doctorLogin);
  const { doctorInfo } = doctorLogin;

  const updateDocument = useSelector((state) => state.updateDocument);
  const { loading, error, success } = updateDocument;

  const [profileFile, setProfileFile] = useState("");
  const [profilePreview, setProfilePreview] = useState("");

  // for onchange event
  const [pdfFellowshipFile, setPdfFellowshipFile] = useState(null);
  const [pdfFileFellowshipError, setPdfFileFellowshipError] = useState("");

  const [pdfLicenseFile, setPdfLicenseFile] = useState(null);
  const [pdfFileLicenseError, setPdfFileLicenseError] = useState("");

  useEffect(() => {
    if (!doctorInfo) {
      navigate("/doclogin");
    }

    if (success) {
      navigate("/docdashboard/docprofile");
      dispatch({ type: UPDATE_DOCUMENT_RESET });
    }
  }, [dispatch, navigate, doctorInfo, success]);

  // handle change event for profile picture
  const handleChange = (e) => {
    const { name, value } = e.target;
    // preview profile picture
    if (name === "profile") {
      const fileUpload = e.target.files[0];
      handleProfilePreviewFile(fileUpload);
      setProfileFile(fileUpload);
    }

    setValues({
      ...values,
      [name]: value,
    });
  };

  const fileType = ["application/pdf"];
  // handle change event for pdf document
  const handlePdfFileChange = (e) => {
    const { name, value } = e.target;

    setValues({
      ...values,
      [name]: value,
    });

    if (name === "fellowshipExamPDF") {
      let selectedFile = e.target.files[0];

      if (selectedFile) {
        if (selectedFile && fileType.includes(selectedFile.type)) {
          let reader = new FileReader();
          reader.readAsDataURL(selectedFile);
          reader.onloadend = (e) => {
            setPdfFellowshipFile(e.target.result);
            setPdfFileFellowshipError("");
          };
        } else {
          setPdfFellowshipFile(null);
          setPdfFileFellowshipError("Please select valid pdf file");
        }
      } else {
        console.log("select your file");
      }
    }

    if (name === "licensePDF") {
      let selectedFile = e.target.files[0];
      if (selectedFile) {
        if (selectedFile && fileType.includes(selectedFile.type)) {
          let reader = new FileReader();
          reader.readAsDataURL(selectedFile);
          reader.onloadend = (e) => {
            setPdfLicenseFile(e.target.result);
            setPdfFileLicenseError("");
          };
        } else {
          setPdfLicenseFile(null);
          setPdfFileLicenseError("Please select valid pdf file");
        }
      } else {
        console.log("select your file");
      }
    }
  };

  // handle form submit event
  const submitHandler = (e) => {
    e.preventDefault();

    if (!profilePreview && !pdfFellowshipFile && !pdfLicenseFile) {
      return;
    }

    const myData = {
      image: profilePreview,
      license: pdfLicenseFile,
      fellowshipExam: pdfFellowshipFile,
    };

    dispatch(updateDocumentAction({ myData }));

    setValues({
      profile: "",
      fellowshipExamPDF: "",
      licensePDF: "",
    });
  };

  // handle all file previews
  const handleProfilePreviewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (event) {
      const imgElement = document.createElement("img");
      imgElement.src = event.target.result;

      imgElement.onload = function (e) {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 250;

        const scaleSize = MAX_WIDTH / e.target.width;
        canvas.width = MAX_WIDTH;
        canvas.height = e.target.height * scaleSize;

        const ctx = canvas.getContext("2d");

        ctx.drawImage(e.target, 0, 0, canvas.width, canvas.height);

        const srcEncoded = ctx.canvas.toDataURL(e.target, "image/jpeg");

        // you can send srcEncoded to the server
        setProfilePreview(srcEncoded);
      };
    };
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.formHeader}>
          <h2>
            <FaUserEdit /> Update Document
          </h2>
        </div>
        <div className={styles.formWrapper}>
          <form onSubmit={submitHandler} className={styles.form}>
            <p style={{ color: "#00ff00" }}>
              Note: You can upload document one at a time if upload is not
              successfull due to large document size. Maximum allowed total size
              is 10mb.
            </p>
            <div className={styles.formControl}>
              <label htmlFor="avatar">Profile picture</label>
              <span style={{ color: "#ffffff", fontSize: "0.8rem" }}>
                Please upload your promotional display picture - DP for your
                patients to see (preferably in medical scrubs or ward coat)
              </span>
              <input
                type="file"
                accept=".png, .jpg, .jpeg"
                id="file"
                name="profile"
                onChange={handleChange}
              />

              {profilePreview && (
                <img
                  src={profilePreview}
                  alt="chosen"
                  style={{ height: "300px", marginBottom: "1rem" }}
                />
              )}
            </div>

            <div className={styles.formControl}>
              {pdfFileLicenseError && (
                <div style={{ color: "red" }}>{pdfFileLicenseError}</div>
              )}
              <label htmlFor="licence">Practicing Licence</label>
              <span style={{ color: "#ffffff", fontSize: "0.8rem" }}>
                Please upload medical council registration" e.g. MDCN (Nig), GMC
                reg (UK) e.t.c" - (PDF)
              </span>
              <input
                type="file"
                name="licensePDF"
                value={values.licensePDF}
                onChange={handlePdfFileChange}
              />
            </div>

            <div className={styles.formControl}>
              {pdfFileFellowshipError && (
                <div style={{ color: "red" }}>{pdfFileFellowshipError}</div>
              )}
              <label htmlFor="fellowshipExam">
                Award of fellowship certificate (Optional)
              </label>
              <span style={{ color: "#ffffff", fontSize: "0.8rem" }}>
                Please upload award of fellowship certificate(PDF) - OPTIONAL
              </span>
              <input
                type="file"
                name="fellowshipExamPDF"
                id="fellowshipExam"
                value={values.fellowshipExamPDF}
                onChange={handlePdfFileChange}
              />
            </div>

            {loading && <Spinner />}
            {error && <Message message="dangerMessage">{error}</Message>}
            <div className={styles.formActions}>
              <button type="submit">UPDATE</button>
            </div>
            <p style={{ color: "#00ff00" }}>
              Ensure internet connection is strong for fast & successfull
              upload.
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default UpdateDocumentScreen;
