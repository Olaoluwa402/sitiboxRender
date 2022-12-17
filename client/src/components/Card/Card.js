import React from "react";
import { MdVerifiedUser } from "react-icons/md";
import style from "./Card.module.css";
import { Link } from "react-router-dom";

const Card = ({ doctor }) => {
  const truncateText = (str) => {
    if (str.length > 120) {
      return str.substring(0, 120) + "...";
    } else {
      return str.substring(0, 120);
    }
  };

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
        <h3>
          Dr {doctor.firstName} {doctor.lastName}
        </h3>
        <h4>{doctor.specialty}</h4>
        <p>{doctor.biodata ? `${truncateText(doctor.biodata)}` : null}</p>
        <Link to={`/pubdetail/${doctor._id}`}>
          <button className={style.cardBtn}>Visit Profile</button>
        </Link>
      </div>
    </div>
  );
};

export default Card;
