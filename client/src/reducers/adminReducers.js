import {
  ADMIN_LOGIN_REQUEST,
  ADMIN_LOGIN_SUCCESS,
  ADMIN_LOGIN_FAIL,
  ADMIN_LOGOUT,
  ALLRECEIPTS_REQUEST,
  ALLRECEIPTS_SUCCESS,
  ALLRECEIPTS_FAIL,
  ALLRECEIPTS_RESET,
  ALLPRESCRIPTIONS_REQUEST,
  ALLPRESCRIPTIONS_SUCCESS,
  ALLPRESCRIPTIONS_FAIL,
  ALLPRESCRIPTIONS_RESET,
  ALLPATIENTS_REQUEST,
  ALLPATIENTS_SUCCESS,
  ALLPATIENTS_FAIL,
  ALLPATIENTS_RESET,
  ALLDOCTORS_REQUEST,
  ALLDOCTORS_SUCCESS,
  ALLDOCTORS_FAIL,
  ALLDOCTORS_RESET,
  DOCTORADMIN_DETAILS_REQUEST,
  DOCTORADMIN_DETAILS_SUCCESS,
  DOCTORADMIN_DETAILS_FAIL,
  PATIENTADMIN_DETAILS_REQUEST,
  PATIENTADMIN_DETAILS_SUCCESS,
  PATIENTADMIN_DETAILS_FAIL,
  DOCTOR_DELETE_REQUEST,
  DOCTOR_DELETE_SUCCESS,
  DOCTOR_DELETE_FAIL,
  DOCTOR_DELETE_RESET,
  PATIENT_DELETE_REQUEST,
  PATIENT_DELETE_SUCCESS,
  PATIENT_DELETE_FAIL,
  PATIENT_DELETE_RESET,
  DOCTOR_VERIFY_REQUEST,
  DOCTOR_VERIFY_SUCCESS,
  DOCTOR_VERIFY_FAIL,
  DOCTOR_VERIFY_RESET,
  DOCTOR_REVIEWS_REQUEST,
  DOCTOR_REVIEWS_SUCCESS,
  DOCTOR_REVIEWS_FAIL,
  DOCTOR_REVIEWS_RESET,
  REVIEW_DELETE_REQUEST,
  REVIEW_DELETE_SUCCESS,
  REVIEW_DELETE_FAIL,
  REVIEW_DELETE_RESET,
  ADMIN_APPROVE_REQUEST,
  ADMIN_APPROVE_SUCCESS,
  ADMIN_APPROVE_FAIL,
  ADMIN_APPROVE_RESET,
  GENERATE_PROMOCODE_REQUEST,
  GENERATE_PROMOCODE_SUCCESS,
  GENERATE_PROMOCODE_FAIL,
  GENERATE_PROMOCODE_RESET,
  ALLPROMOCODES_REQUEST,
  ALLPROMOCODES_SUCCESS,
  ALLPROMOCODES_FAIL,
  ALLPROMOCODES_RESET,
  DELETE_PROMOCODE_REQUEST,
  DELETE_PROMOCODE_SUCCESS,
  DELETE_PROMOCODE_FAIL,
  DELETE_PROMOCODE_RESET,
  SUMMARY_LIST_REQUEST,
  SUMMARY_LIST_SUCCESS,
  SUMMARY_LIST_FAIL,
  SUMMARY_LIST_RESET,
  REFERRAL_LIST_REQUEST,
  REFERRAL_LIST_SUCCESS,
  REFERRAL_LIST_FAIL,
  REFERRAL_LIST_RESET,
  MESSAGE_ADMIN_REQUEST,
  MESSAGE_ADMIN_SUCCESS,
  MESSAGE_ADMIN_FAIL,
  MESSAGE_ADMIN_RESET,
  SEND_EMAIL_REQUEST,
  SEND_EMAIL_SUCCESS,
  SEND_EMAIL_FAIL,
  SEND_EMAIL_RESET,
  SEND_SMS_REQUEST,
  SEND_SMS_SUCCESS,
  SEND_SMS_FAIL,
  SEND_SMS_RESET,
  CLEAR_ERRORS,
} from "../constants/adminConstants";

export const adminLoginReducer = (state = {}, action) => {
  switch (action.type) {
    case ADMIN_LOGIN_REQUEST:
      return { loading: true };
    case ADMIN_LOGIN_SUCCESS:
      return { loading: false, adminInfo: action.payload };
    case ADMIN_LOGIN_FAIL:
      return { loading: false, error: action.payload };
    case ADMIN_LOGOUT:
      return {};
    default:
      return state;
  }
};

