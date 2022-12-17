import React from "react";
// import { FaDownload } from "react-icons/fa";
// import { Link } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import complaint from "../../img/complaintbtn.png";
import complaintbox from "../../img/complaintbox.png";
import ingress from "../../img/ingress.png";
import doctorSelect from "../../img/doctor-select.png";
import createConsult from "../../img/create-consult.png";
import record from "../../img/record2.png";
import presbox from "../../img/presbox.png";
import sms from "../../img/sms.jpeg";

import styled from "./AppGuideScreen.module.css";

const AppGuideScreen = () => {
  return (
    <Layout>
      {/* <div className={styled.download}>
        <Link to="/appguide">
          <FaDownload /> PDF
        </Link>
      </div> */}
      <div className={styled.header}>
        <h2>SITIBOX HEALTH ONLINE</h2>
      </div>
      <div className={styled.appGuide}>
        <div className={styled.guide}>
          <h3> QUICK PATIENT'S GUIDE</h3>

          <p>
            The platform is very easy to use and similar to other common apps.
            Health is brought closer to you.
          </p>

          <h4>Steps</h4>
          <ol>
            <li>
              Click &gt; <b>"Drop complaint"</b> button
              <div>
                <img src={complaint} alt="complaint" />
              </div>
            </li>
            <li>
              Type in your complaints
              <div>
                <img src={complaintbox} alt="compalint box" />
              </div>
            </li>
            <li>
              Select a doctor to consult by entering the “Ingress code” of your
              doctor. Click &gt; <b>"Get doctor"</b>
              <div>
                <img src={ingress} alt="ingress" />
              </div>
            </li>
            <li>
              Select your doctor to consult. Click &gt; <b>"Select Doctor"</b>
              <div>
                <img src={doctorSelect} alt="doctorSelect" />
              </div>
            </li>
            <li>
              Make sure you are logged in. If not, you'll be redirected to
              register/login
            </li>
            <li>
              Click &gt; <b>"Create consultation"</b> (or enter promo code, if
              available and Click &gt; <b>"Enter"</b>). Ensure you make payment
              afterward
              <div>
                <img src={createConsult} alt="createConsult" />
              </div>
            </li>
            <li>
              On your dashboard, Click &gt; <b>"Consultation order"</b> you just
              paid for, Click &gt; <b>"Details"</b>
            </li>
            <li>
              Check upper right corner of your screen, Click &gt;{" "}
              <b>"Enter consultation room"</b> &gt; <b>"Start"</b> consulting
              with your doctor"
            </li>
          </ol>
          <p>Thank you</p>
          <p>9jaclinic Team</p>
        </div>

        <div className={styled.guide}>
          <h3>QUICK DOCTOR'S GUIDE</h3>
          <p>
            The platform is very easy to use and similar to other common apps.
            Offer your professionalism on the go.
          </p>

          <h4>Steps</h4>
          <ol>
            <li>
              You will get an SMS ALERT once a patient pays to consult with you
              <div>
                <img src={sms} alt="sms" />
              </div>
            </li>
            <li>
              On your dashboard, Click &gt; <b>"Consultation order"</b> that has
              been paid for, Click &gt; <b>Consult</b>
            </li>
            <li>
              Check upper right corner of your screen, Click &gt;{" "}
              <b>"Enter consultation room"</b> &gt;{" "}
              <b>"Start consulting with your patient"</b>
            </li>
            <li>
              After consultation, go to your dashboard, Click &gt;{" "}
              <b>"Send prescription"</b> to issue prescriptions and health
              advice.
              <div>
                <img src={presbox} alt="presbox" />
              </div>
            </li>
            <li>
              Select and copy all your chats with patient from the chat box,
              from beginning till end. On your dashboard, Click &gt;{" "}
              <b>"Consultation order"</b> has just been consulted, Click &gt;{" "}
              <b>"Write Summary"</b>
            </li>
            <li>
              Go to your dashboard again, Click &gt; <b>"Consult"</b>{" "}
              <b>"Mark consultation as complete"</b>
            </li>
            <li>
              Go to your dashboard again, Click &gt; <b>"Details"</b> &gt;{" "}
              <b>"Mark consultation as complete"</b>
            </li>
            <li>
              Check account balance on your dashboard, Click &gt;{" "}
              <b>"Payments"</b> &gt; <b>"Records"</b>
              <div>
                <img src={record} alt="record" />
              </div>
            </li>
            <li>Repeat same cycle for subsequent patient consultations</li>
          </ol>

          <p>Thank you</p>
          <p>9jaclinic Team</p>
        </div>
      </div>
    </Layout>
  );
};

export default AppGuideScreen;
