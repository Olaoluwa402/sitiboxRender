import axios from "axios";
import {
  DOCTOR_LOGIN_REQUEST,
  DOCTOR_LOGIN_SUCCESS,
  DOCTOR_LOGIN_FAIL,
  DOCTOR_LOGOUT,
  DOCTOR_REGISTER_REQUEST,
  DOCTOR_REGISTER_SUCCESS,
  DOCTOR_REGISTER_FAIL,
  DOCTOR_DETAILS_REQUEST,
  DOCTOR_DETAILS_SUCCESS,
  DOCTOR_DETAILS_FAIL,
  DOCTOR_PROFILE_REQUEST,
  DOCTOR_PROFILE_SUCCESS,
  DOCTOR_PROFILE_FAIL,
  DOCTOR_LIST_REQUEST,
  DOCTOR_LIST_SUCCESS,
  DOCTOR_LIST_FAIL,
  DOCTOR_LIST_RESET,
  DOCTOR_UPDATE_PROFILE_REQUEST,
  DOCTOR_UPDATE_PROFILE_SUCCESS,
  DOCTOR_UPDATE_PROFILE_FAIL,
  DOCTORPHONEVERIFY_SUCCESS,
  DOCTORPHONEVERIFY_FAIL,
  DOCTORPHONECODEVERIFY_REQUEST,
  DOCTORPHONECODEVERIFY_SUCCESS,
  DOCTORPHONECODEVERIFY_FAIL,
  NEWPRESCRIPTION_REQUEST,
  NEWPRESCRIPTION_SUCCESS,
  NEWPRESCRIPTION_FAIL,
  DOCTORPRESCRIPTION_LIST_REQUEST,
  DOCTORPRESCRIPTION_LIST_SUCCESS,
  DOCTORPRESCRIPTION_LIST_FAIL,
  UPDATEPRESCRIPTION_DETAIL_REQUEST,
  UPDATEPRESCRIPTION_DETAIL_SUCCESS,
  UPDATEPRESCRIPTION_DETAIL_FAIL,
  DOCTOR_PASSWORDRESET_REQUEST,
  DOCTOR_PASSWORDRESET_SUCCESS,
  DOCTOR_PASSWORDRESET_FAIL,
  DOCTOR_NEWPASSWORD_REQUEST,
  DOCTOR_NEWPASSWORD_SUCCESS,
  DOCTOR_NEWPASSWORD_FAIL,
  CREATECONSULTATION_SUMMARY_REQUEST,
  CREATECONSULTATION_SUMMARY_SUCCESS,
  CREATECONSULTATION_SUMMARY_FAIL,
  SUMMARY_LIST_REQUEST,
  SUMMARY_LIST_SUCCESS,
  SUMMARY_LIST_FAIL,
  SUMMARY_DETAIL_REQUEST,
  SUMMARY_DETAIL_SUCCESS,
  SUMMARY_DETAIL_FAIL,
  UPDATESUMMARY_DETAIL_REQUEST,
  UPDATESUMMARY_DETAIL_SUCCESS,
  UPDATESUMMARY_DETAIL_FAIL,
  SUMMARY_PERCHAT_REQUEST,
  SUMMARY_PERCHAT_SUCCESS,
  SUMMARY_PERCHAT_FAIL,
  CREATECONSULTATION_REFERRAL_REQUEST,
  CREATECONSULTATION_REFERRAL_SUCCESS,
  CREATECONSULTATION_REFERRAL_FAIL,
  REFERRAL_LIST_REQUEST,
  REFERRAL_LIST_SUCCESS,
  REFERRAL_LIST_FAIL,
  REFERRAL_DETAIL_REQUEST,
  REFERRAL_DETAIL_SUCCESS,
  REFERRAL_DETAIL_FAIL,
  UPDATEREFERRAL_DETAIL_REQUEST,
  UPDATEREFERRAL_DETAIL_SUCCESS,
  UPDATEREFERRAL_DETAIL_FAIL,
  DOCTOR_CONFIRM_REGISTER_REQUEST,
  DOCTOR_CONFIRM_REGISTER_SUCCESS,
  DOCTOR_CONFIRM_REGISTER_FAIL,
  RESENDMAIL_REQUEST,
  RESENDMAIL_SUCCESS,
  RESENDMAIL_FAIL,
  ADD_ACCT_REQUEST,
  ADD_ACCT_SUCCESS,
  ADD_ACCT_FAIL,
  GET_ACCTLIST_REQUEST,
  GET_ACCTLIST_SUCCESS,
  GET_ACCTLIST_FAIL,
  ACCTLIST_OPENACCESS_REQUEST,
  ACCTLIST_OPENACCESS_SUCCESS,
  ACCTLIST_OPENACCESS_FAIL,
  GET_ACCTDETAIL_REQUEST,
  GET_ACCTDETAIL_SUCCESS,
  GET_ACCTDETAIL_FAIL,
  UPDATE_ACCTDETAIL_REQUEST,
  UPDATE_ACCTDETAIL_SUCCESS,
  UPDATE_ACCTDETAIL_FAIL,
  DELETE_ACCT_REQUEST,
  DELETE_ACCT_SUCCESS,
  DELETE_ACCT_FAIL,
  CHANGE_PASSWORD_REQUEST,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD_FAIL,
  UPDATE_DOCUMENT_REQUEST,
  UPDATE_DOCUMENT_SUCCESS,
  UPDATE_DOCUMENT_FAIL,
} from "../constants/doctorConstants";
import { toast } from "react-toastify";
import { adminLogout2 } from "./adminActions";
import { logout2 } from "./patientActions";
import { CLEAR_PW_STATUS } from "../constants/regStepConstants";

