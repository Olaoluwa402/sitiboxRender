import React from "react";
// import { Button } from "@mui/material";

const Notifications = ({ answerCall, call, callAccepted }) => {
  return (
    <React.Fragment>
      {call.isReceivingCall && !callAccepted && (
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <h1>{call.name} is calling:</h1>
          <button onClick={answerCall}>Answer</button>
        </div>
      )}
    </React.Fragment>
  );
};

export default Notifications;
