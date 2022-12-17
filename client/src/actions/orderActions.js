import axios from "axios";
import {
  CONSULTATIONORDER_CREATE_REQUEST,
  CONSULTATIONORDER_CREATE_SUCCESS,
  CONSULTATIONORDER_CREATE_FAIL,
  CONSULTATIONORDER_DETAILS_FAIL,
  CONSULTATIONORDER_DETAILS_SUCCESS,
  CONSULTATIONORDER_DETAILS_REQUEST,
  CONSULTATIONORDER_PAY_REQUEST,
  CONSULTATIONORDER_PAY_SUCCESS,
  CONSULTATIONORDER_PAY_FAIL,
  CONSULTATIONORDER_LIST_MY_REQUEST,
  CONSULTATIONORDER_LIST_MY_SUCCESS,
  CONSULTATIONORDER_LIST_MY_FAIL,
  CONSULTATIONORDER_LIST_FAIL,
  CONSULTATIONORDER_LIST_SUCCESS,
  CONSULTATIONORDER_LIST_REQUEST,
  CONSULTATIONORDER_DELIVER_FAIL,
  CONSULTATIONORDER_DELIVER_SUCCESS,
  CONSULTATIONORDER_DELIVER_REQUEST,
  SENDSMS_REQUEST,
  SENDSMS_SUCCESS,
  SENDSMS_FAIL,
  VERIFY_PAYMENT_REQUEST,
  VERIFY_PAYMENT_SUCCESS,
  VERIFY_PAYMENT_FAIL,
  LISTDOCTOR_CONSULTATION_REQUEST,
  LISTDOCTOR_CONSULTATION_SUCCESS,
  LISTDOCTOR_CONSULTATION_FAIL,
  LISTALL_CONSULTATION_REQUEST,
  LISTALL_CONSULTATION_SUCCESS,
  LISTALL_CONSULTATION_FAIL,
  SENDRECEIPT_REQUEST,
  SENDRECEIPT_SUCCESS,
  SENDRECEIPT_FAIL,
  DOCTOR_CREATE_REVIEW_REQUEST,
  DOCTOR_CREATE_REVIEW_SUCCESS,
  DOCTOR_CREATE_REVIEW_FAIL,
  DOCTORHASBEENPAID_REQUEST,
  DOCTORHASBEENPAID_SUCCESS,
  DOCTORHASBEENPAID_FAIL,
  PROMO_CODE_REQUEST,
  PROMO_CODE_SUCCESS,
  PROMO_CODE_FAIL,
} from "../constants/orderConstants";
import { INITIATE_CLEAR_ITEMS } from "../constants/initiateConstants";
import { logout } from "../actions/patientActions";
import { doctorLogout } from "../actions/doctorActions";
import { adminLogout } from "../actions/adminActions";
import { toast } from "react-toastify";

//const baseUrl = "http://127.0.0.1:3005";
const baseUrl = "https://sbox-5v58.onrender.com";
export const createConsultationOrder =
  (order) => async (dispatch, getState) => {
    try {
      dispatch({
        type: CONSULTATIONORDER_CREATE_REQUEST,
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

      const { data } = await axios.post(`${baseUrl}/api/orders`, order, config);

      dispatch({
        type: CONSULTATIONORDER_CREATE_SUCCESS,
        payload: data,
      });

      dispatch({
        type: INITIATE_CLEAR_ITEMS,
        payload: data,
      });
      localStorage.removeItem("intiateItem");

      // alert msg
      toast(
        `Order successfully created, You can proceed to payment anytime you are ready to speak with Dr ${data.consultationorderItem.firstName}`,
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          type: "success",
        }
      );
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      if (message === "Not authorized, token failed") {
        dispatch(logout());
      }
      dispatch({
        type: CONSULTATIONORDER_CREATE_FAIL,
        payload: message,
      });
    }
  };

export const getOrderDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: CONSULTATIONORDER_DETAILS_REQUEST,
    });

    const {
      patientLogin: { patientInfo },
    } = getState();

    const {
      doctorLogin: { doctorInfo },
    } = getState();

    const {
      adminLogin: { adminInfo },
    } = getState();

    const tokenData = patientInfo
      ? patientInfo.token
      : doctorInfo
      ? doctorInfo.token
      : adminInfo.token;

    const config = {
      headers: {
        Authorization: `Bearer ${tokenData}`,
      },
    };

    const { data } = await axios.get(`${baseUrl}/api/orders/${id}`, config);

    dispatch({
      type: CONSULTATIONORDER_DETAILS_SUCCESS,
      payload: data,
    });

    // if (data.isPaid) {
    //     socket.emit('getDoctor');
    // }
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === "Not authorized, token failed") {
      dispatch(logout());
    }
    dispatch({
      type: CONSULTATIONORDER_DETAILS_FAIL,
      payload: message,
    });
  }
};