//const baseUrl = "http://127.0.0.1:3005";
const baseUrl = "https://sbox-5v58.onrender.com";
export const loginDoctor = (email, password, wlbs) => async (dispatch) => {
  try {
    dispatch({
      type: DOCTOR_LOGIN_REQUEST,
    });

    
    const config = {
      headers: {
        "Content-Type": "Application/json",
        // "xsrf-token": token.csrfToken,
      },
      credentials: "include",
      mode: "cors",
    };

    const { data } = await axios.post(
      `${baseUrl}/api/doctors/login`,
      { email, password },
      config
    );

    if (data.emailIsVerified === true) {
      dispatch({
        type: DOCTOR_LOGIN_SUCCESS,
        payload: data,
      });

      localStorage.setItem("doctorInfo", JSON.stringify(data));
      toast(`Welcome back ${data.firstName}`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        type: "success",
      });

      // logout any other logins ie. admin or patient
      dispatch(adminLogout2());
      dispatch(logout2());
    } else {
      dispatch({ type: DOCTOR_LOGOUT });
      dispatch(doctorLogout());
      toast("Please check your email to complete your registration", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        type: "error",
      });
    }
  } catch (error) {
    dispatch({
      type: DOCTOR_LOGIN_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
    toast(
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message,
      {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        type: "error",
      }
    );
  }
};

export const verifyDocPhone = () => async (dispatch, getState) => {
  try {
    const {
      doctorLogin: { doctorInfo },
    } = getState();

    // get csrftoken
    // const { data: token } = await axios.get("/getcsrf", {
    //   headers: {
    //     "Content-Type": "Application/json",
    //   },
    //   credentials: "include",
    //   mode: "cors",
    // });

    const config = {
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${doctorInfo.token}`,
        // "xsrf-token": token.csrfToken,
      },
      credentials: "include",
      mode: "cors",
    };

    const phoneToVerify = doctorInfo.phone;

    const { data } = await axios.post(
      `${baseUrl}/api/doctors/docphoneverify`,
      { phoneToVerify },
      config
    );

    dispatch({
      type: DOCTORPHONEVERIFY_SUCCESS,
      payload: data,
    });

    localStorage.setItem("phoneVerifyInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: DOCTORPHONEVERIFY_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
    toast(
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message,
      {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        type: "error",
      }
    );
  }
};

export const verifyDocPhoneCode =
  ({ code, verifyId }) =>
  async (dispatch, getState) => {
    try {
      dispatch({
        type: DOCTORPHONECODEVERIFY_REQUEST,
      });

      const {
        doctorLogin: { doctorInfo },
      } = getState();

      // get csrftoken
      // const { data: token } = await axios.get("/getcsrf", {
      //   headers: {
      //     "Content-Type": "Application/json",
      //   },
      //   credentials: "include",
      //   mode: "cors",
      // });

      const config = {
        headers: {
          "Content-Type": "Application/json",
          Authorization: `Bearer ${doctorInfo.token}`,
          // "xsrf-token": token.csrfToken,
        },
        credentials: "include",
        mode: "cors",
      };

      const docId = doctorInfo._id;

      const { data } = await axios.post(
        `${baseUrl}/api/doctors/verifyphonecode`,
        { code, verifyId, docId },
        config
      );

      if (data) {
        dispatch({
          type: DOCTOR_PROFILE_SUCCESS,
          payload: data.updatedProfile,
        });

        dispatch({
          type: DOCTORPHONECODEVERIFY_SUCCESS,
          payload: data.result,
        });
      }
    } catch (error) {
      dispatch({
        type: DOCTORPHONECODEVERIFY_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
      toast(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          type: "error",
        }
      );
    }
  };

export const doctorLogout = (socket) => (dispatch) => {
  localStorage.removeItem("doctorInfo");
  localStorage.removeItem("chatWithPatient");
  localStorage.removeItem("chatWithDoctor");
  localStorage.removeItem("activeChatUser");
  localStorage.removeItem("activeRoom");
  localStorage.removeItem("userToCallSocketId");
  localStorage.removeItem("videoSocketId");
  localStorage.removeItem("resendmailDoc");
  dispatch({ type: DOCTOR_LOGOUT });
  dispatch({ type: DOCTOR_LIST_RESET });
  if (socket) {
    socket.disconnect();
  }
  toast(`Succefully logged out`, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    type: "success",
  });
};

export const doctorLogout2 = () => (dispatch) => {
  localStorage.removeItem("doctorInfo");
  localStorage.removeItem("chatWithPatient");
  localStorage.removeItem("chatWithDoctor");
  localStorage.removeItem("activeChatUser");
  localStorage.removeItem("activeRoom");
  localStorage.removeItem("userToCallSocketId");
  localStorage.removeItem("videoSocketId");
  localStorage.removeItem("resendmailDoc");
  dispatch({ type: DOCTOR_LOGOUT });
  dispatch({ type: DOCTOR_LIST_RESET });
};

export const registerDoctor = (myData) => async (dispatch) => {
  try {
    dispatch({
      type: DOCTOR_REGISTER_REQUEST,
    });

    // get csrftoken
    // const { data: token } = await axios.get("/getcsrf", {
    //   headers: {
    //     "Content-Type": "Application/json",
    //   },
    //   credentials: "include",
    //   mode: "cors",
    // });

    const config = {
      headers: {
        "Content-Type": "Application/json",
        // "xsrf-token": token.csrfToken,
      },
      credentials: "include",
      mode: "cors",
    };

    const { data } = await axios.post(`${baseUrl}/api/doctors`, myData, config);

    dispatch({
      type: DOCTOR_REGISTER_SUCCESS,
      payload: data,
    });

    localStorage.setItem("resendmailDoc", JSON.stringify(data));
    dispatch({ type: CLEAR_PW_STATUS });
    localStorage.removeItem("addData2");
  } catch (error) {
    dispatch({
      type: DOCTOR_REGISTER_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });

    toast(
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message,
      {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        type: "error",
      }
    );
  }
};

export const resendMail =
  ({ name, email }) =>
  async (dispatch) => {
    try {
      dispatch({
        type: RESENDMAIL_REQUEST,
      });

      // get csrftoken
      // const { data: token } = await axios.get("/getcsrf", {
      //   headers: {
      //     "Content-Type": "Application/json",
      //   },
      //   credentials: "include",
      //   mode: "cors",
      // });

      const config = {
        headers: {
          "Content-Type": "Application/json",
          // "xsrf-token": token.csrfToken,
        },
        credentials: "include",
        mode: "cors",
      };

      const { data } = await axios.post(
        `${baseUrl}/api/doctors/resendmail`,
        { name, email },
        config
      );

      dispatch({
        type: RESENDMAIL_SUCCESS,
        payload: data,
      });

      toast(`Mail sent`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        type: "success",
      });
    } catch (error) {
      dispatch({
        type: RESENDMAIL_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });

      toast(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          type: "error",
        }
      );
    }
  };

export const doctorRegistrationConfirmation =
  ({ emailToken }) =>
  async (dispatch) => {
    const originUrl = window.location.origin;

    try {
      dispatch({
        type: DOCTOR_CONFIRM_REGISTER_REQUEST,
      });

      // get csrftoken
      // const { data: csurfToken } = await axios.get("/getcsrf", {
      //   headers: {
      //     "Content-Type": "Application/json",
      //   },
      //   credentials: "include",
      //   mode: "cors",
      // });

      const config = {
        headers: {
          "Content-Type": "Application/json",
          // "xsrf-token": csurfToken.csrfToken,
        },
        credentials: "include",
        mode: "cors",
      };

      const { data } = await axios.post(
        `${originUrl}/api/doctors/email-verification`,
        { emailToken },
        config
      );

      dispatch({
        type: DOCTOR_CONFIRM_REGISTER_SUCCESS,
        payload: data,
      });

      dispatch({
        type: DOCTOR_LOGIN_SUCCESS,
        payload: data,
      });

      localStorage.setItem("doctorInfo", JSON.stringify(data));
    } catch (error) {
      dispatch({
        type: DOCTOR_CONFIRM_REGISTER_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });

      // toast(error.response && error.response.data.message ?
      //     error.response.data.message : error.message, {
      //     position: "top-center",
      //     autoClose: 5000,
      //     hideProgressBar: false,
      //     closeOnClick: true,
      //     pauseOnHover: true,
      //     draggable: true,
      //     type:'error'
      // })
    }
  };

export const getDoctorProfile = (profile) => async (dispatch, getState) => {
  try {
    dispatch({
      type: DOCTOR_PROFILE_REQUEST,
    });

    const {
      doctorLogin: { doctorInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${doctorInfo.token}`,
      },
    };

    const { data } = await axios.get(
      `${baseUrl}/api/doctors/${profile}`,
      config
    );

    dispatch({
      type: DOCTOR_PROFILE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: DOCTOR_PROFILE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
    toast(
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message,
      {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        type: "error",
      }
    );
  }
};

export const listDoctors = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: DOCTOR_LIST_REQUEST,
    });

    const { data } = await axios.get(`${baseUrl}/api/doctors`);

    const onlyVerifiedDoctor = data.filter(
      (doctor) => doctor.doctorIsVerified === true
    );
    dispatch({
      type: DOCTOR_LIST_SUCCESS,
      payload: onlyVerifiedDoctor,
    });
  } catch (error) {
    dispatch({
      type: DOCTOR_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });

    toast(
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message,
      {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        type: "error",
      }
    );
  }
};

