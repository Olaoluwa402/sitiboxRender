import axios from "axios";
import {
  WALLET_BALANCE_REQUEST,
  WALLET_BALANCE_SUCCESS,
  WALLET_BALANCE_FAIL,
  FUND_WALLET_REQUEST,
  FUND_WALLET_SUCCESS,
  FUND_WALLET_FAIL,
  VERIFY_PAYSTACKFUND_REQUEST,
  VERIFY_PAYSTACKFUND_SUCCESS,
  VERIFY_PAYSTACKFUND_FAIL,
  WALLET_TRANSACTIONS_REQUEST,
  WALLET_TRANSACTIONS_SUCCESS,
  WALLET_TRANSACTIONS_FAIL,
  BANK_VERIFY_REQUEST,
  BANK_VERIFY_SUCCESS,
  BANK_VERIFY_FAIL,
  GET_BANKS_REQUEST,
  GET_BANKS_SUCCESS,
  GET_BANKS_FAIL,
  CREATE_RECIPIENT_REQUEST,
  CREATE_RECIPIENT_SUCCESS,
  CREATE_RECIPIENT_FAIL,
} from "../constants/walletConstants";
import { toast } from "react-toastify";
import { logout } from "./patientActions";
import { doctorLogout } from "./doctorActions";

//const baseUrl = "http://127.0.0.1:3005";
const baseUrl = "https://sbox-5v58.onrender.com";
export const getBalanceAction = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: WALLET_BALANCE_REQUEST,
    });

    const {
      patientLogin: { patientInfo },
    } = getState();

    const {
      doctorLogin: { doctorInfo },
    } = getState();

    const token =
      patientInfo && patientInfo.token
        ? patientInfo.token
        : doctorInfo && doctorInfo.token
        ? doctorInfo.token
        : null;

    const config = {
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.get(`${baseUrl}/api/wallet`, config);

    dispatch({
      type: WALLET_BALANCE_SUCCESS,
      payload: data.wallet,
    });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;

    const {
      patientLogin: { patientInfo },
    } = getState();

    if (message === "Not authorized, token failed") {
      patientInfo ? dispatch(logout()) : dispatch(doctorLogout);
    }
    dispatch({
      type: WALLET_BALANCE_FAIL,
      payload: message,
    });
  }
};

export const fundWalletAction = (amount) => async (dispatch, getState) => {
  try {
    dispatch({
      type: FUND_WALLET_REQUEST,
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

    const { data } = await axios.post(
      `${baseUrl}/api/wallet/fund-wallet`,
      { amount },
      config
    );
    dispatch({
      type: FUND_WALLET_SUCCESS,
      payload: data.result,
    });

    window.location.href = data.data;
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === "Not authorized, token failed") {
      dispatch(logout());
    }
    dispatch({
      type: FUND_WALLET_FAIL,
      payload: message,
    });
  }
};

export const verifyFundWalletAction = (ref) => async (dispatch, getState) => {
  try {
    dispatch({
      type: VERIFY_PAYSTACKFUND_REQUEST,
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

    const { data } = await axios.post(
      `${baseUrl}/api/wallet/fund-verify`,
      { ref },
      config
    );
    console.log(data);
    dispatch({
      type: VERIFY_PAYSTACKFUND_SUCCESS,
      payload: data,
    });

    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    const url =
      hostname === "localhost"
        ? `${protocol}//${hostname}:3000/dashboard`
        : `${protocol}//${hostname}/dashboard`;

    window.location.assign(url);
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === "Not authorized, token failed") {
      dispatch(logout());
    }
    dispatch({
      type: VERIFY_PAYSTACKFUND_FAIL,
      payload: message,
    });
  }
};

export const getTransactionsAction = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: WALLET_TRANSACTIONS_REQUEST,
    });

    const {
      patientLogin: { patientInfo },
    } = getState();

    const {
      doctorLogin: { doctorInfo },
    } = getState();

    const token =
      patientInfo && patientInfo.token
        ? patientInfo.token
        : doctorInfo && doctorInfo.token
        ? doctorInfo.token
        : null;

    const config = {
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.get(
      `${baseUrl}/api/wallet/transactions`,
      config
    );

    dispatch({
      type: WALLET_TRANSACTIONS_SUCCESS,
      payload: data.transactions,
    });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;

    const {
      patientLogin: { patientInfo },
    } = getState();
    if (message === "Not authorized, token failed") {
      patientInfo ? dispatch(logout()) : dispatch(doctorLogout);
    }
    dispatch({
      type: WALLET_TRANSACTIONS_FAIL,
      payload: message,
    });
  }
};

export const verifyBankAccount =
  (acct, bankCode) => async (dispatch, getState) => {
    try {
      dispatch({
        type: BANK_VERIFY_REQUEST,
      });

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
        `${baseUrl}/api/wallet/bank/verify`,
        { acct, bankCode },
        config
      );
      console.log(data);
      dispatch({
        type: BANK_VERIFY_SUCCESS,
        payload: data.data,
      });
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      if (message === "Not authorized, token failed") {
        dispatch(doctorLogout());
      }
      toast.error(message);
      dispatch({
        type: BANK_VERIFY_FAIL,
        payload: message,
      });
    }
  };

export const getBanksAction = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: GET_BANKS_REQUEST,
    });

    const config = {
      headers: {
        "Content-Type": "Application/json",
      },
    };

    const { data } = await axios.get(
      `${baseUrl}/api/wallet/bank/banks`,
      config
    );
    console.log(data);
    dispatch({
      type: GET_BANKS_SUCCESS,
      payload: data.banks,
    });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    toast.error(message);
    dispatch({
      type: GET_BANKS_FAIL,
      payload: message,
    });
  }
};

export const createRecipientAction =
  (account_name, account_number, bank_code, amount) =>
  async (dispatch, getState) => {
    try {
      dispatch({
        type: CREATE_RECIPIENT_REQUEST,
      });

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
        `${baseUrl}/api/wallet/bank/createrecipient`,
        { account_name, account_number, bank_code, amount },
        config
      );
      console.log(data);
      dispatch({
        type: CREATE_RECIPIENT_SUCCESS,
        payload: data.data,
      });
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      if (message === "Not authorized, token failed") {
        dispatch(doctorLogout());
      }
      toast.error(message);
      dispatch({
        type: CREATE_RECIPIENT_FAIL,
        payload: message,
      });
    }
  };