export const allReceiptsListReducer = (state = { receipts: [] }, action) => {
  switch (action.type) {
    case ALLRECEIPTS_REQUEST:
      return { loading: true };
    case ALLRECEIPTS_SUCCESS:
      return { loading: false, receipts: action.payload };
    case ALLRECEIPTS_FAIL:
      return { loading: false, error: action.payload };
    case ALLRECEIPTS_RESET:
      return {};
    default:
      return state;
  }
};

export const allPrescriptionsListReducer = (
  state = { prescriptions: [] },
  action
) => {
  switch (action.type) {
    case ALLPRESCRIPTIONS_REQUEST:
      return { loading: true };
    case ALLPRESCRIPTIONS_SUCCESS:
      return { loading: false, prescriptions: action.payload };
    case ALLPRESCRIPTIONS_FAIL:
      return { loading: false, error: action.payload };
    case ALLPRESCRIPTIONS_RESET:
      return {};
    default:
      return state;
  }
};

export const allPatientsListReducer = (state = { patients: [] }, action) => {
  switch (action.type) {
    case ALLPATIENTS_REQUEST:
      return { loading: true };
    case ALLPATIENTS_SUCCESS:
      return { loading: false, patients: action.payload };
    case ALLPATIENTS_FAIL:
      return { loading: false, error: action.payload };
    case ALLPATIENTS_RESET:
      return {};
    default:
      return state;
  }
};

export const allDoctorsListReducer = (state = { doctors: [] }, action) => {
  switch (action.type) {
    case ALLDOCTORS_REQUEST:
      return { loading: true };
    case ALLDOCTORS_SUCCESS:
      return { loading: false, doctors: action.payload };
    case ALLDOCTORS_FAIL:
      return { loading: false, error: action.payload };
    case ALLDOCTORS_RESET:
      return {};
    default:
      return state;
  }
};

export const doctorAdminDetailReducer = (
  state = { doctor: { reviews: [] } },
  action
) => {
  switch (action.type) {
    case DOCTORADMIN_DETAILS_REQUEST:
      return { loading: true, ...state };
    case DOCTORADMIN_DETAILS_SUCCESS:
      return { loading: false, doctor: action.payload };
    case DOCTORADMIN_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const patientAdminDetailReducer = (state = { patient: {} }, action) => {
  switch (action.type) {
    case PATIENTADMIN_DETAILS_REQUEST:
      return { ...state, loading: true };
    case PATIENTADMIN_DETAILS_SUCCESS:
      return { loading: false, patient: action.payload };
    case PATIENTADMIN_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const doctorDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case DOCTOR_DELETE_REQUEST:
      return { loading: true };
    case DOCTOR_DELETE_SUCCESS:
      return { loading: false, success: true };
    case DOCTOR_DELETE_FAIL:
      return { loading: false, error: action.payload };
    case DOCTOR_DELETE_RESET:
      return {};
    default:
      return state;
  }
};

export const patientDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case PATIENT_DELETE_REQUEST:
      return { loading: true };
    case PATIENT_DELETE_SUCCESS:
      return { loading: false, success: true };
    case PATIENT_DELETE_FAIL:
      return { loading: false, error: action.payload };
    case PATIENT_DELETE_RESET:
      return {};
    default:
      return state;
  }
};

export const doctorVerifyReducer = (state = {}, action) => {
  switch (action.type) {
    case DOCTOR_VERIFY_REQUEST:
      return {
        loading: true,
      };
    case DOCTOR_VERIFY_SUCCESS:
      return {
        loading: false,
        success: true,
      };
    case DOCTOR_VERIFY_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case DOCTOR_VERIFY_RESET:
      return {};
    default:
      return state;
  }
};

export const reviewListReducer = (state = { reviews: [] }, action) => {
  switch (action.type) {
    case DOCTOR_REVIEWS_REQUEST:
      return { loading: true };
    case DOCTOR_REVIEWS_SUCCESS:
      return { loading: false, reviews: action.payload };
    case DOCTOR_REVIEWS_FAIL:
      return { loading: false, error: action.payload };
    case DOCTOR_REVIEWS_RESET:
      return {};
    default:
      return state;
  }
};