export const listDoctorDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: DOCTOR_DETAILS_REQUEST });

    const { data } = await axios.get(`${baseUrl}/api/doctors/${id}`);

    dispatch({ type: DOCTOR_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: DOCTOR_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });

    toast(
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message,
      {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        type: "error",
      }
    );
  }
};

export const updateDoctorProfile =
  ({ myData }) =>
  async (dispatch, getState) => {
    try {
      dispatch({
        type: DOCTOR_UPDATE_PROFILE_REQUEST,
      });

      const {
        doctorLogin: { doctorInfo },
      } = getState();

      // get csrftoken
      // const { data: token } = await axios.get("/getcsrf", {
      //   headers: {
      //     "Content-Type": "Application/json",
      //   },
      //   credentials: "include",
      //   mode: "cors",
      // });

      const config = {
        headers: {
          "Content-Type": "Application/json",
          Authorization: `Bearer ${doctorInfo.token}`,
          // "xsrf-token": token.csrfToken,
        },
        credentials: "include",
        mode: "cors",
      };

      const { data } = await axios.put(
        `${baseUrl}/api/doctors/profile`,
        { myData },
        config
      );

      dispatch({
        type: DOCTOR_UPDATE_PROFILE_SUCCESS,
        payload: data,
      });

      dispatch({
        type: DOCTOR_LOGIN_SUCCESS,
        payload: data,
      });

      localStorage.setItem("doctorInfo", JSON.stringify(data));
    } catch (error) {
      dispatch({
        type: DOCTOR_UPDATE_PROFILE_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });

      toast(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          type: "error",
        }
      );
    }
  };

