import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { MdVerifiedUser } from "react-icons/md";

import style from "./Card2.module.css";

const Card2 = ({ doctor }) => {
  const patientLogin = useSelector((state) => state.patientLogin);
  const { patientInfo } = patientLogin;

  return (
    <div className={style.card}>
      <div className={style.upperContainer}>
        <div className={style.imageContainer}>
          <img
            src={doctor.image}
            className={style.cardImg}
            width="100px"
            height="100px"
            alt="profile"
          />
          <MdVerifiedUser className={style.verify} />
        </div>
      </div>
      <div className={style.lowerContainer}>
        <h5 style={{ textTransform: "capitalize" }}>
          Dr {doctor.firstName} {doctor.lastName}
        </h5>
        <h6 style={{ textTransform: "capitalize" }}>{doctor.specialty}</h6>
        <h6 style={{ textTransform: "capitalize", color: "#656565" }}>
          {doctor.gender}
        </h6>
        <h6>{doctor.rating > 0 ? `Rating ${" "} ${doctor.rating}` : null}</h6>
        <p>
          {`${doctor.biodata.substring(0, 80)}`}{" "}
          <Link to={`/pubdetail/${doctor.doctorId}`}> {`Read more >>`}</Link>
        </p>
        {patientInfo ? (
          <Link to={`/consultation/${doctor.doctorId}`}>
            <button className={style.cardBtn}>Select Doctor</button>
          </Link>
        ) : (
          <Link to={`/login?redirect=pickdoctor`}>
            <button className={style.cardBtn}>Login To Continue</button>
          </Link>
        )}
        {/* <Link to={`/register?redirect=pickdoctor`}>
          <button className={style.cardBtn}>Register</button>
        </Link> */}
      </div>
    </div>
  );
};

export default Card2;
