import axios from "axios";
import {
  PATIENT_LOGIN_REQUEST,
  PATIENT_LOGIN_SUCCESS,
  PATIENT_MAILNOT_VERIFIED,
  PATIENT_LOGIN_FAIL,
  PATIENT_LOGOUT,
  PATIENT_REGISTER_REQUEST,
  PATIENT_REGISTER_SUCCESS,
  PATIENT_REGISTER_FAIL,
  PATIENT_DETAILS_REQUEST,
  PATIENT_DETAILS_SUCCESS,
  PATIENT_DETAILS_FAIL,
  PATIENT_UPDATE_PROFILE_REQUEST,
  PATIENT_UPDATE_PROFILE_SUCCESS,
  PATIENT_UPDATE_PROFILE_FAIL,
  PATIENTPRESCRIPTION_LIST_REQUEST,
  PATIENTPRESCRIPTION_LIST_SUCCESS,
  PATIENTPRESCRIPTION_LIST_FAIL,
  PRESCRIPTION_DETAIL_REQUEST,
  PRESCRIPTION_DETAIL_SUCCESS,
  PRESCRIPTION_DETAIL_FAIL,
  PATIENTRECEIPT_LIST_REQUEST,
  PATIENTRECEIPT_LIST_SUCCESS,
  PATIENTRECEIPT_LIST_FAIL,
  RECEIPT_DETAIL_REQUEST,
  RECEIPT_DETAIL_SUCCESS,
  RECEIPT_DETAIL_FAIL,
  PATIENTPHONEVERIFY_SUCCESS,
  PATIENTPHONEVERIFY_FAIL,
  PATIENTPHONECODEVERIFY_REQUEST,
  PATIENTPHONECODEVERIFY_SUCCESS,
  PATIENTPHONECODEVERIFY_FAIL,
  PATIENT_LIST_RESET,
  PATIENT_PASSWORDRESET_REQUEST,
  PATIENT_PASSWORDRESET_SUCCESS,
  PATIENT_PASSWORDRESET_FAIL,
  PATIENT_NEWPASSWORD_REQUEST,
  PATIENT_NEWPASSWORD_SUCCESS,
  PATIENT_NEWPASSWORD_FAIL,
  PATIENT_CONFIRM_REGISTER_REQUEST,
  PATIENT_CONFIRM_REGISTER_SUCCESS,
  PATIENT_CONFIRM_REGISTER_FAIL,
  REFERRAL_LIST_REQUEST,
  REFERRAL_LIST_SUCCESS,
  REFERRAL_LIST_FAIL,
  GET_DOCTOR_BY_INVITEID_REQUEST,
  GET_DOCTOR_BY_INVITEID_SUCCESS,
  GET_DOCTOR_BY_INVITEID_FAIL,
  RESENDMAIL_REQUEST,
  RESENDMAIL_SUCCESS,
  RESENDMAIL_FAIL,
  SEND_REMINDER_REQUEST,
  SEND_REMINDER_SUCCESS,
  SEND_REMINDER_FAIL,
  CHANGE_PASSWORD_REQUEST,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD_FAIL,
  UPDATE_DOCUMENT_REQUEST,
  UPDATE_DOCUMENT_SUCCESS,
  UPDATE_DOCUMENT_FAIL,
} from "../constants/patientConstants";

import { toast } from "react-toastify";
import { doctorLogout2 } from "./doctorActions";
import { adminLogout2 } from "./adminActions";

