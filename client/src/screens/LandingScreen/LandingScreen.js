import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Layout from "../../components/Layout/Layout";
import { Link } from "react-router-dom";
import styles from "./LandingScreen.module.css";
import Spinner from "../../components/Spinner/Spinner";
import { FaHandPointDown } from "react-icons/fa";
import { FaDownload } from "react-icons/fa";
import docImg from "../../img/female-doctor.jpg";
import access from "../../img/access4.png";
import ePrescribe from "../../img/ePrescribe1.png";
import files from "../../img/files.png";
import clock from "../../img/clock.png";
import affordable from "../../img/affordable.png";
import secure from "../../img/secure.png";
import referral from "../../img/referral3.png";
import { useNavigate } from "react-router-dom";

const LandingScreen = ({ history }) => {
  const navigate = useNavigate();
  const [loading, setIsloading] = useState(true);
  const [disabled, setDisabled] = useState(false);

  const doctorLogin = useSelector((state) => state.doctorLogin);
  const { doctorInfo } = doctorLogin;

  useEffect(() => {
    if (!doctorInfo) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
    setIsloading(false);
  }, [doctorInfo]);

  const complaintHandler = () => {
    navigate("/complaint");
  };

  return (
    <Layout>
      {loading ? (
        <Spinner />
      ) : (
        <div className={styles.container}>
          <div className={styles.bcg}></div>
          <div className={styles.hero}>
            <div className={styles.hero__left}>
              <h1>Nurturing Health And Wellness via virtual care</h1>
              <p>
                You don't have to wait hours to see doctors for health
                complaints at the hospital. Connect with our professional
                doctors and have a quick medical service.
              </p>
              <div className={styles.actions}>
                <button
                  disabled={disabled ? true : false}
                  className={styles.btn}
                  style={{ marginRight: "5px" }}
                  onClick={complaintHandler}
                >
                  Drop Complaint
                </button>
                <Link to="/sitibox-guide" className={styles.btn}>
                  <FaDownload className={styles.icons} /> Guide
                </Link>
              </div>

              <p
                style={{
                  marginTop: "2.5rem",
                  color: "var(--primaryColor)",
                  fontSize: ".8rem",
                  fontStyle: "italic",
                }}
              >
                Consultation is at a very low cost!!
              </p>
            </div>
            <div className={styles.hero__right}>
              <img src={docImg} alt="online doctor" />
            </div>
          </div>

          {/* Hand pointer */}
          {/* <a className={styles.headerLink} href="#sitibox-specials">
              <span className="">
                <FaHandPointDown />
              </span>
            </a> */}

          <a className={styles.headerLink} href="#sitibox-specials">
            <span>24/7 Access and Benefits </span>
            <span className="">
              <FaHandPointDown style={{ fontSize: "2rem" }} />
            </span>
          </a>

          {/* Benefits section */}

          <section className={styles.benefitsContainer} id="sitibox-specials">
            <h3>What makes Sitibox, truly Beneficial and Amazing?</h3>
            <div className={styles.benefits}>
              <div className={styles.benefit__inner}>
                <img src={access} alt="benefit" width="80px" height="80px" />
                <div className={styles.benefit}>
                  <h4>Direct Access</h4>
                  <p>
                    Quick, simple & easy access to doctors with little or no
                    waiting time.
                  </p>
                </div>
              </div>

              <div className={styles.benefit__inner}>
                <img
                  src={ePrescribe}
                  alt="benefit"
                  width="80px"
                  height="80px"
                />
                <div className={styles.benefit}>
                  <h4>e-Prescriptions</h4>
                  <p>
                    Direct medical e-prescriptions available from your doctor
                    for free download.
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.benefits}>
              <div className={styles.benefit__inner}>
                <img src={files} alt="benefit" width="80px" height="80px" />
                <div className={styles.benefit}>
                  <h4>Medical Case File</h4>
                  <p>
                    Free online medical case file system for easy referencing
                    and follow-up.
                  </p>
                </div>
              </div>

              <div className={styles.benefit__inner}>
                <img src={clock} alt="benefit" width="80px" height="80px" />
                <div className={styles.benefit}>
                  <h4>Prompt Response</h4>
                  <p>
                    Prompt response with live chat and sms notification from
                    doctors at no cost.
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.benefits}>
              <div className={styles.benefit__inner}>
                <img src={referral} alt="benefit" width="80px" height="80px" />
                <div className={styles.benefit}>
                  <h4>E-Referral</h4>
                  <p>
                    Get a summary letter for in-person consultation referral
                    outside Sitibox. You only need to download your referral and
                    send to the hospital you are referred to for in-person
                    assessment.
                  </p>
                </div>
              </div>

              <div className={styles.benefit__inner}>
                <img
                  src={affordable}
                  alt="benefit"
                  width="80px"
                  height="80px"
                />
                <div className={styles.benefit}>
                  <h4>Affordable Fee</h4>
                  <p>
                    Affordable consultation fee. Medical Consultation is at a
                    low and affordable cost from our expert doctors.
                  </p>
                </div>
              </div>

              <div className={styles.benefit__inner}>
                <img src={secure} alt="benefit" width="80px" height="80px" />
                <div className={styles.benefit}>
                  <h4>Secure Information</h4>
                  <p>
                    Your information is kept highly confidencial, safe and
                    secured.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </Layout>
  );
};

export default LandingScreen;
