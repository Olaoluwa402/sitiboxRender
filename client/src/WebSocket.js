import React, { createContext } from "react";
import { io } from "socket.io-client";
import { useDispatch } from "react-redux";

import {
  CHATTINGWITH_PATIENT,
  CHATTINGWITH_DOCTOR,
  ACTIVE_ROOM,
  ACTIVE_USER,
  ADD_MESSAGE,
  INJECT_MESSAGE,
  LOAD_MESSAGES,
  CLEAR_ACTIVE_MSGS,
  ACTIVE_ROOM_MSGS,
  CHAT_UPLOAD_REQUEST,
  VIDEO_SOCKETID,
  USERTOCALL_SOCKETID,
  ADD_ROOMUSERS,
} from "./constants/chatConstants";
import { uuidv4 } from "./utils/uuid";
import axios from "axios";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import { toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

// extend dayjs plugins
dayjs.extend(utc);
dayjs.extend(timezone);

// create context
const WebSocketContext = createContext(null);

const url = "ws://127.0.0.1:3000";
// set socket as a variable
const socket = io("/", {
  autoConnect: false,
  forceNew: true,
  transports: ["websocket"],
});

const SocketProvider = ({ children }) => {
  // initiate dispatch
  const dispatch = useDispatch();

  // connect socket once logged in

  const doctorInfoFromStorage = localStorage.getItem("doctorInfo")
    ? JSON.parse(localStorage.getItem("doctorInfo"))
    : null;

  const patientInfoFromStorage = localStorage.getItem("adminInfo")
    ? JSON.parse(localStorage.getItem("adminInfo"))
    : null;

  const Info = doctorInfoFromStorage
    ? doctorInfoFromStorage._id
    : patientInfoFromStorage
    ? patientInfoFromStorage._id
    : null;
  const username = doctorInfoFromStorage
    ? doctorInfoFromStorage.firstName
    : patientInfoFromStorage
    ? patientInfoFromStorage.clinicName
    : null;

  if (Info && username) {
    const queryParams = { userId: Info._id, username: username.clinicName };
    socket.auth = queryParams;
    socket.connect();
  }

  // connect socket
  socket.once("connect", () => {
    console.log("client connected");
  });

  socket.on("disconnect", (reason) => {
    console.log("client disconnected");
    // if (Info) {
    //   toast(`connection lost`, {
    //     position: "top-center",
    //     autoClose: 5000,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     draggable: true,
    //     type: "warning",
    //   });
    // }
  });

  socket.on("connect_error", (err) => {
    console.log("connect_error", err);
    // toast("waiting for connection...", {
    //   position: "top-center",
    //   autoClose: 5000,
    //   hideProgressBar: false,
    //   closeOnClick: true,
    //   pauseOnHover: true,
    //   draggable: true,
    //   type: "warning",
    // });
  });

  // get users and room
  socket.on("roomUsers", ({ users }) => {
    // console.log(users);
    dispatch({ type: ADD_ROOMUSERS, payload: users });
  });

  socket.on("savedMessage", (message) => {
    console.log(message);
    // dispatch({type:ADD_ROOMUSERS, payload:users})
  });

  // listen to bot messages
  socket.on("defaultMessage", (message) => {
    const msg = `${message.name} - ${message.text}`;
    toast(msg, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      type: "dark",
    });
    // dispatch({type:BOT_MESSAGE, payload:message});
  });

  const loadMessages = () => async (dispatch, getState) => {
    const {
      patientLogin: { patientInfo },
    } = getState();

    const {
      doctorLogin: { doctorInfo },
    } = getState();

    const myEmail = patientInfo
      ? patientInfo.email
      : doctorInfo
      ? doctorInfo.email
      : null;

    if (myEmail) {
      socket.emit("myMsgs", { myEmail }, (data) => {
        // const myMsgs = data;
        const myMsgs = data.map((data) => {
          return {
            ...data,
            sender: myEmail == data.senderEmail,
          };
        });

        // console.log("myMsgs", myMsgs);
        dispatch({ type: LOAD_MESSAGES, payload: myMsgs });
      });
    }
  };

  const chatUsersDetail = (chatData) => async (dispatch, getState) => {
    const {
      patientLogin: { patientInfo },
    } = getState();

    const {
      doctorLogin: { doctorInfo },
    } = getState();

    const uniqueChat = JSON.parse(await localStorage.getItem("@unique_Chat"));
    const uniqueRoomChat = JSON.parse(
      await localStorage.getItem("@unique_RoomChat")
    );

    if (!uniqueChat) {
      localStorage.setItem("@unique_Chat", JSON.stringify([]));
    }

    if (!uniqueRoomChat) {
      localStorage.setItem("@unique_RoomChat", JSON.stringify([]));
    }

    const activeChatUser = patientInfo
      ? patientInfo.email
      : doctorInfo
      ? doctorInfo.email
      : null;

    // set active user
    dispatch({ type: ACTIVE_USER, payload: activeChatUser });

    localStorage.setItem("activeChatUser", JSON.stringify(activeChatUser));

    // emit getUser
    socket.emit("getUsers", chatData);

    // get user detail
    socket.on("usersDetails", (data) => {
      dispatch({ type: CHATTINGWITH_DOCTOR, payload: data.doctor });
      dispatch({ type: CHATTINGWITH_PATIENT, payload: data.patient });

      localStorage.setItem("chatWithPatient", JSON.stringify(data.patient));
      localStorage.setItem("chatWithDoctor", JSON.stringify(data.doctor));
    });

    dispatch(loadMessages());
  };

  const UniqueUserChat = (_id, name, email) => async (dispatch, getState) => {
    const {
      patientLogin: { patientInfo },
    } = getState();

    const {
      doctorLogin: { doctorInfo },
    } = getState();

    const senderEmail = patientInfo
      ? patientInfo.email
      : doctorInfo
      ? doctorInfo.email
      : null;

    const uniqueChatData = {
      senderEmail: senderEmail,
      recieverID: _id,
      recieverEmail: email,
      recieverName: name,
    };

    console.log("uniqueChatData", uniqueChatData);

    const uniqueChat = JSON.parse(await localStorage.getItem("@unique_Chat"));

    if (uniqueChat.length > 0) {
      const userData = uniqueChat.filter(
        ({ recieverEmail }) => recieverEmail === email
      );

      if (userData.length > 0) {
        const { recieverEmail, recieverID, recieverName } = userData[0];

        dispatch(
          onUniqueChat({
            senderEmail,
            recieverEmail,
            recieverID,
            recieverName,
          })
        );
      } else {
        dispatch(onUniqueChat({ ...uniqueChatData, senderEmail }));
        uniqueChat.push(uniqueChatData);
        localStorage.setItem("@unique_Chat", JSON.stringify(uniqueChat));
      }
    } else {
      dispatch(onUniqueChat({ ...uniqueChatData, senderEmail }));
      uniqueChat.push(uniqueChatData);
      localStorage.setItem("@unique_Chat", JSON.stringify(uniqueChat));
    }

    dispatch(loadMessages());
  };

  const onUniqueChat =
    ({ senderEmail, recieverEmail, recieverID }) =>
    async (dispatch, getState) => {
      const uniqueRoomChat = JSON.parse(
        await localStorage.getItem("@unique_RoomChat")
      );
      socket.emit(
        "startUniqueChat",
        { senderEmail, recieverEmail, recieverID },
        (err) => {}
      );

      socket.on("openChat", ({ recieverEmail, senderEmail, roomID }) => {
        const desktopRoom = {
          recieverEmail,
          senderEmail,
          roomID,
        };

        const desktopRoomExist = uniqueRoomChat.filter(
          ({ roomID: mRoomID }) => mRoomID === roomID
        );

        if (desktopRoomExist.length > 0) {
          socket.emit("joinTwoUsers", { roomID }, ({ roomID }) => {
            dispatch({ type: ACTIVE_ROOM, payload: roomID });
            localStorage.setItem("activeRoom", JSON.stringify(roomID));
          });
        } else {
          uniqueRoomChat.push(desktopRoom);
          localStorage.setItem(
            "@unique_RoomChat",
            JSON.stringify(uniqueRoomChat)
          );
          socket.emit("joinTwoUsers", { roomID }, ({ roomID }) => {
            dispatch({ type: ACTIVE_ROOM, payload: roomID });
            localStorage.setItem("activeRoom", JSON.stringify(roomID));
          });
        }
      });
    };

  const sendMsg =
    ({ txtMsg, reciever, chatData }) =>
    async (dispatch, getState) => {
      const { activeRoom, activeChatUser } = getState().chat;
      const date = new Date();

      const utc_Date = dayjs.utc(date, "z").tz("Africa/Lagos").format("h:mm A");
      // add 1hr to the timezone to account for the actual time 1hr reduction on saving to mongodb with new Date
      const utcDateString = dayjs
        .utc(date, "z")
        .add(1, "hour")
        .tz("Africa/Lagos")
        .format();
      const DateString = dayjs.utc(date, "z").tz("Africa/Lagos").format();

      if (txtMsg) {
        const composeMsg = {
          _id: uuidv4(),
          roomID: activeRoom,
          chatMsg: txtMsg,
          recieverEmail: reciever,
          senderEmail: activeChatUser,
          type: "text",
          time: utc_Date,
          createdAt: utcDateString,
          sender: true,
        };

        // console.log("composeMsg", composeMsg);

        dispatch({
          type: ADD_MESSAGE,
          payload: {
            _id: uuidv4(),
            roomID: activeRoom,
            chatMsg: txtMsg,
            recieverEmail: reciever,
            senderEmail: activeChatUser,
            type: "text",
            time: utc_Date,
            createdAt: DateString,
            sender: true,
          },
        });

        socket.emit("sendTouser", {
          roomID: activeRoom,
          recieverEmail: reciever,
          senderEmail: activeChatUser,
          composeMsg: composeMsg,
        });
      }

      if (chatData) {
        try {
          dispatch({
            type: CHAT_UPLOAD_REQUEST,
          });

          // get csrftoken
          const { data: csrf } = await axios.get("/getcsrf", {
            headers: {
              "Content-Type": "Application/json",
            },
            credentials: "include",
            mode: "cors",
          });

          const config = {
            headers: {
              "Content-Type": "Application/json",
              "xsrf-token": csrf.csrfToken,
            },
            credentials: "include",
            mode: "cors",
          };

          const { data } = await axios.post(
            "/api/chatuploads",
            chatData,
            config
          );

          // determine the file type
          let fileType;
          if (chatData.chatFile.search("application") === 5) {
            fileType = "raw";
          } else if (chatData.chatFile.search("image") === 5) {
            fileType = "image";
          } else {
            fileType = "video";
          }

          const composeMsg = {
            _id: uuidv4(),
            roomID: activeRoom,
            chatMsg: data.secureUrl,
            publicId: data.publicId,
            recieverEmail: chatData.reciever,
            senderEmail: activeChatUser,
            type: `${fileType}`,
            time: utc_Date,
            createdAt: utcDateString,
            sender: true,
          };

          dispatch({
            type: ADD_MESSAGE,
            payload: {
              _id: uuidv4(),
              roomID: activeRoom,
              chatMsg: data.secureUrl,
              publicId: data.publicId,
              recieverEmail: chatData.reciever,
              senderEmail: activeChatUser,
              type: `${fileType}`,
              time: utc_Date,
              createdAt: DateString,
              sender: true,
            },
          });

          socket.emit("sendTouser", {
            roomID: activeRoom,
            recieverEmail: chatData.reciever,
            senderEmail: activeChatUser,
            composeMsg: composeMsg,
          });
        } catch (error) {
          const errData =
            error.response && error.response.data.message
              ? error.response.data.message
              : error.message;
          toast(errData, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            type: "warning",
          });
        }
      }
    };

  // const formatAMPM = (date) => {
  //     let hours = date.getHours();
  //     let minutes = date.getMinutes();
  //     let ampm = hours >= 12 ? "PM" : "AM";
  //     hours = hours % 12;
  //     hours = hours ? hours : 12;
  //     minutes = minutes < 10 ? "0" + minutes : minutes;
  //     let strTime = hours + ":" + minutes + " " + ampm;
  //     return strTime;
  // };

  const handleDispatchMsg = () => async (dispatch, getState) => {
    socket.on("dispatchMsg", (data) => {
      dispatch(getDispatchMsg({ ...data }));
    });
  };

  const getDispatchMsg =
    ({ _id, roomID, senderEmail, recieverEmail, composeMsg: composedMsg }) =>
    async (dispatch, getState) => {
      const { activeChatUser } = getState().chat;

      const msg = {
        _id,
        ...composedMsg,
        sender: activeChatUser == senderEmail,
        roomID: roomID,
        senderEmail: senderEmail,
        recieverEmail: recieverEmail,
      };

      // console.log("msg", msg);
      dispatch({ type: INJECT_MESSAGE, payload: msg });
    };

  const loadRoomMsgs = () => async (dispatch, getState) => {
    const { activeRoom, activeChatUser, messages } = getState().chat;
    const activeRoomMsgs = messages
      .filter(({ roomID }) => roomID == activeRoom)
      .map((data) => {
        return {
          ...data,
          sender: activeChatUser == data.senderEmail,
        };
      });

    dispatch({ type: ACTIVE_ROOM_MSGS, payload: activeRoomMsgs });
  };

  const clearActiveMsgs = () => async (dispatch, getState) => {
    dispatch({ type: CLEAR_ACTIVE_MSGS });
  };

  // initiate video call
  const initVideoCall =
    ({ activeRoom }) =>
    async (dispatch, getState) => {
      console.log("hit initVideoCall");
      // store video call Id in state

      socket.emit("myVideoCallID");

      socket.on("myId", (socketId) => {
        dispatch({ type: VIDEO_SOCKETID, payload: socketId });

        localStorage.setItem("videoSocketId", JSON.stringify(socketId));
      });

      socket.emit("callUserID", { activeRoom });
      socket.on("userToCallSocketId", (socketId) => {
        dispatch({ type: USERTOCALL_SOCKETID, payload: socketId });

        localStorage.setItem("userToCallSocketId", JSON.stringify(socketId));
      });
    };

  const wlbs = {
    socket: socket,
    loadMessages,
    chatUsersDetail,
    clearActiveMsgs,
    initVideoCall,
    loadRoomMsgs,
    handleDispatchMsg,
    sendMsg,
    onUniqueChat,
    UniqueUserChat,
  };

  return (
    <React.Fragment>
      <WebSocketContext.Provider value={wlbs}>
        {children}
      </WebSocketContext.Provider>
    </React.Fragment>
  );
};

export { SocketProvider, WebSocketContext };
