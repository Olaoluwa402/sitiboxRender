import {
  DOCTOR_LOGIN_REQUEST,
  DOCTOR_LOGIN_SUCCESS,
  DOCTOR_LOGIN_FAIL,
  DOCTOR_LOGOUT,
  DOCTOR_REGISTER_REQUEST,
  DOCTOR_REGISTER_SUCCESS,
  DOCTOR_REGISTER_FAIL,
  DOCTOR_REGISTER_RESET,
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
  DOCTOR_UPDATE_PROFILE_RESET,
  DOCTORPHONEVERIFY_SUCCESS,
  DOCTORPHONEVERIFY_FAIL,
  DOCTORPHONECODEVERIFY_REQUEST,
  DOCTORPHONECODEVERIFY_SUCCESS,
  DOCTORPHONECODEVERIFY_FAIL,
  DOCTORPHONECODEVERIFY_RESET,
  NEWPRESCRIPTION_REQUEST,
  NEWPRESCRIPTION_SUCCESS,
  NEWPRESCRIPTION_FAIL,
  NEWPRESCRIPTION_RESET,
  DOCTORPRESCRIPTION_LIST_REQUEST,
  DOCTORPRESCRIPTION_LIST_SUCCESS,
  DOCTORPRESCRIPTION_LIST_FAIL,
  DOCTORPRESCRIPTION_LIST_RESET,
  UPDATEPRESCRIPTION_DETAIL_REQUEST,
  UPDATEPRESCRIPTION_DETAIL_SUCCESS,
  UPDATEPRESCRIPTION_DETAIL_FAIL,
  UPDATEPRESCRIPTION_DETAIL_RESET,
  DOCTOR_PASSWORDRESET_REQUEST,
  DOCTOR_PASSWORDRESET_SUCCESS,
  DOCTOR_PASSWORDRESET_FAIL,
  DOCTOR_PASSWORDRESET_RESET,
  DOCTOR_NEWPASSWORD_REQUEST,
  DOCTOR_NEWPASSWORD_SUCCESS,
  DOCTOR_NEWPASSWORD_FAIL,
  DOCTOR_NEWPASSWORD_RESET,
  CREATECONSULTATION_SUMMARY_REQUEST,
  CREATECONSULTATION_SUMMARY_SUCCESS,
  CREATECONSULTATION_SUMMARY_FAIL,
  CREATECONSULTATION_SUMMARY_RESET,
  SUMMARY_LIST_REQUEST,
  SUMMARY_LIST_SUCCESS,
  SUMMARY_LIST_FAIL,
  SUMMARY_LIST_RESET,
  SUMMARY_DETAIL_REQUEST,
  SUMMARY_DETAIL_SUCCESS,
  SUMMARY_DETAIL_FAIL,
  SUMMARY_DETAIL_RESET,
  UPDATESUMMARY_DETAIL_REQUEST,
  UPDATESUMMARY_DETAIL_SUCCESS,
  UPDATESUMMARY_DETAIL_FAIL,
  UPDATESUMMARY_DETAIL_RESET,
  SUMMARY_PERCHAT_REQUEST,
  SUMMARY_PERCHAT_SUCCESS,
  SUMMARY_PERCHAT_FAIL,
  SUMMARY_PERCHAT_RESET,
  CREATECONSULTATION_REFERRAL_REQUEST,
  CREATECONSULTATION_REFERRAL_SUCCESS,
  CREATECONSULTATION_REFERRAL_FAIL,
  CREATECONSULTATION_REFERRAL_RESET,
  REFERRAL_LIST_REQUEST,
  REFERRAL_LIST_SUCCESS,
  REFERRAL_LIST_FAIL,
  REFERRAL_LIST_RESET,
  REFERRAL_DETAIL_REQUEST,
  REFERRAL_DETAIL_SUCCESS,
  REFERRAL_DETAIL_FAIL,
  REFERRAL_DETAIL_RESET,
  UPDATEREFERRAL_DETAIL_REQUEST,
  UPDATEREFERRAL_DETAIL_SUCCESS,
  UPDATEREFERRAL_DETAIL_FAIL,
  UPDATEREFERRAL_DETAIL_RESET,
  DOCTOR_CONFIRM_REGISTER_REQUEST,
  DOCTOR_CONFIRM_REGISTER_SUCCESS,
  DOCTOR_CONFIRM_REGISTER_FAIL,
  RESENDMAIL_REQUEST,
  RESENDMAIL_SUCCESS,
  RESENDMAIL_FAIL,
  ADD_ACCT_REQUEST,
  ADD_ACCT_SUCCESS,
  ADD_ACCT_FAIL,
  ADD_ACCT_RESET,
  GET_ACCTLIST_REQUEST,
  GET_ACCTLIST_SUCCESS,
  GET_ACCTLIST_FAIL,
  GET_ACCTLIST_RESET,
  ACCTLIST_OPENACCESS_REQUEST,
  ACCTLIST_OPENACCESS_SUCCESS,
  ACCTLIST_OPENACCESS_FAIL,
  ACCTLIST_OPENACCESS_RESET,
  GET_ACCTDETAIL_REQUEST,
  GET_ACCTDETAIL_SUCCESS,
  GET_ACCTDETAIL_FAIL,
  GET_ACCTDETAIL_RESET,
  UPDATE_ACCTDETAIL_REQUEST,
  UPDATE_ACCTDETAIL_SUCCESS,
  UPDATE_ACCTDETAIL_FAIL,
  UPDATE_ACCTDETAIL_RESET,
  DELETE_ACCT_REQUEST,
  DELETE_ACCT_SUCCESS,
  DELETE_ACCT_FAIL,
  DELETE_ACCT_RESET,
  CHANGE_PASSWORD_REQUEST,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD_FAIL,
  CHANGE_PASSWORD_RESET,
  UPDATE_DOCUMENT_REQUEST,
  UPDATE_DOCUMENT_SUCCESS,
  UPDATE_DOCUMENT_FAIL,
  UPDATE_DOCUMENT_RESET,
} from "../constants/doctorConstants";

