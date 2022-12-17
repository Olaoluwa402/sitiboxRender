import React, { useEffect, useRef, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import Peer from "simple-peer";
import { FaArrowLeft } from "react-icons/fa";
import { WebSocketContext } from "../../WebSocket";
import { useNavigate } from "react-router-dom";

// import { Typography, AppBar } from '@material-ui/core';
// import { makeStyles } from '@material-ui/core/styles';

import VideoPlayer from "../../components/VideoCallRelated/VideoPlayer";
import Sidebar from "../../components/VideoCallRelated/Sidebar";
import Notifications from "../../components/VideoCallRelated/Notifications";

// import styled from "./VideoCallScreen.module.css";

// const useStyles = makeStyles((theme) => ({
//   appBar: {
//     borderRadius: 15,
//     margin: '30px 100px',
//     display: 'flex',
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     width: '600px',
//     border: '2px solid black',

//     [theme.breakpoints.down('xs')]: {
//       width: '90%',
//     },
//   },
//   wrapper: {
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     width: '100%',
//   },

//    back: {
//     position: 'absolute',
//     top:'150px',
//     left:'50%'
//  }
// }));

const VideoCall = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const wlbs = useContext(WebSocketContext);
  // const classes = useStyles();

  const [myVideoCallID, setMyVideoCallID] = useState();

  const [call, setCall] = useState({});
  const [stream, setStream] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [idToCall, setIdToCall] = useState("");
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("");
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  const doctorLogin = useSelector((state) => state.doctorLogin);
  const { doctorInfo } = doctorLogin;

  const patientLogin = useSelector((state) => state.patientLogin);
  const { patientInfo } = patientLogin;

  const chat = useSelector((state) => state.chat);
  const { videoSocketId, activeRoom, userToCallSocketId } = chat;

  // store video call Id in state
  const callName = patientInfo
    ? patientInfo.clinicName
    : doctorInfo
    ? doctorInfo.name
    : null;

  useEffect(() => {
    dispatch(wlbs.initVideoCall({ activeRoom }));

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        myVideo.current.srcObject = stream;
      });

    if (videoSocketId) {
      setMyVideoCallID(videoSocketId);
    }

    if (userToCallSocketId) {
      setIdToCall(userToCallSocketId);
    }

    setName(callName);

    wlbs.socket.on("callUser", ({ from, name: callerName, signal }) => {
      setCall({ isReceivingCall: true, from, name: callerName, signal });
    });
  }, [dispatch, videoSocketId, userToCallSocketId]);

  const callUser = (id) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      wlbs.socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: videoSocketId,
        name: name,
      });
    });
    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });
    wlbs.socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      wlbs.socket.emit("answerCall", { signal: data, to: call.from });
    });
    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });

    peer.signal(call.signal);
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current.destroy();
  };

  const videoCallHandler = () => {
    const chatPath = patientInfo
      ? "/dashboard/chatroom"
      : doctorInfo
      ? "/docdashboard/chatroom"
      : "/";
    navigate(chatPath);
  };

  return (
    <React.Fragment>
      <button
        // className={classes.back}
        onClick={videoCallHandler}
      >
        <FaArrowLeft className="" /> Back to chatroom
      </button>
      <div className={`videoCallWrapper`}>
        {/* <AppBar className={classes.appBar} position="static" color="inherit">
		        <Typography variant="h2" align="center">Video Chat</Typography>
		      </AppBar> */}
        <VideoPlayer
          name={name}
          callAccepted={callAccepted}
          myVideo={myVideo}
          userVideo={userVideo}
          callEnded={callEnded}
          stream={stream}
          call={call}
        />
        <Sidebar
          myVideoCallID={myVideoCallID}
          callAccepted={callAccepted}
          name={name}
          setName={setName}
          callEnded={callEnded}
          leaveCall={leaveCall}
          callUser={callUser}
          idToCall={idToCall}
          setIdToCall={setIdToCall}
        >
          <Notifications
            answerCall={answerCall}
            callAccepted={callAccepted}
            call={call}
          />
        </Sidebar>
      </div>
    </React.Fragment>
  );
};

export default VideoCall;
