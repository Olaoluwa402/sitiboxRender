import React, { useState, useEffect } from "react";
import Message from "../../components/Message/Message";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../components/Spinner/Spinner";
import { FaUserEdit } from "react-icons/fa";
import { updateDocumentAction } from "../../actions/patientActions";
import { UPDATE_DOCUMENT_RESET } from "../../constants/patientConstants";
import { useNavigate } from "react-router-dom";
import styles from "./PatientDocumentUpdateScreen.module.css";

const PatientDocumentUpdateScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [values, setValues] = useState({
    profile: "",
  });

  const patientLogin = useSelector((state) => state.patientLogin);
  const { patientInfo } = patientLogin;

  const PatientUpdateDocument = useSelector(
    (state) => state.PatientUpdateDocument
  );
  const { loading, error, success } = PatientUpdateDocument;

  const [profileFile, setProfileFile] = useState("");
  const [profilePreview, setProfilePreview] = useState("");

  useEffect(() => {
    if (!patientInfo) {
      navigate("/login");
    }

    if (success) {
      navigate("/dashboard/profile");
      dispatch({ type: UPDATE_DOCUMENT_RESET });
    }
  }, [dispatch, navigate, patientInfo, success]);

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

  // handle all file previews
  const handleProfilePreviewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setProfilePreview(reader.result);
    };
  };

  // handle form submit event
  const submitHandler = (e) => {
    e.preventDefault();

    if (!profilePreview) {
      return;
    }

    const myData = {
      image: profilePreview,
    };

    dispatch(updateDocumentAction({ myData }));

    setValues({
      profile: "",
    });
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
            <div className={styles.formControl}>
              <label htmlFor="avatar">Profile picture</label>
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

            {loading && <Spinner />}
            {error && <Message message="dangerMessage">{error}</Message>}
            <div className={styles.formActions}>
              <button type="submit">UPDATE</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default PatientDocumentUpdateScreen;
