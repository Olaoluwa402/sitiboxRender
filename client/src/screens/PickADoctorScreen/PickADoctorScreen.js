import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Card from "../../components/Card/Card2";
import Hero from "../../components/Hero/Hero";
import Banner from "../../components/Banner/Banner";

import { getDoctorByInviteId } from "../../actions/patientActions";
import Message from "../../components/Message/Message";
import Spinner from "../../components/Spinner/Spinner";
import ConsultationSteps from "../../components/ConsultationSteps/ConsultationSteps";
import Layout from "../../components/Layout/Layout";
import styled from "./PickADoctorScreen.module.css";

const PickADoctor = () => {
  const dispatch = useDispatch();
  const [doctorInviteId, setDoctorInviteId] = useState("");

  const getDoctorInviteId = useSelector((state) => state.getDoctorInviteId);
  const {
    loading: loadingDoctorId,
    success: successDoctorId,
    error: errorDoctorId,
    doctor,
  } = getDoctorInviteId;

  useEffect(() => {
    // dispatch(listDoctors());
  }, []);

  const getDoctorByInviteIdHandler = (e) => {
    e.preventDefault();
    if (!doctorInviteId) return;
    if (doctorInviteId) {
      new Promise((res) => {
        dispatch(getDoctorByInviteId({ doctorInviteId }));
        setTimeout(res, 2000);
      }).then(() => {
        setDoctorInviteId("");
      });
    }
  };

  return (
    <Layout>
      <React.Fragment>
        <Hero hero="consultantHero">
          <Banner
            title="Pick a Doctor"
            subtitle="Consult with a professional and experienced doctor of choice"
          ></Banner>
        </Hero>
        <div className={styled.main_flex}>
          <div className={styled.formgroup}>
            <label htmlFor="doctorId"></label>
            <input
              type="text"
              placeholder="Enter Doctor's Ingress Code"
              value={doctorInviteId}
              onChange={(e) => setDoctorInviteId(e.target.value)}
            />
            {loadingDoctorId && <Spinner />}
            {errorDoctorId && (
              <Message message="dangerMessage">{errorDoctorId}</Message>
            )}
            {successDoctorId && (
              <Message message="defaultMessage">Successful!</Message>
            )}
            <button onClick={getDoctorByInviteIdHandler} className={styled.btn}>
              Get Doctor
            </button>

            <div>
              <h5 style={{ color: "green" }}>
                No Ingress Code? Use our Featured Doctor Code Instead
              </h5>
              <p>
                Featured Doctor :{" "}
                <span style={{ color: "var(--primaryColor)" }}>100001</span>
              </p>
            </div>
          </div>
          <div className={styled.boxRight}>
            {doctor ? (
              <React.Fragment>
                <ConsultationSteps step1 step2 />
                <section className={styled.docProfiles}>
                  <Card doctor={doctor} />
                </section>
              </React.Fragment>
            ) : null}
          </div>
        </div>
      </React.Fragment>
    </Layout>
  );
};

export default PickADoctor;
