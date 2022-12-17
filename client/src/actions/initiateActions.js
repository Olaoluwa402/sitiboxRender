import axios from "axios";
import {
  INITIATE_ADD_DOCTORSUCCESS,
  INITIATE_ADD_DOCTORFAIL,
  INITIATE_ADD_COMPLAINT,
  INITIATE_SAVE_PAYMENT_METHOD,
} from "../constants/initiateConstants";

//const baseUrl = "http://127.0.0.1:3005";
const baseUrl = "https://sbox-5v58.onrender.com";
export const addToInitiate = (id) => async (dispatch, getState) => {
  try {
    const { data } = await axios.get(`${baseUrl}/api/doctors/${id}`);

    dispatch({
      type: INITIATE_ADD_DOCTORSUCCESS,
      payload: {
        doctor: data._id,
        firstName: data.firstName,
        lastName: data.lastName,
        image: data.image,
        specialty: data.specialty,
        phone: data.phone,
        gender: data.gender,
        biodata: data.biodata,
        rating: data.rating,
        doctorIsVerified: data.doctorIsVerified,
      },
    });

    localStorage.setItem(
      "initiateItem",
      JSON.stringify(getState().initiate.initiateItem)
    );
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({
      type: INITIATE_ADD_DOCTORFAIL,
      payload: message,
    });
  }
};

export const saveComplaint = (data) => (dispatch) => {
  dispatch({
    type: INITIATE_ADD_COMPLAINT,
    payload: data,
  });

  localStorage.setItem("addComplaint", JSON.stringify(data));
};

export const savePaymentMethod = (data) => (dispatch) => {
  dispatch({
    type: INITIATE_SAVE_PAYMENT_METHOD,
    payload: data,
  });

  localStorage.setItem("paymentMethod", JSON.stringify(data));
};
