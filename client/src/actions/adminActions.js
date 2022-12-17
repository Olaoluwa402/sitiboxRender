import axios from "axios";
import {
  ADMIN_LOGIN_REQUEST,
  ADMIN_LOGIN_SUCCESS,
  ADMIN_LOGIN_FAIL,
  ADMIN_LOGOUT,
  ALLRECEIPTS_REQUEST,
  ALLRECEIPTS_SUCCESS,
  ALLRECEIPTS_FAIL,
  ALLPRESCRIPTIONS_REQUEST,
  ALLPRESCRIPTIONS_SUCCESS,
  ALLPRESCRIPTIONS_FAIL,
  ALLPATIENTS_REQUEST,
  ALLPATIENTS_SUCCESS,
  ALLPATIENTS_FAIL,
  ALLDOCTORS_REQUEST,
  ALLDOCTORS_SUCCESS,
  ALLDOCTORS_FAIL,
  DOCTORADMIN_DETAILS_REQUEST,
  DOCTORADMIN_DETAILS_SUCCESS,
  DOCTORADMIN_DETAILS_FAIL,
  PATIENTADMIN_DETAILS_REQUEST,
  PATIENTADMIN_DETAILS_SUCCESS,
  PATIENTADMIN_DETAILS_FAIL,
  DOCTOR_DELETE_REQUEST,
  DOCTOR_DELETE_SUCCESS,
  DOCTOR_DELETE_FAIL,
  PATIENT_DELETE_REQUEST,
  PATIENT_DELETE_SUCCESS,
  PATIENT_DELETE_FAIL,
  DOCTOR_VERIFY_REQUEST,
  DOCTOR_VERIFY_SUCCESS,
  DOCTOR_VERIFY_FAIL,
  DOCTOR_REVIEWS_REQUEST,
  DOCTOR_REVIEWS_SUCCESS,
  DOCTOR_REVIEWS_FAIL,
  REVIEW_DELETE_REQUEST,
  REVIEW_DELETE_SUCCESS,
  REVIEW_DELETE_FAIL,
  ADMIN_APPROVE_REQUEST,
  ADMIN_APPROVE_SUCCESS,
  ADMIN_APPROVE_FAIL,
  GENERATE_PROMOCODE_REQUEST,
  GENERATE_PROMOCODE_SUCCESS,
  GENERATE_PROMOCODE_FAIL,
  ALLPROMOCODES_REQUEST,
  ALLPROMOCODES_SUCCESS,
  ALLPROMOCODES_FAIL,
  DELETE_PROMOCODE_REQUEST,
  DELETE_PROMOCODE_SUCCESS,
  DELETE_PROMOCODE_FAIL,
  SUMMARY_LIST_REQUEST,
  SUMMARY_LIST_SUCCESS,
  SUMMARY_LIST_FAIL,
  REFERRAL_LIST_REQUEST,
  REFERRAL_LIST_SUCCESS,
  REFERRAL_LIST_FAIL,
  MESSAGE_ADMIN_REQUEST,
  MESSAGE_ADMIN_SUCCESS,
  MESSAGE_ADMIN_FAIL,
  SEND_EMAIL_REQUEST,
  SEND_EMAIL_SUCCESS,
  SEND_EMAIL_FAIL,
  SEND_SMS_REQUEST,
  SEND_SMS_SUCCESS,
  SEND_SMS_FAIL,
  CLEAR_ERRORS,
} from "../constants/adminConstants";

import { toast } from "react-toastify";
import { doctorLogout2 } from "./doctorActions";
import { logout2 } from "./patientActions";

//const baseUrl = "http://127.0.0.1:3005";
const baseUrl = "https://sbox-5v58.onrender.com";