export const sendPrescription =
  ({ myData }) =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: NEWPRESCRIPTION_REQUEST });

      const {
        doctorLogin: { doctorInfo },
      } = getState();

      // get csrftoken
      // const { data: token } = await axios.get("/getcsrf", {
      //   headers: {
      //     "Content-Type": "Application/json",
      //   },
      //   credentials: "include",
      //   mode: "cors",
      // });

      const config = {
        headers: {
          "Content-Type": "Application/json",
          Authorization: `Bearer ${doctorInfo.token}`,
          // "xsrf-token": token.csrfToken,
        },
        credentials: "include",
        mode: "cors",
      };
      const presDetail = {
        name: myData.name,
        age: myData.age,
        prescription: myData.prescription,
        prescriptionNumber: myData.prescriptionNumber,
        doctorName: doctorInfo.firstName + " " + doctorInfo.lastName,
        doctorSpecialty: doctorInfo.specialty,
        patient: myData.patient,
        orderId: myData.orderId,
      };

      const { data } = await axios.post(
        `${baseUrl}/api/doctors/prescription`,
        { presDetail },
        config
      );

      dispatch({ type: NEWPRESCRIPTION_SUCCESS, payload: data });

      toast("Prescription Succefully sent!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        type: "success",
      });
    } catch (error) {
      dispatch({
        type: NEWPRESCRIPTION_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });

      toast(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          type: "error",
        }
      );
    }
  };