export const approveReviewReducer = (state = {}, action) => {
  switch (action.type) {
    case ADMIN_APPROVE_REQUEST:
      return {
        loading: true,
      };
    case ADMIN_APPROVE_SUCCESS:
      return {
        loading: false,
        success: true,
      };
    case ADMIN_APPROVE_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case ADMIN_APPROVE_RESET:
      return {};
    default:
      return state;
  }
};

export const deleteReviewReducer = (state = {}, action) => {
  switch (action.type) {
    case REVIEW_DELETE_REQUEST:
      return { loading: true };
    case REVIEW_DELETE_SUCCESS:
      return { loading: false, success: true };
    case REVIEW_DELETE_FAIL:
      return { loading: false, error: action.payload };
    case REVIEW_DELETE_RESET:
      return {};
    default:
      return state;
  }
};

export const generatePromoCodeReducer = (state = {}, action) => {
  switch (action.type) {
    case GENERATE_PROMOCODE_REQUEST:
      return { loading: true };
    case GENERATE_PROMOCODE_SUCCESS:
      return { loading: false, promocode: action.payload };
    case GENERATE_PROMOCODE_FAIL:
      return { loading: false, error: action.payload };
    case GENERATE_PROMOCODE_RESET:
      return {};
    default:
      return state;
  }
};

export const getPromoCodesReducer = (state = { promocodes: [] }, action) => {
  switch (action.type) {
    case ALLPROMOCODES_REQUEST:
      return { loading: true };
    case ALLPROMOCODES_SUCCESS:
      return { loading: false, promocodes: action.payload };
    case ALLPROMOCODES_FAIL:
      return { loading: false, error: action.payload };
    case ALLPROMOCODES_RESET:
      return {};
    default:
      return state;
  }
};

export const deletePromoCodeReducer = (state = {}, action) => {
  switch (action.type) {
    case DELETE_PROMOCODE_REQUEST:
      return { loading: true };
    case DELETE_PROMOCODE_SUCCESS:
      return { loading: false, success: true };
    case DELETE_PROMOCODE_FAIL:
      return { loading: false, error: action.payload };
    case DELETE_PROMOCODE_RESET:
      return {};
    default:
      return state;
  }
};

export const consultationSummaryListAdminReducer = (
  state = { summaries: [] },
  action
) => {
  switch (action.type) {
    case SUMMARY_LIST_REQUEST:
      return { loading: true };
    case SUMMARY_LIST_SUCCESS:
      return { loading: false, summaries: action.payload };
    case SUMMARY_LIST_FAIL:
      return { loading: false, error: action.payload };
    case SUMMARY_LIST_RESET:
      return {};
    default:
      return state;
  }
};

export const allReferralListReducer = (state = { referrals: [] }, action) => {
  switch (action.type) {
    case REFERRAL_LIST_REQUEST:
      return { loading: true };
    case REFERRAL_LIST_SUCCESS:
      return { loading: false, referrals: action.payload };
    case REFERRAL_LIST_FAIL:
      return { loading: false, error: action.payload };
    case REFERRAL_LIST_RESET:
      return {};
    default:
      return state;
  }
};

export const contactMailReducer = (state = {}, action) => {
  switch (action.type) {
    case MESSAGE_ADMIN_REQUEST:
      return { loading: true };
    case MESSAGE_ADMIN_SUCCESS:
      return { loading: false, success: true, mail: action.payload };
    case MESSAGE_ADMIN_FAIL:
      return { loading: false, error: action.payload };
    case MESSAGE_ADMIN_RESET:
      return {};
    default:
      return state;
  }
};

// send mail to all registered users. patient or doctor
export const sendMailToAllReducer = (state = {}, action) => {
  switch (action.type) {
    case SEND_EMAIL_REQUEST:
      return { loading: true };
    case SEND_EMAIL_SUCCESS:
      return { loading: false, success: true, mail: action.payload };
    case SEND_EMAIL_FAIL:
      return { loading: false, error: action.payload };
    case SEND_EMAIL_RESET:
      return {};
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// send sms to all registered users. patient or doctor
export const sendSmsToAllReducer = (state = {}, action) => {
  switch (action.type) {
    case SEND_SMS_REQUEST:
      return { loading: true };
    case SEND_SMS_SUCCESS:
      return { loading: false, success: true, mail: action.payload };
    case SEND_SMS_FAIL:
      return { loading: false, error: action.payload };
    case SEND_SMS_RESET:
      return {};
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};