export const doctorLoginReducer = (state = {}, action) => {
  switch (action.type) {
    case DOCTOR_LOGIN_REQUEST:
      return { loading: true };
    case DOCTOR_LOGIN_SUCCESS:
      return { loading: false, doctorInfo: action.payload };
    case DOCTOR_LOGIN_FAIL:
      return { loading: false, error: action.payload };
    case DOCTOR_LOGOUT:
      return {};
    default:
      return state;
  }
};

export const docPhoneVerifyReducer = (state = {}, action) => {
  switch (action.type) {
    case DOCTORPHONEVERIFY_SUCCESS:
      return { loading: false, success: true, phoneVerifyInfo: action.payload };
    case DOCTORPHONEVERIFY_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const docPhoneCodeVerifyReducer = (state = {}, action) => {
  switch (action.type) {
    case DOCTORPHONECODEVERIFY_REQUEST:
      return { loading: true };
    case DOCTORPHONECODEVERIFY_SUCCESS:
      return {
        loading: false,
        success: true,
        phoneVerifyCodeInfo: action.payload,
      };
    case DOCTORPHONECODEVERIFY_FAIL:
      return { loading: false, error: action.payload };
    case DOCTORPHONECODEVERIFY_RESET:
      return {};
    default:
      return state;
  }
};

export const doctorRegisterReducer = (state = {}, action) => {
  switch (action.type) {
    case DOCTOR_REGISTER_REQUEST:
      return { loading: true };
    case DOCTOR_REGISTER_SUCCESS:
      return { loading: false, success: true, register: action.payload };
    case DOCTOR_REGISTER_FAIL:
      return { loading: false, error: action.payload };
    case DOCTOR_REGISTER_RESET:
      return {};
    default:
      return state;
  }
};

export const resendMailReducer = (state = {}, action) => {
  switch (action.type) {
    case RESENDMAIL_REQUEST:
      return { loading: true };
    case RESENDMAIL_SUCCESS:
      return { loading: false, success: true, data: action.payload };
    case RESENDMAIL_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const doctorConfirmRegisterReducer = (state = {}, action) => {
  switch (action.type) {
    case DOCTOR_CONFIRM_REGISTER_REQUEST:
      return { loading: true };
    case DOCTOR_CONFIRM_REGISTER_SUCCESS:
      return { loading: false, success: true, doctorInfo: action.payload };
    case DOCTOR_CONFIRM_REGISTER_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const doctorListReducer = (state = { doctors: [] }, action) => {
  switch (action.type) {
    case DOCTOR_LIST_REQUEST:
      return { loading: true };
    case DOCTOR_LIST_SUCCESS:
      return { loading: false, doctors: action.payload };
    case DOCTOR_LIST_FAIL:
      return { loading: false, error: action.payload };
    case DOCTOR_LIST_RESET:
      return {};
    default:
      return state;
  }
};

export const doctorProfileReducer = (
  state = { doctor: { firstName: "", reviews: [] } },
  action
) => {
  switch (action.type) {
    case DOCTOR_PROFILE_REQUEST:
      return { loading: true, ...state };
    case DOCTOR_PROFILE_SUCCESS:
      return { loading: false, doctor: action.payload };
    case DOCTOR_PROFILE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const doctorDetailsReducer = (
  state = { doctor: { reviews: [] } },
  action
) => {
  switch (action.type) {
    case DOCTOR_DETAILS_REQUEST:
      return { loading: true, ...state };
    case DOCTOR_DETAILS_SUCCESS:
      return { loading: false, doctor: action.payload };
    case DOCTOR_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const doctorUpdateProfileReducer = (state = {}, action) => {
  switch (action.type) {
    case DOCTOR_UPDATE_PROFILE_REQUEST:
      return { loading: true };
    case DOCTOR_UPDATE_PROFILE_SUCCESS:
      return { loading: false, success: true, doctorInfo: action.payload };
    case DOCTOR_UPDATE_PROFILE_FAIL:
      return { loading: false, error: action.payload };
    case DOCTOR_UPDATE_PROFILE_RESET:
      return {};
    default:
      return state;
  }
};

export const sendPrescriptionReducer = (state = {}, action) => {
  switch (action.type) {
    case NEWPRESCRIPTION_REQUEST:
      return { loading: true };
    case NEWPRESCRIPTION_SUCCESS:
      return {
        loading: false,
        success: true,
        prescriptionInfo: action.payload,
      };
    case NEWPRESCRIPTION_FAIL:
      return { loading: false, error: action.payload };
    case NEWPRESCRIPTION_RESET:
      return {};
    default:
      return state;
  }
};

export const createConsultationSummaryReducer = (state = {}, action) => {
  switch (action.type) {
    case CREATECONSULTATION_SUMMARY_REQUEST:
      return { loading: true };
    case CREATECONSULTATION_SUMMARY_SUCCESS:
      return { loading: false, success: true, summary: action.payload };
    case CREATECONSULTATION_SUMMARY_FAIL:
      return { loading: false, error: action.payload };
    case CREATECONSULTATION_SUMMARY_RESET:
      return {};
    default:
      return state;
  }
};

export const consultationSummaryListReducer = (
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

export const chatConsultationSummaryListReducer = (
  state = { summaries: [] },
  action
) => {
  switch (action.type) {
    case SUMMARY_PERCHAT_REQUEST:
      return { loading: true };
    case SUMMARY_PERCHAT_SUCCESS:
      return { loading: false, summaries: action.payload };
    case SUMMARY_PERCHAT_FAIL:
      return { loading: false, error: action.payload };
    case SUMMARY_PERCHAT_RESET:
      return {};
    default:
      return state;
  }
};

export const summaryDetailReducer = (state = {}, action) => {
  switch (action.type) {
    case SUMMARY_DETAIL_REQUEST:
      return { loading: true };
    case SUMMARY_DETAIL_SUCCESS:
      return { loading: false, success: true, summary: action.payload };
    case SUMMARY_DETAIL_FAIL:
      return { loading: false, error: action.payload };
    case SUMMARY_DETAIL_RESET:
      return {};
    default:
      return state;
  }
};

export const updateSummaryDetailReducer = (state = {}, action) => {
  switch (action.type) {
    case UPDATESUMMARY_DETAIL_REQUEST:
      return { loading: true };
    case UPDATESUMMARY_DETAIL_SUCCESS:
      return { loading: false, success: true, summary: action.payload };
    case UPDATESUMMARY_DETAIL_FAIL:
      return { loading: false, error: action.payload };
    case UPDATESUMMARY_DETAIL_RESET:
      return {};
    default:
      return state;
  }
};

export const doctorPrescriptionListReducer = (
  state = { docprescriptions: [] },
  action
) => {
  switch (action.type) {
    case DOCTORPRESCRIPTION_LIST_REQUEST:
      return { loading: true };
    case DOCTORPRESCRIPTION_LIST_SUCCESS:
      return { loading: false, docprescriptions: action.payload };
    case DOCTORPRESCRIPTION_LIST_FAIL:
      return { loading: false, error: action.payload };
    case DOCTORPRESCRIPTION_LIST_RESET:
      return {};
    default:
      return state;
  }
};

export const updatePrescriptionDetailReducer = (state = {}, action) => {
  switch (action.type) {
    case UPDATEPRESCRIPTION_DETAIL_REQUEST:
      return { loading: true };
    case UPDATEPRESCRIPTION_DETAIL_SUCCESS:
      return { loading: false, success: true, prescription: action.payload };
    case UPDATEPRESCRIPTION_DETAIL_FAIL:
      return { loading: false, error: action.payload };
    case UPDATEPRESCRIPTION_DETAIL_RESET:
      return {};
    default:
      return state;
  }
};

export const updateReferralDetailReducer = (state = {}, action) => {
  switch (action.type) {
    case UPDATEREFERRAL_DETAIL_REQUEST:
      return { loading: true };
    case UPDATEREFERRAL_DETAIL_SUCCESS:
      return { loading: false, success: true, referral: action.payload };
    case UPDATEREFERRAL_DETAIL_FAIL:
      return { loading: false, error: action.payload };
    case UPDATEREFERRAL_DETAIL_RESET:
      return {};
    default:
      return state;
  }
};


export const doctorPasswordResetReducer = (state = {}, action) => {
  switch (action.type) {
    case DOCTOR_PASSWORDRESET_REQUEST:
      return { loading: true };
    case DOCTOR_PASSWORDRESET_SUCCESS:
      return { loading: false, success: true, pwupdate: action.payload };
    case DOCTOR_PASSWORDRESET_FAIL:
      return { loading: false, error: action.payload };
    case DOCTOR_PASSWORDRESET_RESET:
      return {};
    default:
      return state;
  }
};

export const doctorNewPasswordReducer = (state = {}, action) => {
  switch (action.type) {
    case DOCTOR_NEWPASSWORD_REQUEST:
      return { loading: true };
    case DOCTOR_NEWPASSWORD_SUCCESS:
      return { loading: false, success: true, pwupdate: action.payload };
    case DOCTOR_NEWPASSWORD_FAIL:
      return { loading: false, error: action.payload };
    case DOCTOR_NEWPASSWORD_RESET:
      return {};
    default:
      return state;
  }
};

export const createConsultationReferralReducer = (state = {}, action) => {
  switch (action.type) {
    case CREATECONSULTATION_REFERRAL_REQUEST:
      return { loading: true };
    case CREATECONSULTATION_REFERRAL_SUCCESS:
      return { loading: false, success: true, referral: action.payload };
    case CREATECONSULTATION_REFERRAL_FAIL:
      return { loading: false, error: action.payload };
    case CREATECONSULTATION_REFERRAL_RESET:
      return {};
    default:
      return state;
  }
};

export const consultReferralListReducer = (
  state = { referrals: [] },
  action
) => {
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

export const referralDetailReducer = (state = {}, action) => {
  switch (action.type) {
    case REFERRAL_DETAIL_REQUEST:
      return { loading: true };
    case REFERRAL_DETAIL_SUCCESS:
      return { loading: false, success: true, referral: action.payload };
    case REFERRAL_DETAIL_FAIL:
      return { loading: false, error: action.payload };
    case REFERRAL_DETAIL_RESET:
      return {};
    default:
      return state;
  }
};

export const addAcctReducer = (state = {}, action) => {
  switch (action.type) {
    case ADD_ACCT_REQUEST:
      return { loading: true };
    case ADD_ACCT_SUCCESS:
      return { loading: false, success: true, acct: action.payload };
    case ADD_ACCT_FAIL:
      return { loading: false, error: action.payload };
    case ADD_ACCT_RESET:
      return {};
    default:
      return state;
  }
};

export const getAcctListReducer = (state = { accts: [] }, action) => {
  switch (action.type) {
    case GET_ACCTLIST_REQUEST:
      return { loading: true };
    case GET_ACCTLIST_SUCCESS:
      return { loading: false, accts: action.payload };
    case GET_ACCTLIST_FAIL:
      return { loading: false, error: action.payload };
    case GET_ACCTLIST_RESET:
      return {};
    default:
      return state;
  }
};

export const AcctListOpenAccessReducer = (state = { accts: [] }, action) => {
  switch (action.type) {
    case ACCTLIST_OPENACCESS_REQUEST:
      return { loading: true };
    case ACCTLIST_OPENACCESS_SUCCESS:
      return { loading: false, accts: action.payload };
    case ACCTLIST_OPENACCESS_FAIL:
      return { loading: false, error: action.payload };
    case ACCTLIST_OPENACCESS_RESET:
      return {};
    default:
      return state;
  }
};

export const getAcctReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_ACCTDETAIL_REQUEST:
      return { loading: true };
    case GET_ACCTDETAIL_SUCCESS:
      return { loading: false, acct: action.payload };
    case GET_ACCTDETAIL_FAIL:
      return { loading: false, error: action.payload };
    case GET_ACCTDETAIL_RESET:
      return {};
    default:
      return state;
  }
};

export const updateAcctReducer = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_ACCTDETAIL_REQUEST:
      return { loading: true };
    case UPDATE_ACCTDETAIL_SUCCESS:
      return { loading: false, success: true, updatedAcct: action.payload };
    case UPDATE_ACCTDETAIL_FAIL:
      return { loading: false, error: action.payload };
    case UPDATE_ACCTDETAIL_RESET:
      return {};
    default:
      return state;
  }
};

export const deleteAcctReducer = (state = {}, action) => {
  switch (action.type) {
    case DELETE_ACCT_REQUEST:
      return { loading: true };
    case DELETE_ACCT_SUCCESS:
      return { loading: false, success: true };
    case DELETE_ACCT_FAIL:
      return { loading: false, error: action.payload };
    case DELETE_ACCT_RESET:
      return {};
    default:
      return state;
  }
};

export const changePasswordReducer = (state = {}, action) => {
  switch (action.type) {
    case CHANGE_PASSWORD_REQUEST:
      return { loading: true };
    case CHANGE_PASSWORD_SUCCESS:
      return { loading: false, success: true, pw: action.payload };
    case CHANGE_PASSWORD_FAIL:
      return { loading: false, error: action.payload };
    case CHANGE_PASSWORD_RESET:
      return {};
    default:
      return state;
  }
};

export const updateDocumentReducer = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_DOCUMENT_REQUEST:
      return { loading: true };
    case UPDATE_DOCUMENT_SUCCESS:
      return { loading: false, success: true, document: action.payload };
    case UPDATE_DOCUMENT_FAIL:
      return { loading: false, error: action.payload };
    case UPDATE_DOCUMENT_RESET:
      return {};
    default:
      return state;
  }
};
