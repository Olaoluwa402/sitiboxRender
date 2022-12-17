import React from "react";
import { FaHospitalAlt } from "react-icons/fa";
import { FaFilePrescription } from "react-icons/fa";
import { MdTransferWithinAStation } from "react-icons/md";
import { FaFileSignature } from "react-icons/fa";
import { HeaderDivider } from "../../components/headerDivider";
import Layout from "../../components/Layout/Layout";

import styled from "./ServicesScreen.module.css";

const ServicesScreen = () => {
  return (
    <Layout>
      <div className={styled.container}>
        <section className={styled.header}>
          <h4 className={styled.headerSubTitle}>9JACLINIC</h4>
          <h1 className={styled.headerTitle}>Services</h1>
          <HeaderDivider />
          <p className={styled.headerText}>
            Sitibox Health® works with clients across the healthcare ecosystem,
            creating an efficient, easy, accessible and effective virtual-first
            experience at multiple screenpoints and delivering better outcomes
            for all
          </p>
        </section>

        <section className={styled.servicesWrapper}>
          <div className={styled.services}>
            <div className={styled.iconsContainer}>
              <FaHospitalAlt className={styled.icons} />
            </div>
            <div className={styled.service}>
              <h3>e Person virtual Care using the best technologies:</h3>
              <p>
                24/7 opportunity to access to low-cost, private, secure,
                efficient, high-quality online medical doctor consultations for
                a broad range of care concerns
              </p>
            </div>
          </div>
          <div className={styled.services}>
            <div className={styled.iconsContainer}>
              <FaFileSignature className={styled.icons} />
            </div>
            <div className={styled.service}>
              <h3>Online in-chat Case Files:</h3>
              <p>
                Cumulative summaries of previous online medical consultations of
                a patient. This is accessible to subsequent consulting doctors
                while in the online consulting room.
              </p>
            </div>
          </div>
          <div className={styled.services}>
            <div className={styled.iconsContainer}>
              <FaFilePrescription className={styled.icons} />
            </div>
            <div className={styled.service}>
              <h3>E Prescription Services</h3>
              <p>
                The Sitibox Health Electronic Prescription Service (EPS) sends
                electronic prescriptions from the consulting doctor to the
                patient’s dashboard. The EPS removes the need for paper
                prescriptions. The patient just downloads the prescription and
                sends to the nearest pharmacy.
              </p>
            </div>
          </div>
          <div className={styled.services}>
            <div className={styled.iconsContainer}>
              <MdTransferWithinAStation className={styled.icons} />
            </div>
            <div className={styled.service}>
              <h3>E Referral Services:</h3>
              <p>
                The Sitibox Health e-Referral Service provides an easy way for
                patients to get a summary letter for in-person consultation
                referral outside Sitibox Health. The patient only needs to
                download their referral and send to the hospital he/she is being
                referred to for in-person assessment
              </p>
            </div>
          </div>
          <div className={styled.services}>
            <div className={styled.iconsContainer}>
              <FaHospitalAlt className={styled.icons} />
            </div>
            <div className={styled.service}>
              <h3>Empowering healthier lives:</h3>
              <p>
                Through the integrative approach of all sections of our
                platform, we have been able to demonstrate the power of tools
                like Sitibox Health in nurturing and empowering healthier lives.
              </p>
            </div>
          </div>
        </section>

        <section>
          <p>
            Our use of modern technology and clinical expertise pool provide
            broad opportunities to access to a range of healthcare services;
            providing people with insights that motivate and accelerate better
            health choices; and nurturing clinical collaboration that leads to
            higher quality of care
          </p>
        </section>
      </div>
    </Layout>
  );
};

export default ServicesScreen;
