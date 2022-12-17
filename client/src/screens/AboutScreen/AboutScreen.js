import React from "react";
// import Paper from "@material-ui/core/Paper";
import image from "../../img/doctors2.jpg";
import Layout from "../../components/Layout/Layout";

import styled from "./AboutScreen.module.css";

const AboutScreen = () => {
  return (
    <Layout>
      <div className={styled.container}>
        {/* <Paper> */}
        <div className={styled.box}>
          <div className={styled.boxLeft}>
            <img src={image} alt="about" />
          </div>
          <div className={styled.boxRight}>
            <h1>About Us</h1>
            <hr />

            <h4>Who we are?</h4>
            <p>
              9jaclinic®, the developers of Sitibox Health App®, are a fast
              rising star in the world of Healthtech. We provide you a secure
              and private channel through our various technologies, which in
              turn links you up medical expertise you can trust.
            </p>

            <h4>Who we are?</h4>
            <p>
              Nurturing health and wellness through virtual care. <br />
              At the peak of the COVID-19 pandemic of the year 2020, when the
              idea of Sitibox Health® was first conceived by our founder, Dr.
              Olanipekun Babatunde John, it was thought out as a novel idea that
              could bring quality and affordable virtual healthcare to the
              people of all ages and background around the world. Today, we are
              delivering on that novel idea by providing an efficient and
              affordable teleconsult service through the Sitibox Health App®.
            </p>

            <h4>Our Vision</h4>

            <p>
              Virtual care into the future. <br />
              Our vision is to make virtual medical care a very important step
              on any healthcare journey. We are creating one of the best
              platforms that provide a seamless teleconsult service for patients
              all over the world.
            </p>
          </div>
        </div>
        {/* </Paper> */}
      </div>
    </Layout>
  );
};

export default AboutScreen;