export const createConsultationSummary =
  ({ myData }) =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: CREATECONSULTATION_SUMMARY_REQUEST });

      const {
        doctorLogin: { doctorInfo },
      } = getState();

      // get csrftoken
      // const { data: token } = await axios.get("/getcsrf", {
      //   headers: {
      //     "Content-Type": "Application/json",
      //   },
      //   credentials: "include",
      //   mode: "cors",
      // });

      const config = {
        headers: {
          "Content-Type": "Application/json",
          Authorization: `Bearer ${doctorInfo.token}`,
          // "xsrf-token": token.csrfToken,
        },
        credentials: "include",
        mode: "cors",
      };
      const summaryDetail = {
        name: myData.name,
        age: myData.age,
        summary: myData.summary,
        doctorName: doctorInfo.firstName + " " + doctorInfo.lastName,
        doctorSpecialty: doctorInfo.specialty,
        patient: myData.patient,
        orderId: myData.orderId,
      };

      const { data } = await axios.post(
        `${baseUrl}/api/doctors/summary`,
        { summaryDetail },
        config
      );

      dispatch({ type: CREATECONSULTATION_SUMMARY_SUCCESS, payload: data });

      toast("Consultation summary Succefully created!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        type: "success",
      });
    } catch (error) {
      dispatch({
        type: CREATECONSULTATION_SUMMARY_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });

      toast(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          type: "error",
        }
      );
    }
  };