export const payOrder = (orderId) => async (dispatch, getState) => {
  try {
    dispatch({
      type: CONSULTATIONORDER_PAY_REQUEST,
    });

    const {
      patientLogin: { patientInfo },
    } = getState();

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
        Authorization: `Bearer ${patientInfo.token}`,
      },
      credentials: "include",
      mode: "cors",
    };

    const { data } = await axios.put(
      `${baseUrl}/api/orders/${orderId}/pay`,
      {},
      config
    );

    dispatch({
      type: CONSULTATIONORDER_PAY_SUCCESS,
      payload: data,
    });

    // send an sms alert to the doctor for consultation
    if (data) {
      const smsData = {
        docName: data.consultationorderItem.firstName,
        docPhone: data.consultationorderItem.phone,
        patientName: patientInfo.clinicName,
      };

      dispatch(sendSMS({ smsData }));
    }

    // alert msg
    toast.success(
      `Payment successful, An alert has been sent to your doctor, kindly proceed to the chatting room`
    );
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === "Not authorized, token failed") {
      dispatch(logout());
    }
    toast.error(message);
    dispatch({
      type: CONSULTATIONORDER_PAY_FAIL,
      payload: message,
    });
  }
};

export const verifyPaystackPayOrder = (ref) => async (dispatch, getState) => {
  try {
    dispatch({
      type: VERIFY_PAYMENT_REQUEST,
    });

    const {
      patientLogin: { patientInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${patientInfo.token}`,
      },
    };

    const data = await axios.get(`${baseUrl}/api/paystack/${ref}`, config);

    dispatch({
      type: VERIFY_PAYMENT_SUCCESS,
      payload: data,
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
      type: VERIFY_PAYMENT_FAIL,
      payload: message,
    });
  }
};

export const sendSMS = (smsData) => async (dispatch, getState) => {
  try {
    dispatch({
      type: SENDSMS_REQUEST,
    });

    const {
      patientLogin: { patientInfo },
    } = getState();

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
        Authorization: `Bearer ${patientInfo.token}`,
      },
      credentials: "include",
      mode: "cors",
    };

    const data = await axios.post(`${baseUrl}/api/sendsms`, smsData, config);

    console.log("sms", data);

    dispatch({
      type: SENDSMS_SUCCESS,
      payload: data,
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
      type: SENDSMS_FAIL,
      payload: message,
    });
  }
};

export const sendReceipt =
  ({ receiptDetail, orderId }) =>
  async (dispatch, getState) => {
    try {
      dispatch({
        type: SENDRECEIPT_REQUEST,
      });

      const {
        patientLogin: { patientInfo },
      } = getState();

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
          Authorization: `Bearer ${patientInfo.token}`,
        },
        credentials: "include",
        mode: "cors",
      };

      const data = await axios.post(
        `${baseUrl}/api/orders/${orderId}/receipt`,
        { receiptDetail },
        config
      );

      dispatch({
        type: SENDRECEIPT_SUCCESS,
        payload: data,
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
        type: SENDRECEIPT_FAIL,
        payload: message,
      });
    }
  };

export const deliverOrder = (order) => async (dispatch, getState) => {
  try {
    dispatch({
      type: CONSULTATIONORDER_DELIVER_REQUEST,
    });

    const {
      doctorLogin: { doctorInfo },
    } = getState();

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
        Authorization: `Bearer ${doctorInfo.token}`,
      },
      credentials: "include",
      mode: "cors",
    };

    const { data } = await axios.put(
      `${baseUrl}/api/orders/${order._id}/deliver`,
      {},
      config
    );

    dispatch({
      type: CONSULTATIONORDER_DELIVER_SUCCESS,
      payload: data,
    });

    toast(`Consultation for this order is completed!`, {
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
      type: CONSULTATIONORDER_DELIVER_FAIL,
      payload: message,
    });
  }
};

// list all consultation orders for a doctor
export const listDoctorConsultationRequest =
  () => async (dispatch, getState) => {
    try {
      dispatch({
        type: LISTDOCTOR_CONSULTATION_REQUEST,
      });

      const {
        doctorLogin: { doctorInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${doctorInfo.token}`,
        },
      };

      const { data } = await axios.get(
        `${baseUrl}/api/orders/docrequests`,
        config
      );

      const filteredData = data.filter(
        (a) => a.consultationorderItem.doctor === doctorInfo._id
      );

      dispatch({
        type: LISTDOCTOR_CONSULTATION_SUCCESS,
        payload: filteredData,
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
        type: LISTDOCTOR_CONSULTATION_FAIL,
        payload: message,
      });
    }
  };