//const baseUrl = "http://127.0.0.1:3005";
const baseUrl = "https://sbox-5v58.onrender.com";
export const loginPatient = (email, password, wlbs) => async (dispatch) => {
  try {
    dispatch({
      type: PATIENT_LOGIN_REQUEST,
    });

    // get csrftoken
    // const { data: token } = await axios.get("http://127.0.0.1:3005/getcsrf", {
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
      `${baseUrl}/api/patients/login`,
      { email, password },
      config
    );

    if (data.emailIsVerified === true) {
      dispatch({
        type: PATIENT_LOGIN_SUCCESS,
        payload: data,
      });

      localStorage.setItem("patientInfo", JSON.stringify(data));
      toast(`Welcome back ${data.clinicName}`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        type: "success",
      });

      // logout any other logins ie. admin or doctor
      dispatch(adminLogout2());
      dispatch(doctorLogout2());
    } else {
      dispatch({
        type: PATIENT_MAILNOT_VERIFIED,
        payload: data.email,
      });

      // dispatch({ type: PATIENT_LOGOUT });
      // dispatch(logout());
      // toast(`Please check your email to complete your registration`, {
      // position: "top-center",
      // autoClose: 5000,
      // hideProgressBar: false,
      // closeOnClick: true,
      // pauseOnHover: true,
      // draggable: true,
      // type:'error'
      // })
    }
  } catch (error) {
    dispatch({
      type: PATIENT_LOGIN_FAIL,
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

export const verifyPatientPhone = () => async (dispatch, getState) => {
  try {
    const {
      patientLogin: { patientInfo },
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
        Authorization: `Bearer ${patientInfo.token}`,
      },
      credentials: "include",
      mode: "cors",
    };

    const phoneToVerify = patientInfo.phone;

    const { data } = await axios.post(
      `${baseUrl}/api/patients/phoneverify`,
      { phoneToVerify },
      config
    );

    dispatch({
      type: PATIENTPHONEVERIFY_SUCCESS,
      payload: data,
    });

    localStorage.setItem("patientPhoneVerifyInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: PATIENTPHONEVERIFY_FAIL,
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

export const verifyPatientPhoneCode =
  ({ code, verifyId }) =>
  async (dispatch, getState) => {
    try {
      dispatch({
        type: PATIENTPHONECODEVERIFY_REQUEST,
      });

      const {
        patientLogin: { patientInfo },
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
          Authorization: `Bearer ${patientInfo.token}`,
        },
        credentials: "include",
        mode: "cors",
      };

      const patientId = patientInfo._id;

      const { data } = await axios.post(
        `${baseUrl}/api/patients/verifyphonecode`,
        { code, verifyId, patientId },
        config
      );

      if (data) {
        dispatch({
          type: PATIENT_DETAILS_SUCCESS,
          payload: data.updatedProfile,
        });

        dispatch({
          type: PATIENTPHONECODEVERIFY_SUCCESS,
          payload: data.result,
        });
      }
    } catch (error) {
      dispatch({
        type: PATIENTPHONECODEVERIFY_FAIL,
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

export const logout = (socket) => (dispatch) => {
  localStorage.removeItem("patientInfo");
  localStorage.removeItem("chatWithPatient");
  localStorage.removeItem("chatWithDoctor");
  localStorage.removeItem("activeChatUser");
  localStorage.removeItem("activeRoom");
  localStorage.removeItem("addComplaint");
  localStorage.removeItem("initiateItem");
  localStorage.removeItem("userToCallSocketId");
  localStorage.removeItem("videoSocketId");
  localStorage.removeItem("resendmailPat");
  dispatch({ type: PATIENT_LOGOUT });
  dispatch({ type: PATIENT_LIST_RESET });
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

// logout function for admin/doctor login

export const logout2 = () => (dispatch) => {
  localStorage.removeItem("patientInfo");
  localStorage.removeItem("chatWithPatient");
  localStorage.removeItem("chatWithDoctor");
  localStorage.removeItem("activeChatUser");
  localStorage.removeItem("activeRoom");
  localStorage.removeItem("addComplaint");
  localStorage.removeItem("initiateItem");
  localStorage.removeItem("userToCallSocketId");
  localStorage.removeItem("videoSocketId");
  localStorage.removeItem("resendmailPat");
  dispatch({ type: PATIENT_LOGOUT });
  dispatch({ type: PATIENT_LIST_RESET });
};

export const registerPatient = (regData) => async (dispatch) => {
  try {
    dispatch({
      type: PATIENT_REGISTER_REQUEST,
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
      `${baseUrl}/api/patients`,
      regData,
      config
    );

    dispatch({
      type: PATIENT_REGISTER_SUCCESS,
      payload: data,
    });

    localStorage.setItem("resendmailPat", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: PATIENT_REGISTER_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const resendMailPatient =
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
        },
        credentials: "include",
        mode: "cors",
      };

      const { data } = await axios.post(
        `${baseUrl}/api/patients/resendmail`,
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
    }
  };

export const patientRegistrationConfirmation =
  ({ emailToken }) =>
  async (dispatch) => {
    const originUrl = window.location.origin;
    try {
      dispatch({
        type: PATIENT_CONFIRM_REGISTER_REQUEST,
      });

      // get csrftoken
      // const { data: csrf } = await axios.get("/getcsrf", {
      //   headers: {
      //     "Content-Type": "Application/json",
      //   },
      //   credentials: "include",
      //   mode: "cors",
      // });

      const config = {
        headers: {
          "Content-Type": "Application/json",
        },
        credentials: "include",
        mode: "cors",
      };

      const { data } = await axios.post(
        `${originUrl}/api/patients/email-verification`,
        { emailToken },
        config
      );

      dispatch({
        type: PATIENT_CONFIRM_REGISTER_SUCCESS,
        payload: data,
      });

      dispatch({
        type: PATIENT_LOGIN_SUCCESS,
        payload: data,
      });

      localStorage.setItem("patientInfo", JSON.stringify(data));
    } catch (error) {
      dispatch({
        type: PATIENT_CONFIRM_REGISTER_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const getPatientDetails = (profile) => async (dispatch, getState) => {
  try {
    dispatch({
      type: PATIENT_DETAILS_REQUEST,
    });

    const {
      patientLogin: { patientInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${patientInfo.token}`,
      },
    };

    const { data } = await axios.get(
      `${baseUrl}/api/patients/${profile}`,
      config
    );

    dispatch({
      type: PATIENT_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PATIENT_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const updatePatientProfile =
  ({ myData }) =>
  async (dispatch, getState) => {
    try {
      dispatch({
        type: PATIENT_UPDATE_PROFILE_REQUEST,
      });

      const {
        patientLogin: { patientInfo },
      } = getState();

      // get csrftoken

      const config = {
        headers: {
          "Content-Type": "Application/json",
          Authorization: `Bearer ${patientInfo.token}`,
        },
        credentials: "include",
        mode: "cors",
      };

      const { data } = await axios.put(
        `${baseUrl}/api/patients/profile`,
        { myData },
        config
      );

      dispatch({
        type: PATIENT_UPDATE_PROFILE_SUCCESS,
        payload: data,
      });

      dispatch({
        type: PATIENT_LOGIN_SUCCESS,
        payload: data,
      });

      localStorage.setItem("patientInfo", JSON.stringify(data));
    } catch (error) {
      dispatch({
        type: PATIENT_UPDATE_PROFILE_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const patientPrescriptionList = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: PATIENTPRESCRIPTION_LIST_REQUEST,
    });

    const {
      patientLogin: { patientInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${patientInfo.token}`,
      },
    };

    const { data } = await axios.get(
      `${baseUrl}/api/patients/prescriptions`,
      config
    );
    console.log(data);

    dispatch({
      type: PATIENTPRESCRIPTION_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PATIENTPRESCRIPTION_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const patientReceiptList = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: PATIENTRECEIPT_LIST_REQUEST,
    });

    const {
      patientLogin: { patientInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${patientInfo.token}`,
      },
    };

    const { data } = await axios.get(
      `${baseUrl}/api/patients/receipts`,
      config
    );

    dispatch({
      type: PATIENTRECEIPT_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PATIENTRECEIPT_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const receiptDetail =
  ({ receiptId }) =>
  async (dispatch, getState) => {
    try {
      dispatch({
        type: RECEIPT_DETAIL_REQUEST,
      });

      const config = {
        headers: {
          "Content-Type": "Application/json",
        },
      };

      const { data } = await axios.get(
        `${baseUrl}/api/patients/receipts/${receiptId}/receipt`,
        config
      );

      dispatch({
        type: RECEIPT_DETAIL_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: RECEIPT_DETAIL_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const prescriptionDetail =
  ({ prescriptionId }) =>
  async (dispatch, getState) => {
    try {
      dispatch({
        type: PRESCRIPTION_DETAIL_REQUEST,
      });

      const config = {
        headers: {
          "Content-Type": "Application/json",
        },
      };

      const { data } = await axios.get(
        `${baseUrl}/api/patients/prescriptions/${prescriptionId}/prescription`,
        config
      );

      dispatch({
        type: PRESCRIPTION_DETAIL_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: PRESCRIPTION_DETAIL_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const passwordReset = (email) => async (dispatch, getState) => {
  try {
    dispatch({
      type: PATIENT_PASSWORDRESET_REQUEST,
    });

    // get csrftoken
    // const { data: csrf } = await axios.get("/getcsrf", {
    //   headers: {
    //     "Content-Type": "Application/json",
    //   },
    //   credentials: "include",
    //   mode: "cors",
    // });

    const config = {
      headers: {
        "Content-Type": "Application/json",
      },
      credentials: "include",
      mode: "cors",
    };

    const { data } = await axios.post(
      `${baseUrl}/api/patients/passwordreset`,
      { email },
      config
    );

    dispatch({
      type: PATIENT_PASSWORDRESET_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PATIENT_PASSWORDRESET_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const newPassword = (password, token) => async (dispatch, getState) => {
  try {
    dispatch({
      type: PATIENT_NEWPASSWORD_REQUEST,
    });

    // get csrftoken
    // const { data: csrf } = await axios.get("/getcsrf", {
    //   headers: {
    //     "Content-Type": "Application/json",
    //   },
    //   credentials: "include",
    //   mode: "cors",
    // });

    const config = {
      headers: {
        "Content-Type": "Application/json",
      },
      credentials: "include",
      mode: "cors",
    };

    const { data } = await axios.post(
      `${baseUrl}/api/patients/newpassword`,
      { password, token },
      config
    );

    dispatch({
      type: PATIENT_NEWPASSWORD_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PATIENT_NEWPASSWORD_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const patientReferralList = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: REFERRAL_LIST_REQUEST,
    });

    const {
      patientLogin: { patientInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${patientInfo.token}`,
      },
    };

    const { data } = await axios.get(
      `${baseUrl}/api/patients/referrals`,
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
  }
};

export const getDoctorByInviteId =
  ({ doctorInviteId }) =>
  async (dispatch, getState) => {
    try {
      dispatch({
        type: GET_DOCTOR_BY_INVITEID_REQUEST,
      });

      const config = {
        headers: {
          "Content-Type": "Application/json",
        },
      };

      const { data } = await axios.get(
        `${baseUrl}/api/doctors/${doctorInviteId}/doctor_invite`,
        config
      );

      dispatch({
        type: GET_DOCTOR_BY_INVITEID_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: GET_DOCTOR_BY_INVITEID_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const sendSmsReminder =
  ({ sender, receiver }) =>
  async (dispatch, getState) => {
    if (sender === "patient") {
      try {
        dispatch({
          type: SEND_REMINDER_REQUEST,
        });

        // get csrftoken

        const {
          patientLogin: { patientInfo },
        } = getState();

        const config = {
          headers: {
            "Content-Type": "Application/json",
            Authorization: `Bearer ${patientInfo.token}`,
          },
          credentials: "include",
          mode: "cors",
        };

        const { data } = await axios.post(
          `${baseUrl}/api/patients/reminder`,
          { sender, receiver },
          config
        );

        dispatch({
          type: SEND_REMINDER_SUCCESS,
          payload: data,
        });

        toast("Sent Succefully to your Doctor!", {
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
          type: SEND_REMINDER_FAIL,
          payload:
            error.response && error.response.data.message
              ? error.response.data.message
              : error.message,
        });
      }
    }

    if (sender === "doctor") {
      try {
        dispatch({
          type: SEND_REMINDER_REQUEST,
        });

        // get csrftoken

        const {
          doctorLogin: { doctorInfo },
        } = getState();

        const config = {
          headers: {
            "Content-Type": "Application/json",
            Authorization: `Bearer ${doctorInfo.token}`,
          },
          credentials: "include",
          mode: "cors",
        };

        const { data } = await axios.post(
          `${baseUrl}/api/doctors/reminder`,
          { sender, receiver },
          config
        );

        dispatch({
          type: SEND_REMINDER_SUCCESS,
          payload: data,
        });

        toast("Sent Succefully to your Patient!", {
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
          type: SEND_REMINDER_FAIL,
          payload:
            error.response && error.response.data.message
              ? error.response.data.message
              : error.message,
        });
      }
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
        patientLogin: { patientInfo },
      } = getState();

      // get csrftoken

      const config = {
        headers: {
          "Content-Type": "Application/json",
          Authorization: `Bearer ${patientInfo.token}`,
        },
        credentials: "include",
        mode: "cors",
      };

      const { data } = await axios.put(
        `${baseUrl}/api/patients/pw`,
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
        patientLogin: { patientInfo },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "Application/json",
          Authorization: `Bearer ${patientInfo.token}`,
        },
        credentials: "include",
        mode: "cors",
      };

      const { data } = await axios.put(
        `${baseUrl}/api/patients/document`,
        { myData },
        config
      );

      dispatch({
        type: UPDATE_DOCUMENT_SUCCESS,
        payload: data,
      });

      dispatch({
        type: PATIENT_LOGIN_SUCCESS,
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
        dispatch(logout());
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
