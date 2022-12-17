import {
    PATIENT_LOGIN_REQUEST,
    PATIENT_LOGIN_SUCCESS,
    PATIENT_MAILNOT_VERIFIED,
    PATIENT_LOGIN_FAIL,
    PATIENT_LOGOUT,
    PATIENT_REGISTER_REQUEST,
    PATIENT_REGISTER_SUCCESS,
    PATIENT_REGISTER_FAIL,
    PATIENT_REGISTER_RESET,
    PATIENT_DETAILS_REQUEST,
    PATIENT_DETAILS_SUCCESS,
    PATIENT_DETAILS_FAIL, 
    PATIENT_UPDATE_PROFILE_REQUEST,
    PATIENT_UPDATE_PROFILE_SUCCESS,
    PATIENT_UPDATE_PROFILE_FAIL,
    PATIENT_UPDATE_PROFILE_RESET,
    PATIENTPRESCRIPTION_LIST_REQUEST,
    PATIENTPRESCRIPTION_LIST_SUCCESS,
    PATIENTPRESCRIPTION_LIST_FAIL,
    PATIENTPRESCRIPTION_LIST_RESET,
    PRESCRIPTION_DETAIL_REQUEST,
    PRESCRIPTION_DETAIL_SUCCESS,
    PRESCRIPTION_DETAIL_FAIL,
    PRESCRIPTION_DETAIL_RESET,
    PATIENTRECEIPT_LIST_REQUEST,
    PATIENTRECEIPT_LIST_SUCCESS,
    PATIENTRECEIPT_LIST_FAIL,
    PATIENTRECEIPT_LIST_RESET,
    RECEIPT_DETAIL_REQUEST,
    RECEIPT_DETAIL_SUCCESS,
    RECEIPT_DETAIL_FAIL,
    RECEIPT_DETAIL_RESET,
    PATIENTPHONEVERIFY_SUCCESS,
    PATIENTPHONEVERIFY_FAIL,
    PATIENTPHONECODEVERIFY_REQUEST,
    PATIENTPHONECODEVERIFY_SUCCESS,
    PATIENTPHONECODEVERIFY_FAIL,
    PATIENTPHONECODEVERIFY_RESET,
    PATIENT_PASSWORDRESET_REQUEST,
    PATIENT_PASSWORDRESET_SUCCESS,
    PATIENT_PASSWORDRESET_FAIL,
    PATIENT_PASSWORDRESET_RESET,
    PATIENT_NEWPASSWORD_REQUEST,
    PATIENT_NEWPASSWORD_SUCCESS,
    PATIENT_NEWPASSWORD_FAIL,
    PATIENT_NEWPASSWORD_RESET,
    PATIENT_CONFIRM_REGISTER_REQUEST,
    PATIENT_CONFIRM_REGISTER_SUCCESS,
    PATIENT_CONFIRM_REGISTER_FAIL,
    REFERRAL_LIST_REQUEST,
    REFERRAL_LIST_SUCCESS, 
    REFERRAL_LIST_FAIL,
    REFERRAL_LIST_RESET,
   GET_DOCTOR_BY_INVITEID_REQUEST,
    GET_DOCTOR_BY_INVITEID_SUCCESS,
    GET_DOCTOR_BY_INVITEID_FAIL,
    GET_DOCTOR_BY_INVITEID_RESET,
    RESENDMAIL_REQUEST,
    RESENDMAIL_SUCCESS,
    RESENDMAIL_FAIL,
    SEND_REMINDER_REQUEST,
    SEND_REMINDER_SUCCESS,
    SEND_REMINDER_FAIL,
    SEND_REMINDER_RESET,
    CHANGE_PASSWORD_REQUEST,
    CHANGE_PASSWORD_SUCCESS,
    CHANGE_PASSWORD_FAIL,
    CHANGE_PASSWORD_RESET,
    UPDATE_DOCUMENT_REQUEST,
    UPDATE_DOCUMENT_SUCCESS,
    UPDATE_DOCUMENT_FAIL,
    UPDATE_DOCUMENT_RESET
} from "../constants/patientConstants";

