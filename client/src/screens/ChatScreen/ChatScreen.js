import React, { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { sendSmsReminder } from "../../actions/patientActions";
import { WebSocketContext } from "../../WebSocket";
import { useNavigate } from "react-router-dom";

import ChatHeader from "../../components/chat/chatHeader";
import ChatFooter from "../../components/chat/chatFooter";
import ChatBody from "../../components/chat/chatBody";

import styled from "./ChatScreen.module.css";

const ChatScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [txtMsg, setTxtMsg] = useState("");
  const [show, setShow] = useState(true);
  const wlbs = useContext(WebSocketContext);
  const chat = useSelector((state) => state.chat);
  const {
    chatWithPatient,
    chatWithDoctor,
    activeChatUser,
    activeRoom,
    messages,
    roomUsers,
  } = chat;

  const doctorLogin = useSelector((state) => state.doctorLogin);
  const { doctorInfo } = doctorLogin;

  const patientLogin = useSelector((state) => state.patientLogin);
  const { patientInfo } = patientLogin;

  useEffect(() => {
    if ((!patientInfo && !doctorInfo) || (patientInfo && doctorInfo)) {
      navigate("/");
      toast.warning("Please login as either doctor or patient only!");
    }

    if (patientInfo && chatWithDoctor) {
      const { _id, name, email } = chatWithDoctor;
      getUniqueLoadMessages({ _id, name, email });
    }

    if (doctorInfo && chatWithPatient) {
      const { _id, name, email } = chatWithPatient;
      getUniqueLoadMessages({ _id, name, email });
    }
  }, [patientInfo, doctorInfo, navigate, chatWithPatient, chatWithDoctor]);

  const getUniqueLoadMessages = async ({ _id, name, email }) => {
    await dispatch(wlbs.UniqueUserChat(_id, name, email));
  };

  // active room messages
  const activeRoomMsgs = messages
    .filter(({ roomID }) => roomID == activeRoom)
    .map((data) => {
      return {
        ...data,
        sender: activeChatUser == data.senderEmail,
      };
    });

  const submitHandler = (e) => {
    e.preventDefault();

    let reciever;

    if (patientInfo) {
      reciever = chatWithDoctor.email;
    } else {
      reciever = chatWithPatient.email;
    }

    if (!txtMsg) return;

    new Promise((res) => {
      dispatch(wlbs.sendMsg({ txtMsg, reciever }));
      setTimeout(res, 1000);
    }).then(() => {
      setTxtMsg("");
    });
  };

  const getSummaryHandler = () => {
    const { _id } = chatWithPatient;
    navigate(`/docdashboard/chatsummaries/${_id}`);
  };

  const id = chatWithDoctor._id;
  const ratingHandler = () => {
    navigate(`/dashboard/doctor/${id}/rating`);
  };

  // send reminder logics
  const reminderHandler = () => {
    setShow(false);

    if (patientInfo) {
      const receiver = chatWithDoctor._id;

      dispatch(sendSmsReminder({ sender: "patient", receiver }));

      setTimeout(function () {
        setShow(true);
      }, 300000);
    }

    if (doctorInfo) {
      const receiver = chatWithPatient._id;

      dispatch(sendSmsReminder({ sender: "doctor", receiver }));

      setTimeout(function () {
        setShow(true);
      }, 300000);
    }
  };
  const showReminderBtn = show ? "showReminder" : "hideReminder";

  return (
    <React.Fragment>
      <div className={styled.outerContainer}>
        {patientInfo ? (
          <div className={styled.reminder}>
            <button className={styled.rating} onClick={ratingHandler}>
              Rate Dr {chatWithDoctor.name}
            </button>

            <button
              className={`${styled.rating} ${showReminderBtn}`}
              onClick={reminderHandler}
            >
              Send Reminder
            </button>
          </div>
        ) : null}
        {doctorInfo ? (
          <div className={styled.reminder}>
            <button className={styled.rating} onClick={getSummaryHandler}>
              Case File
            </button>

            <button
              className={`${styled.rating} ${showReminderBtn}`}
              onClick={reminderHandler}
            >
              Send Reminder
            </button>
          </div>
        ) : null}
        <div className={styled.container}>
          <ChatHeader
            patientInfo={patientInfo}
            doctorInfo={doctorInfo}
            chatWithDoctor={chatWithDoctor}
            chatWithPatient={chatWithPatient}
            roomUsers={roomUsers}
          />

          <ChatBody activeRoomMsgs={activeRoomMsgs} />

          <ChatFooter
            submitHandler={submitHandler}
            txtMsg={txtMsg}
            setTxtMsg={setTxtMsg}
            chatWithDoctor={chatWithDoctor}
            chatWithPatient={chatWithPatient}
            patientInfo={patientInfo}
            doctorInfo={doctorInfo}
          />
        </div>
      </div>
    </React.Fragment>
  );
};

export default ChatScreen;
