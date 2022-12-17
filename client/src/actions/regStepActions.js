import axios from "axios";
import {
  REG_STEP1_SUCCESS,
  REG_EMAILSTATUS_SUCCESS,
  REG_STEP1_FAIL,
  REG_STEP2,
  REG_STEP3,
  // INITIATE_SAVE_PAYMENT_METHOD,
} from "../constants/regStepConstants";
import { toast } from "react-toastify";

//const baseUrl = "http://127.0.0.1:3005";
const baseUrl = "https://sbox-5v58.onrender.com";
export const saveRegStep1 = (email) => async (dispatch, getState) => {
  try {
    const { data } = await axios.get(
      `${baseUrl}/api/doctors/checkmails/${email}`
    );
    dispatch({
      type: REG_STEP1_SUCCESS,
      payload: {
        email,
      },
    });

    dispatch({
      type: REG_EMAILSTATUS_SUCCESS,
      payload: {
        email,
        emailExist: data.emailExist,
        message: data.message,
      },
    });

    localStorage.setItem("addData1", JSON.stringify(email));
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({
      type: REG_STEP1_FAIL,
      payload: message,
    });
  }
};

export const saveRegStep2 = (data) => (dispatch) => {
  dispatch({
    type: REG_STEP2,
    payload: data,
  });

  localStorage.setItem("addData2", JSON.stringify(data));
};

export const saveRegStep3 = (data) => (dispatch) => {
  dispatch({
    type: REG_STEP3,
    payload: data,
  });

  localStorage.setItem("addData3", JSON.stringify(data));
};

export const checkEmailClinicName =
  ({ email, clinicName }) =>
  async (dispatch, getState) => {
    try {
      // get csrftoken
      //  const { data : csrf} = await axios.get("/getcsrf", {
      //     headers: {
      //         "Content-Type": "Application/json",
      //     },
      //     credentials:"include",
      //     mode:"cors"
      // })

      const config = {
        headers: {
          "Content-Type": "Application/json",
        },
        credentials: "include",
        mode: "cors",
      };

      const { data } = await axios.post(
        `${baseUrl}/api/patients/checkdetails`,
        { email, clinicName },
        config
      );
      dispatch({
        type: REG_STEP1_SUCCESS,
        payload: {
          email,
          clinicName,
        },
      });

      console.log(data);

      dispatch({
        type: REG_EMAILSTATUS_SUCCESS,
        payload: {
          email,
          clinicName,
          emailExist: data.emailExist,
          clinicNameExist: data.clinicNameExist,
          message: data.message,
        },
      });

      localStorage.setItem(
        "addData1",
        JSON.stringify({ email: email, clinicName: clinicName })
      );
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      dispatch({
        type: REG_STEP1_FAIL,
        payload: message,
      });
    }
  };