export const patientLoginReducer = (state = {}, action) => {
    switch (action.type) {
        case PATIENT_LOGIN_REQUEST:
            return { loading: true };
        case PATIENT_LOGIN_SUCCESS:
            return { loading: false, patientInfo: action.payload };
        case PATIENT_MAILNOT_VERIFIED:
            return {loading:false, mailDetail:action.payload}
        case PATIENT_LOGIN_FAIL:
            return { loading: false, error: action.payload };
        case PATIENT_LOGOUT:
            return {};
        default:
            return state;
    }
};

export const patientRegisterReducer = (state = {}, action) => {
    switch (action.type) {
        case PATIENT_REGISTER_REQUEST:
            return { loading: true };
        case PATIENT_REGISTER_SUCCESS:
            return { loading: false, success: true, register: action.payload };
        case PATIENT_REGISTER_FAIL:
            return { loading: false, error: action.payload };
        case PATIENT_REGISTER_RESET:
            return {};
        default:
            return state; 
    }
};

export const resendMailPatientReducer = (state = {}, action) => {
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

export const patientConfirmRegisterReducer = (state = {}, action) => {
    switch (action.type) {
        case PATIENT_CONFIRM_REGISTER_REQUEST:
            return { loading: true };
        case PATIENT_CONFIRM_REGISTER_SUCCESS:
            return { loading: false, success: true, patientInfo: action.payload };
        case PATIENT_CONFIRM_REGISTER_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const patientDetailsReducer = (state = { patient: {} }, action) => {
    switch (action.type) {
        case PATIENT_DETAILS_REQUEST:
            return { ...state, loading: true };
        case PATIENT_DETAILS_SUCCESS:
            return { loading: false, patient: action.payload };
        case PATIENT_DETAILS_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state; 
    }
};

export const patientPhoneVerifyReducer = (state = {}, action) => {
    switch (action.type) {
        case PATIENTPHONEVERIFY_SUCCESS:
            return { loading: false, success: true, patientPhoneVerifyInfo: action.payload };
        case PATIENTPHONEVERIFY_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const patientPhoneCodeVerifyReducer = (state = {}, action) => {
    switch (action.type) {
        case PATIENTPHONECODEVERIFY_REQUEST:
            return { loading: true }
        case PATIENTPHONECODEVERIFY_SUCCESS:
            return { loading: false, success: true, patientPhoneVerifyCodeInfo: action.payload };
        case PATIENTPHONECODEVERIFY_FAIL:
            return { loading: false, error: action.payload };
        case PATIENTPHONECODEVERIFY_RESET:
            return {};
        default:
            return state;
    } 
};


export const patientUpdateProfileReducer = (state = {}, action) => {
    switch (action.type) {
        case PATIENT_UPDATE_PROFILE_REQUEST:
            return { loading: true };
        case PATIENT_UPDATE_PROFILE_SUCCESS:
            return { loading: false, success: true, patientInfo: action.payload };
        case PATIENT_UPDATE_PROFILE_FAIL:
            return { loading: false, error: action.payload };
        case PATIENT_UPDATE_PROFILE_RESET:
            return {};
        default:
            return state;
    }
};
 
export const passwordResetReducer = (state = {}, action) => {
    switch (action.type) {
        case PATIENT_PASSWORDRESET_REQUEST:
            return { loading: true };
        case PATIENT_PASSWORDRESET_SUCCESS:
            return { loading: false, success: true, pwupdate: action.payload };
        case PATIENT_PASSWORDRESET_FAIL:
            return { loading: false, error: action.payload };
        case PATIENT_PASSWORDRESET_RESET:
            return {};
        default:
            return state;
    }
};

export const newPasswordReducer = (state = {}, action) => {
    switch (action.type) {
        case PATIENT_NEWPASSWORD_REQUEST:
            return { loading: true };
        case PATIENT_NEWPASSWORD_SUCCESS:
            return { loading: false, success: true, pwupdate: action.payload };
        case PATIENT_NEWPASSWORD_FAIL:
            return { loading: false, error: action.payload };
        case PATIENT_NEWPASSWORD_RESET:
            return {};
        default:
            return state;
    }
};

export const patientPrescriptionListReducer = (state = { prescriptions: [] }, action) => {
    switch (action.type) {
        case PATIENTPRESCRIPTION_LIST_REQUEST:
            return { loading: true };
        case PATIENTPRESCRIPTION_LIST_SUCCESS:
            return { loading: false, prescriptions: action.payload };
        case PATIENTPRESCRIPTION_LIST_FAIL:
            return { loading: false, error: action.payload };
        case PATIENTPRESCRIPTION_LIST_RESET:
            return {};
        default:
            return state;
    }
};

export const patientReceiptListReducer = (state = { receipts: [] }, action) => {
    switch (action.type) {
        case PATIENTRECEIPT_LIST_REQUEST:
            return { loading: true };
        case PATIENTRECEIPT_LIST_SUCCESS:
            return { loading: false, receipts: action.payload };
        case PATIENTRECEIPT_LIST_FAIL:
            return { loading: false, error: action.payload };
        case PATIENTRECEIPT_LIST_RESET:
            return {};
        default:
            return state;
    }
};

export const receiptDetailReducer = (state = {}, action) => {
    switch (action.type) {
        case RECEIPT_DETAIL_REQUEST:
            return { loading: true };
        case RECEIPT_DETAIL_SUCCESS:
            return { loading: false, success: true, receipt: action.payload };
        case RECEIPT_DETAIL_FAIL:
            return { loading: false, error: action.payload };
        case RECEIPT_DETAIL_RESET:
            return {};
        default:
            return state;
    }
};

export const prescriptionDetailReducer = (state = {}, action) => {
    switch (action.type) {
        case PRESCRIPTION_DETAIL_REQUEST:
            return { loading: true };
        case PRESCRIPTION_DETAIL_SUCCESS:
            return { loading: false, success: true, prescription: action.payload };
        case PRESCRIPTION_DETAIL_FAIL:
            return { loading: false, error: action.payload };
        case PRESCRIPTION_DETAIL_RESET:
            return {};
        default:
            return state;
    }
};

export const consultationReferralListReducer = (state = { referrals: [] }, action) => {
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

export const getDoctorByInviteIdReducer = (state = {}, action) =>{
    switch (action.type){
        case GET_DOCTOR_BY_INVITEID_REQUEST:
            return {loading:true};
        case GET_DOCTOR_BY_INVITEID_SUCCESS:
            return {loading: false, success: true, doctor: action.payload}
        case GET_DOCTOR_BY_INVITEID_FAIL:
            return{loading: false, error:action.payload};
        case GET_DOCTOR_BY_INVITEID_RESET:
            return {};
        default:
            return state;
    }
}

export const sendReminderReducer = (state = {}, action) =>{
    switch (action.type){
        case SEND_REMINDER_REQUEST:
            return {loading:true};
        case SEND_REMINDER_SUCCESS:
            return {loading: false, reminder: action.payload}
        case SEND_REMINDER_FAIL:
            return{loading: false, error:action.payload};
        case SEND_REMINDER_RESET:
            return {};
        default:
            return state;
    }
}

export const PatientchangePasswordReducer = (state = {}, action) => {
    switch (action.type) {
        case  CHANGE_PASSWORD_REQUEST:
            return { loading: true };
        case  CHANGE_PASSWORD_SUCCESS:
            return { loading: false, success: true, pw:action.payload };
        case  CHANGE_PASSWORD_FAIL:
            return { loading: false, error: action.payload };
        case  CHANGE_PASSWORD_RESET:
            return {};
        default:
            return state;
    }
};

export const PatientupdateDocumentReducer = (state = {}, action) => {
    switch (action.type) {
        case  UPDATE_DOCUMENT_REQUEST:
            return { loading: true };
        case  UPDATE_DOCUMENT_SUCCESS:
            return { loading: false, success: true, document:action.payload };
        case  UPDATE_DOCUMENT_FAIL:
            return { loading: false, error: action.payload };
        case  UPDATE_DOCUMENT_RESET:
            return {};
        default:
            return state;
    }
};