export const consultationSummaryList = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: SUMMARY_LIST_REQUEST,
    });

    const {
      doctorLogin: { doctorInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${doctorInfo.token}`,
      },
    };

    const { data } = await axios.get(
      `${baseUrl}/api/doctors/summaries`,
      config
    );

    dispatch({
      type: SUMMARY_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: SUMMARY_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });

    toast(
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message,
      {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        type: "error",
      }
    );
  }
};

export const getConsultationSummaryPerChat =
  ({ patientsummaryId }) =>
  async (dispatch, getState) => {
    try {
      dispatch({
        type: SUMMARY_PERCHAT_REQUEST,
      });

      const {
        doctorLogin: { doctorInfo },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "Application/json",
          Authorization: `Bearer ${doctorInfo.token}`,
        },
      };

      const { data } = await axios.get(
        `${baseUrl}/api/doctors/chatsummaries/${patientsummaryId}`,
        config
      );

      dispatch({
        type: SUMMARY_PERCHAT_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: SUMMARY_PERCHAT_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const getSummaryDetail =
  ({ summaryId }) =>
  async (dispatch, getState) => {
    try {
      dispatch({
        type: SUMMARY_DETAIL_REQUEST,
      });

      const config = {
        headers: {
          "Content-Type": "Application/json",
        },
      };

      const { data } = await axios.get(
        `${baseUrl}/api/doctors/summaries/${summaryId}`,
        config
      );

      dispatch({
        type: SUMMARY_DETAIL_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: SUMMARY_DETAIL_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });

      toast(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          type: "error",
        }
      );
    }
  };

export const updateSummaryDetailAction =
  ({ myData, summaryId }) =>
  async (dispatch, getState) => {
    try {
      dispatch({
        type: UPDATESUMMARY_DETAIL_REQUEST,
      });

      const {
        doctorLogin: { doctorInfo },
      } = getState();

      // get csrftoken
      // const { data: token } = await axios.get("/getcsrf", {
      //   headers: {
      //     "Content-Type": "Application/json",
      //   },
      //   credentials: "include",
      //   mode: "cors",
      // });

      const config = {
        headers: {
          "Content-Type": "Application/json",
          Authorization: `Bearer ${doctorInfo.token}`,
          // "xsrf-token": token.csrfToken,
        },
        credentials: "include",
        mode: "cors",
      };

      const { data } = await axios.put(
        `${baseUrl}/api/doctors/summaries/${summaryId}/edit`,
        { myData },
        config
      );

      dispatch({
        type: UPDATESUMMARY_DETAIL_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: UPDATESUMMARY_DETAIL_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });

      toast.warning(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  };

export const doctorPrescriptionList = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: DOCTORPRESCRIPTION_LIST_REQUEST,
    });

    const {
      doctorLogin: { doctorInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${doctorInfo.token}`,
      },
    };

    const { data } = await axios.get(
      `${baseUrl}/api/doctors/prescriptions`,
      config
    );

    dispatch({
      type: DOCTORPRESCRIPTION_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: DOCTORPRESCRIPTION_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const updatePrescriptionDetailAction =
  ({ myData, prescriptionId }) =>
  async (dispatch, getState) => {
    try {
      dispatch({
        type: UPDATEPRESCRIPTION_DETAIL_REQUEST,
      });

      const {
        doctorLogin: { doctorInfo },
      } = getState();

      // get csrftoken
      // const { data: token } = await axios.get("/getcsrf", {
      //   headers: {
      //     "Content-Type": "Application/json",
      //   },
      //   credentials: "include",
      //   mode: "cors",
      // });

      const config = {
        headers: {
          "Content-Type": "Application/json",
          Authorization: `Bearer ${doctorInfo.token}`,
          // "xsrf-token": token.csrfToken,
        },
        credentials: "include",
        mode: "cors",
      };

      const { data } = await axios.put(
        `${baseUrl}/api/doctors/prescriptions/${prescriptionId}/edit`,
        { myData },
        config
      );
      console.log(data);

      dispatch({
        type: UPDATEPRESCRIPTION_DETAIL_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: UPDATEPRESCRIPTION_DETAIL_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });

      toast.warning(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  };

export const doctorPasswordReset =
  ({ email }) =>
  async (dispatch, getState) => {
    try {
      dispatch({
        type: DOCTOR_PASSWORDRESET_REQUEST,
      });

      // get csrftoken
      // const { data: token } = await axios.get("/getcsrf", {
      //   headers: {
      //     "Content-Type": "Application/json",
      //   },
      //   credentials: "include",
      //   mode: "cors",
      // });

      const config = {
        headers: {
          "Content-Type": "Application/json",
          // "xsrf-token": token.csrfToken,
        },
        credentials: "include",
        mode: "cors",
      };
      const { data } = await axios.post(
        `${baseUrl}/api/doctors/passwordreset`,
        { email },
        config
      );

      dispatch({
        type: DOCTOR_PASSWORDRESET_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: DOCTOR_PASSWORDRESET_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });

      toast(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          type: "error",
        }
      );
    }
  };

export const doctorNewPassword =
  ({ password, token }) =>
  async (dispatch, getState) => {
    try {
      dispatch({
        type: DOCTOR_NEWPASSWORD_REQUEST,
      });

      // get csrftoken
      // const { data: csurfToken } = await axios.get("/getcsrf", {
      //   headers: {
      //     "Content-Type": "Application/json",
      //   },
      //   credentials: "include",
      //   mode: "cors",
      // });

      const config = {
        headers: {
          "Content-Type": "Application/json",
          // "xsrf-token": csurfToken.csrfToken,
        },
        credentials: "include",
        mode: "cors",
      };

      const { data } = await axios.post(
        `${baseUrl}/api/doctors/newpassword`,
        { password, token },
        config
      );

      dispatch({
        type: DOCTOR_NEWPASSWORD_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: DOCTOR_NEWPASSWORD_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });

      toast(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          type: "error",
        }
      );
    }
  };

export const createConsultationReferral =
  ({ myData }) =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: CREATECONSULTATION_REFERRAL_REQUEST });

      const {
        doctorLogin: { doctorInfo },
      } = getState();

      // get csrftoken
      // const { data: token } = await axios.get("/getcsrf", {
      //   headers: {
      //     "Content-Type": "Application/json",
      //   },
      //   credentials: "include",
      //   mode: "cors",
      // });

      const config = {
        headers: {
          "Content-Type": "Application/json",
          Authorization: `Bearer ${doctorInfo.token}`,
          // "xsrf-token": token.csrfToken,
        },
        credentials: "include",
        mode: "cors",
      };

      const referralDetail = {
        name: myData.name,
        age: myData.age,
        referral: myData.referral,
        doctorName: doctorInfo.firstName,
        doctorSpecialty: doctorInfo.specialty,
        patient: myData.patient,
        orderId: myData.orderId,
      };

      const { data } = await axios.post(
        `${baseUrl}/api/doctors/referral`,
        { referralDetail },
        config
      );

      dispatch({ type: CREATECONSULTATION_REFERRAL_SUCCESS, payload: data });

      toast("Consultation referral Succefully created!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        type: "success",
      });
    } catch (error) {
      dispatch({
        type: CREATECONSULTATION_REFERRAL_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });

      toast(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          type: "error",
        }
      );
    }
  };

