import React, { useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import Router from "./Router";
import { WebSocketContext } from "./WebSocket";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const dispatch = useDispatch();
  const [SideDrawerOpen, setSideDrawerOpen] = useState(false);
  const wlbs = useContext(WebSocketContext);

  const doctorLogin = useSelector((state) => state.doctorLogin);
  const { doctorInfo } = doctorLogin;

  const patientLogin = useSelector((state) => state.patientLogin);
  const { patientInfo } = patientLogin;

  const strt = doctorInfo
    ? doctorInfo._id
    : patientInfo
    ? patientInfo._id
    : null;
  const name = doctorInfo
    ? doctorInfo.firstName
    : patientInfo
    ? patientInfo.clinicName
    : null;
  const queryParams = {
    userId: strt,
    username: name,
  };
  useEffect(() => {
    // chat msg
    if (wlbs && wlbs.socket) {
      dispatch(wlbs.handleDispatchMsg());
    }

    if ((doctorInfo || patientInfo) && wlbs.socket.connected === false) {
      wlbs.socket.auth = queryParams;
      wlbs.socket.connect();
    }

    //eslint-disable-next-line
  }, [
    dispatch,
    wlbs,
    wlbs.socket,
    doctorInfo,
    patientInfo,
    wlbs.socket.connected,
  ]);

  return (
    <React.Fragment>
      <ToastContainer
        position="top-right"
        autoClose={8000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <main>
        <Router />
      </main>
      {/* <Footer /> */}
    </React.Fragment>
  );
};

export default App;
