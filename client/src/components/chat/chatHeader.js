import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { FaVideo } from "react-icons/fa";
import avatar from "../../img/avatar.svg";
import { Link } from "react-router-dom";
import { Tooltip as ReactTooltip } from "react-tooltip";

import styled from "./chatHeader.module.css";

const ChatHeader = (props) => {
  const image =
    props.patientInfo && props.chatWithDoctor.avatar
      ? props.chatWithDoctor.avatar
      : props.doctorInfo && props.chatWithPatient.avatar
      ? props.chatWithPatient.avatar
      : avatar;

  return (
    <React.Fragment>
      <div className={styled.container}>
        <Link to={props.patientInfo ? "/dashboard" : "/docdashboard"}>
          <FaArrowLeft className={styled.arrowLeft} />
        </Link>
        <div className={styled.spacer}> </div>
        <img src={image} alt="avatar" width="50px" height="50px" />
        <div className={styled.chatInfo}>
          <h5>
            {props.patientInfo
              ? `Dr ${props.chatWithDoctor.name}`
              : props.doctorInfo
              ? props.chatWithPatient.name
              : null}
          </h5>
        </div>
        <div className={styled.spacer}> </div>
        <ul className={styled.roomUsers}>
          {props.roomUsers &&
            props.roomUsers.map((user, i) => (
              <li key={user.id}>
                <span></span>
                {user.username}
              </li>
            ))}
        </ul>
        <button
          disabled
          to={
            props.patientInfo
              ? "/dashboard/videocall"
              : "/docdashboard/videocall"
          }
        >
          <FaVideo
            data-tip="video call"
            data-for="videoCall"
            className={styled.chatVideo}
          />
        </button>
      </div>
      <ReactTooltip id="videoCall" />
    </React.Fragment>
  );
};

export default ChatHeader;
