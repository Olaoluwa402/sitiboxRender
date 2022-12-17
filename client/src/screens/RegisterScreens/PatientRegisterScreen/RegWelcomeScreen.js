import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { resendMail } from "../../../actions/doctorActions";
import { resendMailPatient } from "../../../actions/patientActions";
import Spinner from "../../../components/Spinner/Spinner";
import Message from "../../../components/Message/Message";

import styled from "./RegWelcomeScreen.module.css";

const RegWelcomeScreen = () => {
  const dispatch = useDispatch();

  const mailSentDoctor = useSelector((state) => state.mailSentDoctor);
  const { loading, error, data } = mailSentDoctor;

  const mailSentPatient = useSelector((state) => state.mailSentPatient);
  const {
    loading: loadingPat,
    error: errorPat,
    data: dataPat,
  } = mailSentPatient;

  const docMailDetail = localStorage.getItem("resendmailDoc")
    ? JSON.parse(localStorage.getItem("resendmailDoc"))
    : null;

  const patMailDetail = localStorage.getItem("resendmailPat")
    ? JSON.parse(localStorage.getItem("resendmailPat"))
    : null;

  const resendMailHandler = () => {
    if (docMailDetail) {
      dispatch(
        resendMail({
          name: docMailDetail.name,
          email: docMailDetail.email,
        })
      );
    } else if (patMailDetail) {
      dispatch(
        resendMailPatient({
          name: patMailDetail.name,
          email: patMailDetail.email,
        })
      );
    } else {
      return;
    }
  };

  return (
    <>
      <div className={styled.welcome}>
        <div className={styled.container}>
          <h4>Congratulation! Registration successful.</h4>
          <p>Thank you for registering with 9jaclinic.</p>
          <p className={styled.alert}>
            Please check your mail to complete your registration.
          </p>

          <p>
            Did not receive mail?{" "}
            <button className={styled.alert} onClick={resendMailHandler}>
              resend
            </button>
          </p>
          {docMailDetail && loading && <Spinner />}
          {docMailDetail && error && (
            <Message message="dangerMessage">{error}</Message>
          )}
          {patMailDetail && loadingPat && <Spinner />}
          {patMailDetail && errorPat && (
            <Message message="dangerMessage">{errorPat}</Message>
          )}

          <hr style={{ marginTop: "2rem" }} />
        </div>
      </div>

      <div className={styled.header}>
        <h2>SITIBOX HEALTH ONLINE</h2>
      </div>
      <div className={styled.appGuide}>
        <div className={styled.guide}>
          <h3> QUICK PATIENT'S GUIDE</h3>
          <p>
            The platform is very easy to use and similar to other common apps.
          </p>
          <p>Your health is now in your hands.</p>

          <h4>FEATURES</h4>
          <ul>
            <li>
              Dashboard: This is where you have the summary of all your SITIBOX
              health account
            </li>
            <li>
              SITIBOX Ingress Code: This is the code that gives you access to
              the specific doctor you want. Get an ingress code from your
              doctors to connect with them on SITIBOX health app.
            </li>
            <li>
              SITIBOX Consultation Room: This is the chatroom where you and your
              doctor can privately communicate and chat
            </li>
            <li>
              SITIBOX e-prescription: When your doctors prescribe drugs, you
              will get the prescription in your dashboard, under the
              “prescription” tab. You can download from here and/or print
              (optional).
            </li>
            <li>
              SITIBOX Referral: If you need to be referred with a letter to
              another doctor, you will get the letter of referral directly in
              your dashboard.
            </li>
          </ul>

          <h4>STEPS ON HOW TO USE</h4>
          <ul>
            <li>Click “Drop complaints” button</li>
            <li>Type your complaints</li>
            <li>
              (optional) Upload any supporting picture for your complaint e.g.
              picture of a body swelling or skin rash
            </li>
            <li>
              Select a doctor to consult you by entering the ingress code of
              your doctor. (Always ask your doctor for their “sitibox ingress
              code”
            </li>
            <li>Select your doctor to consult</li>
            <li>
              Make sure you are registered if you are a new user, or login if
              you are already registered before
            </li>
            <li>
              Check left upper right corner of your dashboard and click “ enter
              consultation room”
            </li>
            <li>Start consulting with you doctor</li>
            <li>
              Online consultation room closes when your medical doctor concludes
              with you and closes the room or after 3 days, whichever comes
              first
            </li>
          </ul>
          <p>Thank you</p>
          <p>9jaclinic Team</p>
        </div>

        <div className={styled.guide}>
          <h3>QUICK DOCTOR'S GUIDE</h3>
          <p>
            The platform is very easy to use and similar to other common apps.
          </p>
          <p>Offer your professionalism on the go.</p>

          <h4>FEATURES</h4>
          <ul>
            <li>
              Dashboard: This is where you have the summary of all your SITIBOX
              health account
            </li>
            <li>
              SITIBOX Ingress Code: This is the unique code that you give out to
              patients that you want to consult on the SITIBOX health app. More
              like your personal referral code. Patients will be asked to
              provide this code before they can select you for consultation on
              the app. Always remember to give any patient you are referring to
              this app this code.
            </li>
            <li>
              SITIBOX Consultation Room: This is a chatroom where you and your
              patients can privately communicate and chat. You will also have
              access to patient's previous case files from the chatroom.
            </li>
            <li>
              SITIBOX e-Prescription: This tab allows you to create an
              e-prescription for your patients. Create the e-prescription like
              you would write on a regular prescription pad.
            </li>
            <li>
              SITIBOX Referral: This tab allows you to type a referral letter
              for the patients to download or print.
            </li>
          </ul>

          <h4>STEPS ON HOW TO USE</h4>
          <ul>
            <li>Register if you are a new user</li>
            <li>Login if you are already registered</li>
            <li>Make sure your profile information is complete</li>
            <li>
              You will get an SMS ALERT once a patient books and pays for your
              consultation online
            </li>
            <li>
              Click “Enter consultation room” at top right corner of your
              dashboard
            </li>
            <li>START CONSULTING ONLINE</li>
            <li>
              After consultation, go to your dashboard to issue e-prescriptions,
              e-referrals, e-lab requests and so on. The consulting room closes
              when you finish your consultation, document consultation summaries
              in online case notes and click “marked as completed” on your
              dashboard.
            </li>
            <li>
              There is a 3 day window period available to conclude your medical
              consultation/chat online
            </li>
            <li>
              Always ask for patients' satisfaction before “marking the
              consultation as complete”
            </li>
            <li>
              Always document consultation summary in online case notes. This is
              for records and payment purposes
            </li>
            <li>Ensure you mark consultation as complete</li>
            <li>
              Your account gets credited immediately consultations are marked as
              complete
            </li>
            <li> Check balance on your dashboard, under payment tab</li>
            <li> Repeat same cycle for subsequent patient consultations </li>
            <li> Drop feedback on consultation experiences here </li>
            <li>
              {" "}
              For technical assistance at any point in the process, send mail to
              service@9jaclinic.com
            </li>
          </ul>
          <p>Thank you</p>
          <p>9jaclinic Team</p>
        </div>
      </div>
    </>
  );
};

export default RegWelcomeScreen;
