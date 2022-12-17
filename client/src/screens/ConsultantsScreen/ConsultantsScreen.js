import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../components/Layout/Layout";

import { Link } from "react-router-dom";
import Card from "../../components/Card/Card";
import Hero from "../../components/Hero/Hero";
import Banner from "../../components/Banner/Banner";
import { FaQuestionCircle } from "react-icons/fa";
import { listDoctors } from "../../actions/doctorActions";
import Message from "../../components/Message/Message";
import Spinner from "../../components/Spinner/Spinner";

import style from "./ConsultantsScreen.module.css";

const ConsultantsScreen = () => {
  const dispatch = useDispatch();

  const doctorList = useSelector((state) => state.doctorList);
  const { loading, error, doctors } = doctorList;

  useEffect(() => {
    dispatch(listDoctors());
  }, [dispatch]);

  return (
    <Layout>
      <Hero hero="consultantHero">
        <Banner
          title="Our Verified Doctors"
          subtitle="Professional and experienced!"
        >
          <Link to="/complaint" className="btnPrimary">
            <FaQuestionCircle /> Drop Your Complain
          </Link>
        </Banner>
      </Hero>
      {loading ? (
        <Spinner />
      ) : error ? (
        <Message message="dangerMessage">{error}</Message>
      ) : doctors && doctors.length > 0 ? (
        <section className={style.consultantProfiles}>
          {doctors.map((doctor) => (
            <div className={style.profile} key={doctor._id}>
              <Card key={doctor._id} doctor={doctor} />
            </div>
          ))}
        </section>
      ) : (
        <div style={{ marginTop: "2rem" }}>
          <h3>No doctor yet</h3>
        </div>
      )}
    </Layout>
  );
};

export default ConsultantsScreen;