// list all consultation orders for a doctor
export const listAllConsultationRequest = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: LISTALL_CONSULTATION_REQUEST,
    });

    const {
      adminLogin: { adminInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${adminInfo.token}`,
      },
    };

    const { data } = await axios.get(`${baseUrl}/api/orders`, config);

    dispatch({
      type: LISTALL_CONSULTATION_SUCCESS,
      payload: data,
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
      type: LISTALL_CONSULTATION_FAIL,
      payload: message,
    });
  }
};

export const listMyOrders = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: CONSULTATIONORDER_LIST_MY_REQUEST,
    });

    const {
      patientLogin: { patientInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${patientInfo.token}`,
      },
    };

    const { data } = await axios.get(`${baseUrl}/api/orders/myorders`, config);

    dispatch({
      type: CONSULTATIONORDER_LIST_MY_SUCCESS,
      payload: data,
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
      type: CONSULTATIONORDER_LIST_MY_FAIL,
      payload: message,
    });
  }
};

export const listOrders = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: CONSULTATIONORDER_LIST_REQUEST,
    });

    const {
      patientLogin: { patientInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${patientInfo.token}`,
      },
    };

    const { data } = await axios.get(`${baseUrl}/api/orders`, config);

    dispatch({
      type: CONSULTATIONORDER_LIST_SUCCESS,
      payload: data,
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
      type: CONSULTATIONORDER_LIST_FAIL,
      payload: message,
    });
  }
};

export const createDoctorReview =
  (docId, review) => async (dispatch, getState) => {
    try {
      dispatch({
        type: DOCTOR_CREATE_REVIEW_REQUEST,
      });

      const {
        patientLogin: { patientInfo },
      } = getState();

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
          Authorization: `Bearer ${patientInfo.token}`,
        },
        credentials: "include",
        mode: "cors",
      };

      await axios.post(
        `${baseUrl}/api/doctors/${docId}/review`,
        review,
        config
      );

      dispatch({
        type: DOCTOR_CREATE_REVIEW_SUCCESS,
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
        type: DOCTOR_CREATE_REVIEW_FAIL,
        payload: message,
      });
    }
  };

export const doctorHasBeenPaid = (order) => async (dispatch, getState) => {
  try {
    dispatch({
      type: DOCTORHASBEENPAID_REQUEST,
    });

    const {
      adminLogin: { adminInfo },
    } = getState();

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
        Authorization: `Bearer ${adminInfo.token}`,
      },
      credentials: "include",
      mode: "cors",
    };

    const { data } = await axios.put(
      `${baseUrl}/api/orders/${order._id}/doctorpaid`,
      {},
      config
    );

    dispatch({
      type: DOCTORHASBEENPAID_SUCCESS,
      payload: data,
    });

    toast(`successful!`, {
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
      type: DOCTORHASBEENPAID_FAIL,
      payload: message,
    });
  }
};

export const getPromoCode =
  ({ code }) =>
  async (dispatch, getState) => {
    try {
      dispatch({
        type: PROMO_CODE_REQUEST,
      });

      const {
        patientLogin: { patientInfo },
      } = getState();

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
          Authorization: `Bearer ${patientInfo.token}`,
        },
        credentials: "include",
        mode: "cors",
      };

      const { data } = await axios.post(
        `${baseUrl}/api/orders/promocode`,
        { code },
        config
      );

      dispatch({
        type: PROMO_CODE_SUCCESS,
        payload: data,
      });

      toast(`successful!`, {
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
        type: PROMO_CODE_FAIL,
        payload: message,
      });
    }
  };