export const doctorReferralList = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: REFERRAL_LIST_REQUEST,
    });

    const {
      doctorLogin: { doctorInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${doctorInfo.token}`,
      },
    };

    const { data } = await axios.get(
      `${baseUrl}/api/doctors/referrals`,
      config
    );

    dispatch({
      type: REFERRAL_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: REFERRAL_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });

    toast(
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message,
      {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        type: "error",
      }
    );
  }
};

export const getReferralDetail =
  ({ referralId }) =>
  async (dispatch, getState) => {
    try {
      dispatch({
        type: REFERRAL_DETAIL_REQUEST,
      });

      const config = {
        headers: {
          "Content-Type": "Application/json",
        },
      };

      const { data } = await axios.get(
        `${baseUrl}/api/doctors/referrals/${referralId}`,
        config
      );

      dispatch({
        type: REFERRAL_DETAIL_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: REFERRAL_DETAIL_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const updateReferralDetailAction =
  ({ myData, referralId }) =>
  async (dispatch, getState) => {
    try {
      dispatch({
        type: UPDATEREFERRAL_DETAIL_REQUEST,
      });

      const {
        doctorLogin: { doctorInfo },
      } = getState();

      // get csrftoken
      const { data: token } = await axios.get("/getcsrf", {
        headers: {
          "Content-Type": "Application/json",
        },
        credentials: "include",
        mode: "cors",
      });

      const config = {
        headers: {
          "Content-Type": "Application/json",
          Authorization: `Bearer ${doctorInfo.token}`,
          "xsrf-token": token.csrfToken,
        },
        credentials: "include",
        mode: "cors",
      };

      const { data } = await axios.put(
        `${baseUrl}/api/doctors/referrals/${referralId}/edit`,
        { myData },
        config
      );

      dispatch({
        type: UPDATEREFERRAL_DETAIL_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: UPDATEREFERRAL_DETAIL_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });

      toast.warning(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  };

export const addAccount = (myData) => async (dispatch, getState) => {
  try {
    dispatch({
      type: ADD_ACCT_REQUEST,
    });

    const {
      doctorLogin: { doctorInfo },
    } = getState();

    // get csrftoken
    // const { data: token } = await axios.get("/getcsrf", {
    //   headers: {
    //     "Content-Type": "Application/json",
    //   },
    //   credentials: "include",
    //   mode: "cors",
    // });

    const config = {
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${doctorInfo.token}`,
        // "xsrf-token": token.csrfToken,
      },
      credentials: "include",
      mode: "cors",
    };

    const { data: result } = await axios.post(
      `${baseUrl}/api/doctors/acct`,
      { myData },
      config
    );

    toast("Account Added!", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      type: "success",
    });

    dispatch({
      type: ADD_ACCT_SUCCESS,
      payload: result,
    });
  } catch (error) {
    dispatch({
      type: ADD_ACCT_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });

    toast(
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message,
      {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        type: "error",
      }
    );
  }
};

export const getAcctList = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: GET_ACCTLIST_REQUEST,
    });

    const {
      doctorLogin: { doctorInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${doctorInfo.token}`,
      },
    };

    const { data } = await axios.get(`${baseUrl}/api/doctors/acct`, config);

    dispatch({
      type: GET_ACCTLIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_ACCTLIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const acctListOpenAccess =
  ({ doctorId }) =>
  async (dispatch, getState) => {
    try {
      dispatch({
        type: ACCTLIST_OPENACCESS_REQUEST,
      });

      const config = {
        headers: {
          "Content-Type": "Application/json",
        },
      };

      const { data } = await axios.get(
        `${baseUrl}/api/doctors/${doctorId}/acct`,
        config
      );

      dispatch({
        type: ACCTLIST_OPENACCESS_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: ACCTLIST_OPENACCESS_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const getAcctDetail = (acctId) => async (dispatch, getState) => {
  try {
    dispatch({
      type: GET_ACCTDETAIL_REQUEST,
    });

    const config = {
      headers: {
        "Content-Type": "Application/json",
      },
    };

    const { data } = await axios.get(
      `${baseUrl}/api/doctors/acct/${acctId}`,
      config
    );

    dispatch({
      type: GET_ACCTDETAIL_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_ACCTDETAIL_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const updateAccount = (myData) => async (dispatch, getState) => {
  try {
    dispatch({
      type: UPDATE_ACCTDETAIL_REQUEST,
    });

    const {
      doctorLogin: { doctorInfo },
    } = getState();

    // get csrftoken
    const { data: token } = await axios.get("/getcsrf", {
      headers: {
        "Content-Type": "Application/json",
      },
      credentials: "include",
      mode: "cors",
    });

    const config = {
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${doctorInfo.token}`,
        "xsrf-token": token.csrfToken,
      },
      credentials: "include",
      mode: "cors",
    };

    const { data: result } = await axios.put(
      `${baseUrl}/api/doctors/acct`,
      { myData },
      config
    );

    toast("Account Updated!", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      type: "success",
    });

    dispatch({
      type: UPDATE_ACCTDETAIL_SUCCESS,
      payload: result,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_ACCTDETAIL_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });

    toast(
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message,
      {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        type: "error",
      }
    );
  }
};