export const loginAdmin = (email, password) => async (dispatch) => {
  try {
    dispatch({
      type: ADMIN_LOGIN_REQUEST,
    });

    const config = {
      headers: {
        "Content-Type": "Application/json",
      },
      credentials: "include",
      mode: "cors",
    };

    const { data } = await axios.post(
      `${baseUrl}/api/admins/login`,
      { email, password },
      config
    );

    dispatch({
      type: ADMIN_LOGIN_SUCCESS,
      payload: data,
    });

    // logout any other logins ie. PATIENT or doctor
    dispatch(logout2());
    dispatch(doctorLogout2());

    localStorage.setItem("adminInfo", JSON.stringify(data));
    toast(`Welcome back Admin`, {
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
      type: ADMIN_LOGIN_FAIL,
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
        type: "danger",
      }
    );
  }
};

export const adminLogout = () => (dispatch) => {
  localStorage.removeItem("adminInfo");
  dispatch({ type: ADMIN_LOGOUT });
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

// logout function for patient/doctor login use
export const adminLogout2 = () => (dispatch) => {
  localStorage.removeItem("adminInfo");
  dispatch({ type: ADMIN_LOGOUT });
};

export const allReceiptsList = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: ALLRECEIPTS_REQUEST,
    });

    const {
      adminLogin: { adminInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${adminInfo.token}`,
      },
    };

    const { data } = await axios.get(`${baseUrl}/api/admins/receipts`, config);

    dispatch({
      type: ALLRECEIPTS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ALLRECEIPTS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const allPrescriptionsList = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: ALLPRESCRIPTIONS_REQUEST,
    });

    const {
      adminLogin: { adminInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${adminInfo.token}`,
      },
    };

    const { data } = await axios.get(
      `${baseUrl}/api/admins/prescriptions`,
      config
    );

    dispatch({
      type: ALLPRESCRIPTIONS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ALLPRESCRIPTIONS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getPatientsList = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: ALLPATIENTS_REQUEST,
    });

    const {
      adminLogin: { adminInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${adminInfo.token}`,
      },
    };

    const { data } = await axios.get(`${baseUrl}/api/admins/patients`, config);

    dispatch({
      type: ALLPATIENTS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ALLPATIENTS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getDoctorsList = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: ALLDOCTORS_REQUEST,
    });

    const {
      adminLogin: { adminInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${adminInfo.token}`,
      },
    };

    const { data } = await axios.get(`${baseUrl}/api/admins/doctors`, config);

    dispatch({
      type: ALLDOCTORS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ALLDOCTORS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const doctorAdminDetail =
  ({ doctorId }) =>
  async (dispatch, getState) => {
    try {
      dispatch({
        type: DOCTORADMIN_DETAILS_REQUEST,
      });

      const {
        adminLogin: { adminInfo },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "Application/json",
          Authorization: `Bearer ${adminInfo.token}`,
        },
      };

      const { data } = await axios.get(
        `${baseUrl}/api/admins/doctors/${doctorId}`,
        config
      );

      dispatch({
        type: DOCTORADMIN_DETAILS_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: DOCTORADMIN_DETAILS_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const patientAdminDetail =
  ({ patientId }) =>
  async (dispatch, getState) => {
    try {
      dispatch({
        type: PATIENTADMIN_DETAILS_REQUEST,
      });

      const {
        adminLogin: { adminInfo },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "Application/json",
          Authorization: `Bearer ${adminInfo.token}`,
        },
      };

      const { data } = await axios.get(
        `${baseUrl}/api/admins/patients/${patientId}`,
        config
      );

      dispatch({
        type: PATIENTADMIN_DETAILS_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: PATIENTADMIN_DETAILS_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const adminDeleteDoctor = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: DOCTOR_DELETE_REQUEST,
    });

    const {
      adminLogin: { adminInfo },
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
        Authorization: `Bearer ${adminInfo.token}`,
      },
      credentials: "include",
      mode: "cors",
    };

    await axios.delete(`${baseUrl}/api/admins/doctors/${id}`, config);

    dispatch({
      type: DOCTOR_DELETE_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: DOCTOR_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const adminDeletePatient = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: PATIENT_DELETE_REQUEST,
    });

    const {
      adminLogin: { adminInfo },
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
        Authorization: `Bearer ${adminInfo.token}`,
      },
      credentials: "include",
      mode: "cors",
    };

    await axios.delete(`${baseUrl}/api/admins/patients/${id}`, config);

    dispatch({
      type: PATIENT_DELETE_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: PATIENT_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const doctorVerified = (doctor) => async (dispatch, getState) => {
  try {
    dispatch({
      type: DOCTOR_VERIFY_REQUEST,
    });

    const {
      adminLogin: { adminInfo },
    } = getState();

    // get csrftoken

    const config = {
      headers: {
        Authorization: `Bearer ${adminInfo.token}`,
      },
      credentials: "include",
      mode: "cors",
    };

    const { data } = await axios.put(
      `${baseUrl}/api/admins/doctors/${doctor._id}/verified`,
      {},
      config
    );

    dispatch({
      type: DOCTOR_VERIFY_SUCCESS,
      payload: data,
    });
    toast(`Verification Succefully`, {
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
      dispatch(adminLogout());
    }
    dispatch({
      type: DOCTOR_VERIFY_FAIL,
      payload: message,
    });
  }
};

export const getReviewList =
  ({ doctorId }) =>
  async (dispatch, getState) => {
    try {
      dispatch({
        type: DOCTOR_REVIEWS_REQUEST,
      });

      const {
        adminLogin: { adminInfo },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "Application/json",
          Authorization: `Bearer ${adminInfo.token}`,
        },
      };

      const { data } = await axios.get(
        `${baseUrl}/api/admins/doctors/${doctorId}/reviews`,
        config
      );

      dispatch({
        type: DOCTOR_REVIEWS_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: DOCTOR_REVIEWS_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const adminDeleteReview = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: REVIEW_DELETE_REQUEST,
    });

    const {
      adminLogin: { adminInfo },
    } = getState();

    // get csrftoken

    const config = {
      headers: {
        Authorization: `Bearer ${adminInfo.token}`,
      },
      credentials: "include",
      mode: "cors",
    };

    await axios.delete(`${baseUrl}/api/admins/reviews/${id}`, config);

    dispatch({
      type: REVIEW_DELETE_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: REVIEW_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const adminApproveReview = (review) => async (dispatch, getState) => {
  try {
    dispatch({
      type: ADMIN_APPROVE_REQUEST,
    });

    const {
      adminLogin: { adminInfo },
    } = getState();

    // get csrftoken

    const config = {
      headers: {
        Authorization: `Bearer ${adminInfo.token}`,
      },
      credentials: "include",
      mode: "cors",
    };

    const { data } = await axios.put(
      `${baseUrl}/api/admins/reviews/${review._id}/approve`,
      {},
      config
    );

    dispatch({
      type: ADMIN_APPROVE_SUCCESS,
      payload: data,
    });

    toast.success("Verification Succefully!");
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === "Not authorized, token failed") {
      dispatch(adminLogout());
    }
    dispatch({
      type: ADMIN_APPROVE_FAIL,
      payload: message,
    });
  }
};

export const generatePromoCode =
  ({ uniqueCode }) =>
  async (dispatch, getState) => {
    try {
      dispatch({
        type: GENERATE_PROMOCODE_REQUEST,
      });

      const {
        adminLogin: { adminInfo },
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
          Authorization: `Bearer ${adminInfo.token}`,
        },
        credentials: "include",
        mode: "cors",
      };

      const { data } = await axios.post(
        `${baseUrl}/api/admins/genpromocode`,
        { uniqueCode },
        config
      );

      dispatch({
        type: GENERATE_PROMOCODE_SUCCESS,
        payload: data,
      });

      toast.success(`Code succefully generated`);
    } catch (error) {
      dispatch({
        type: GENERATE_PROMOCODE_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const getPromoCodes = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: ALLPROMOCODES_REQUEST,
    });

    const {
      adminLogin: { adminInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${adminInfo.token}`,
      },
    };

    const { data } = await axios.get(
      `${baseUrl}/api/admins/allpromocode`,
      config
    );

    dispatch({
      type: ALLPROMOCODES_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ALLPROMOCODES_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const deletePromoCode = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: DELETE_PROMOCODE_REQUEST,
    });

    const {
      adminLogin: { adminInfo },
    } = getState();

    // get csrftoken

    const config = {
      headers: {
        Authorization: `Bearer ${adminInfo.token}`,
      },
      credentials: "include",
      mode: "cors",
    };

    await axios.delete(`${baseUrl}/api/admins/allpromocode/${id}`, config);

    dispatch({
      type: DELETE_PROMOCODE_SUCCESS,
    });

    toast.success(`Succefully Deleted`);
  } catch (error) {
    dispatch({
      type: DELETE_PROMOCODE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const consultationSummaryList = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: SUMMARY_LIST_REQUEST,
    });

    const {
      adminLogin: { adminInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${adminInfo.token}`,
      },
    };

    const { data } = await axios.get(`${baseUrl}/api/admins/summaries`, config);

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
  }
};

export const allReferralList = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: REFERRAL_LIST_REQUEST,
    });

    const {
      adminLogin: { adminInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${adminInfo.token}`,
      },
    };

    const { data } = await axios.get(`${baseUrl}/api/admins/referrals`, config);

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

export const sendContactPageMail =
  ({ mail }) =>
  async (dispatch, getState) => {
    try {
      dispatch({
        type: MESSAGE_ADMIN_REQUEST,
      });

      // get csrftoken

      const config = {
        headers: {
          "Content-Type": "Application/json",
        },
        credentials: "include",
        mode: "cors",
      };

      const { data } = await axios.post(
        `${baseUrl}/api/admins/contact-mail`,
        { mail },
        config
      );

      dispatch({
        type: MESSAGE_ADMIN_SUCCESS,
        payload: data,
      });

      toast(`Mail sent. Thank you!`);
    } catch (error) {
      dispatch({
        type: MESSAGE_ADMIN_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const sendMailToAllAction =
  (dataOption) => async (dispatch, getState) => {
    const originUrl = window.location.origin;
    try {
      dispatch({
        type: SEND_EMAIL_REQUEST,
      });

      const {
        adminLogin: { adminInfo },
      } = getState();

      // get csrftoken
      // const { data: token } = await axios.get(`${originUrl}/getcsrf`, {
      //   headers: {
      //     "Content-Type": "Application/json",
      //   },
      //   credentials: "include",
      //   mode: "cors",
      // });

      const config = {
        headers: {
          "Content-Type": "Application/json",
          Authorization: `Bearer ${adminInfo.token}`,
          // "xsrf-token": token.csrfToken,
        },
        credentials: "include",
        mode: "cors",
      };

      const { data } = await axios.post(
        `${originUrl}/api/admins/sendmailtoall`,
        { dataOption },
        config
      );

      dispatch({
        type: SEND_EMAIL_SUCCESS,
        payload: data,
      });

      toast.success(`Mail sent successfully. Thank you!`);
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;

      if (message === "Not authorized, token failed") {
        dispatch(adminLogout());
      }
      dispatch({
        type: SEND_EMAIL_FAIL,
        payload: message,
      });

      toast.error(message);
    }
  };

export const sendSmsToAllAction =
  (dataOption) => async (dispatch, getState) => {
    const originUrl = window.location.origin;
    try {
      dispatch({
        type: SEND_SMS_REQUEST,
      });

      const {
        adminLogin: { adminInfo },
      } = getState();

      // get csrftoken

      const config = {
        headers: {
          "Content-Type": "Application/json",
          Authorization: `Bearer ${adminInfo.token}`,
        },
        credentials: "include",
        mode: "cors",
      };

      const { data } = await axios.post(
        `${baseUrl}/api/admins/sendsmstoall`,
        { dataOption },
        config
      );

      dispatch({
        type: SEND_SMS_SUCCESS,
        payload: data,
      });

      toast.success(`Mail sent successfully. Thank you!`);
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;

      if (message === "Not authorized, token failed") {
        dispatch(adminLogout());
      }
      dispatch({
        type: SEND_SMS_FAIL,
        payload: message,
      });

      toast.error(message);
    }
  };

// Clear Errors
export const clearErrors = () => async (dispatch) => {
  dispatch({
    type: CLEAR_ERRORS,
  });
};