export const deleteAcct = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: DELETE_ACCT_REQUEST,
    });

    const {
      doctorLogin: { doctorInfo },
    } = getState();

    // get csrftoken
    // const { data: token } = await axios.get("/getcsrf", {
    //   headers: {
    //     "Content-Type": "Application/json",
    //   },
    //   credentials: "include",
    //   mode: "cors",
    // });

    const config = {
      headers: {
        Authorization: `Bearer ${doctorInfo.token}`,
        // "xsrf-token": token.csrfToken,
      },
      credentials: "include",
      mode: "cors",
    };

    await axios.delete(`${baseUrl}/api/doctors/acct/${id}`, config);

    dispatch({
      type: DELETE_ACCT_SUCCESS,
    });

    toast(`Succefully Deleted`, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      type: "success",
    });
  } catch (error) {
    dispatch({
      type: DELETE_ACCT_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });

    toast(
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message,
      {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        type: "error",
      }
    );
  }
};

export const changePasswordAction =
  ({ myData }) =>
  async (dispatch, getState) => {
    try {
      dispatch({
        type: CHANGE_PASSWORD_REQUEST,
      });

      const {
        doctorLogin: { doctorInfo },
      } = getState();

      // get csrftoken
      // const { data: token } = await axios.get("/getcsrf", {
      //   headers: {
      //     "Content-Type": "Application/json",
      //   },
      //   credentials: "include",
      //   mode: "cors",
      // });

      const config = {
        headers: {
          "Content-Type": "Application/json",
          Authorization: `Bearer ${doctorInfo.token}`,
        },
        credentials: "include",
        mode: "cors",
      };

      const { data } = await axios.put(
        `${baseUrl}/api/doctors/pw`,
        { myData },
        config
      );

      dispatch({
        type: CHANGE_PASSWORD_SUCCESS,
        payload: data,
      });

      toast(`Succefully!`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        type: "success",
      });
    } catch (error) {
      dispatch({
        type: CHANGE_PASSWORD_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const updateDocumentAction =
  ({ myData }) =>
  async (dispatch, getState) => {
    try {
      dispatch({
        type: UPDATE_DOCUMENT_REQUEST,
      });

      const {
        doctorLogin: { doctorInfo },
      } = getState();

      // get csrftoken
      // const { data: token } = await axios.get("/getcsrf", {
      //   headers: {
      //     "Content-Type": "Application/json",
      //   },
      //   credentials: "include",
      //   mode: "cors",
      // });

      const config = {
        headers: {
          "Content-Type": "Application/json",
          Authorization: `Bearer ${doctorInfo.token}`,
        },
        credentials: "include",
        mode: "cors",
      };

      const { data } = await axios.put(
        `${baseUrl}/api/doctors/document`,
        { myData },
        config
      );

      dispatch({
        type: UPDATE_DOCUMENT_SUCCESS,
        payload: data,
      });

      dispatch({
        type: DOCTOR_LOGIN_SUCCESS,
        payload: data,
      });

      localStorage.setItem("doctorInfo", JSON.stringify(data));

      toast(`Update Successful!`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        type: "success",
      });
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;

      if (message === "Not authorized, token failed") {
        dispatch(doctorLogout());
      }
      dispatch({
        type: UPDATE_DOCUMENT_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });

      toast(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          type: "error",
        }
      );
    }
  };
