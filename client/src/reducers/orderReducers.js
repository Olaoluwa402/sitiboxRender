import {
    CONSULTATIONORDER_CREATE_REQUEST,
    CONSULTATIONORDER_CREATE_SUCCESS,
    CONSULTATIONORDER_CREATE_FAIL,
    CONSULTATIONORDER_CREATE_RESET,
    CONSULTATIONORDER_DETAILS_FAIL,
    CONSULTATIONORDER_DETAILS_SUCCESS,
    CONSULTATIONORDER_DETAILS_REQUEST,
    CONSULTATIONORDER_PAY_REQUEST,
    CONSULTATIONORDER_PAY_FAIL,
    CONSULTATIONORDER_PAY_SUCCESS,
    CONSULTATIONORDER_PAY_RESET,
    CONSULTATIONORDER_LIST_MY_REQUEST,
    CONSULTATIONORDER_LIST_MY_SUCCESS,
    CONSULTATIONORDER_LIST_MY_FAIL,
    CONSULTATIONORDER_LIST_MY_RESET,
    CONSULTATIONORDER_LIST_FAIL,
    CONSULTATIONORDER_LIST_SUCCESS,
    CONSULTATIONORDER_LIST_REQUEST,
    CONSULTATIONORDER_DELIVER_FAIL,
    CONSULTATIONORDER_DELIVER_SUCCESS,
    CONSULTATIONORDER_DELIVER_REQUEST,
    CONSULTATIONORDER_DELIVER_RESET,
    VERIFY_PAYMENT_REQUEST,
    VERIFY_PAYMENT_SUCCESS,
    VERIFY_PAYMENT_FAIL,
    VERIFY_PAYMENT_RESET,
    LISTDOCTOR_CONSULTATION_REQUEST,
    LISTDOCTOR_CONSULTATION_SUCCESS,
    LISTDOCTOR_CONSULTATION_FAIL,
    LISTDOCTOR_CONSULTATION_RESET,
    LISTALL_CONSULTATION_REQUEST,
    LISTALL_CONSULTATION_SUCCESS,
    LISTALL_CONSULTATION_FAIL,
    LISTALL_CONSULTATION_RESET,
    SENDRECEIPT_REQUEST,
    SENDRECEIPT_SUCCESS,
    SENDRECEIPT_FAIL,
    SENDRECEIPT_RESET,
    SENDSMS_REQUEST,
    SENDSMS_SUCCESS,
    SENDSMS_FAIL,
    SENDSMS_RESET,
    DOCTOR_CREATE_REVIEW_REQUEST,
    DOCTOR_CREATE_REVIEW_SUCCESS,
    DOCTOR_CREATE_REVIEW_FAIL,
    DOCTOR_CREATE_REVIEW_RESET,
    DOCTORHASBEENPAID_REQUEST,
    DOCTORHASBEENPAID_SUCCESS,
    DOCTORHASBEENPAID_FAIL,
    DOCTORHASBEENPAID_RESET,
    PROMO_CODE_REQUEST,
    PROMO_CODE_SUCCESS,
    PROMO_CODE_FAIL,
    PROMO_CODE_RESET
} from "../constants/orderConstants";

export const orderCreateReducer = (state = {}, action) => {
    switch (action.type) {
        case CONSULTATIONORDER_CREATE_REQUEST:
            return {
                loading: true,
            };
        case CONSULTATIONORDER_CREATE_SUCCESS:
            return {
                loading: false,
                success: true,
                order: action.payload,
            };
        case CONSULTATIONORDER_CREATE_FAIL:
            return {
                loading: false,
                error: action.payload,
            };
        case CONSULTATIONORDER_CREATE_RESET:
            return {};
        default:
            return state;
    }
};

export const orderDetailsReducer = (
    state = { loading: true, orderItem: {}, shippingAddress: {} },
    action
) => {
    switch (action.type) {
        case CONSULTATIONORDER_DETAILS_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case CONSULTATIONORDER_DETAILS_SUCCESS:
            return {
                loading: false,
                order: action.payload,
            };
        case CONSULTATIONORDER_DETAILS_FAIL:
            return {
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};

export const orderPayReducer = (state = {}, action) => {
    switch (action.type) {
        case CONSULTATIONORDER_PAY_REQUEST:
            return {
                loading: true,
            };
        case CONSULTATIONORDER_PAY_SUCCESS:
            return {
                loading: false,
                success: true,
            };
        case CONSULTATIONORDER_PAY_FAIL:
            return {
                loading: false,
                error: action.payload,
            };
        case CONSULTATIONORDER_PAY_RESET:
            return {};
        default:
            return state;
    }
};


export const verifyPaystackReducer = (state = {}, action) => {
    switch (action.type) {
        case VERIFY_PAYMENT_REQUEST:
            return {
                loading: true,
            };
        case VERIFY_PAYMENT_SUCCESS:
            return {
                loading: false,
                success: true,
                paymentResult: action.payload,
            };
        case VERIFY_PAYMENT_FAIL:
            return {
                loading: false,
                error: action.payload,
            };
        case VERIFY_PAYMENT_RESET:
            return {};
        default:
            return state;
    }
};


export const sendSmsReducer = (state = {}, action) => {
    switch (action.type) {
        case SENDSMS_REQUEST:
            return {
                loading: true,
            };
        case SENDSMS_SUCCESS:
            return {
                loading: false,
                success: true,
            };
        case SENDSMS_FAIL:
            return {
                loading: false,
                error: action.payload,
            };
        case SENDSMS_RESET:
            return {};
        default:
            return state;
    }
};

export const orderSendReceiptReducer = (state = {}, action) => {
    switch (action.type) {
        case SENDRECEIPT_REQUEST:
            return {
                loading: true,
            };
        case SENDRECEIPT_SUCCESS:
            return {
                loading: false,
                success: true,
                receipt: action.payload 
            };
        case SENDRECEIPT_FAIL:
            return {
                loading: false,
                error: action.payload,
            };
        case SENDRECEIPT_RESET:
            return {};
        default:
            return state;
    }
};

export const orderListMyReducer = (state = { orders: [] }, action) => {
    switch (action.type) {
        case CONSULTATIONORDER_LIST_MY_REQUEST:
            return {
                loading: true,
            };
        case CONSULTATIONORDER_LIST_MY_SUCCESS:
            return {
                loading: false,
                orders: action.payload,
            };
        case CONSULTATIONORDER_LIST_MY_FAIL:
            return {
                loading: false,
                error: action.payload,
            };
        case CONSULTATIONORDER_LIST_MY_RESET:
            return { orders: [] };
        default:
            return state;
    }
};


// consultation orders for a particular doctor
export const doctorConsultationRequestsReducer = (state = { orders: [] }, action) => {
    switch (action.type) {
        case LISTDOCTOR_CONSULTATION_REQUEST:
            return {
                loading: true,
            };
        case LISTDOCTOR_CONSULTATION_SUCCESS:
            return {
                loading: false,
                orders: action.payload,
            };
        case LISTDOCTOR_CONSULTATION_FAIL:
            return {
                loading: false,
                error: action.payload,
            };
        case LISTDOCTOR_CONSULTATION_RESET:
            return { orders: [] };
        default:
            return state;
    }
};

// all consultation orders 
export const allConsultationRequestsReducer = (state = { orders: [] }, action) => {
    switch (action.type) {
        case LISTALL_CONSULTATION_REQUEST:
            return {
                loading: true,
            };
        case LISTALL_CONSULTATION_SUCCESS:
            return {
                loading: false,
                orders: action.payload,
            };
        case LISTALL_CONSULTATION_FAIL:
            return {
                loading: false,
                error: action.payload,
            };
        case LISTALL_CONSULTATION_RESET:
            return { orders: [] };
        default:
            return state;
    }
};

export const orderListReducer = (state = { orders: [] }, action) => {
    switch (action.type) {
        case CONSULTATIONORDER_LIST_REQUEST:
            return {
                loading: true,
            };
        case CONSULTATIONORDER_LIST_SUCCESS:
            return {
                loading: false,
                orders: action.payload,
            };
        case CONSULTATIONORDER_LIST_FAIL:
            return {
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};

export const orderDeliverReducer = (state = {}, action) => {
    switch (action.type) {
        case CONSULTATIONORDER_DELIVER_REQUEST:
            return {
                loading: true,
            };
        case CONSULTATIONORDER_DELIVER_SUCCESS:
            return {
                loading: false,
                success: true,
            };
        case CONSULTATIONORDER_DELIVER_FAIL:
            return {
                loading: false,
                error: action.payload, 
            };
        case CONSULTATIONORDER_DELIVER_RESET:
            return {};
        default:
            return state;
    }
};

export const doctorHasBeenPaidReducer = (state = {}, action) => {
    switch (action.type) {
        case DOCTORHASBEENPAID_REQUEST:
            return {
                loading: true,
            };
        case DOCTORHASBEENPAID_SUCCESS:
            return {
                loading: false,
                success: true,
            };
        case DOCTORHASBEENPAID_FAIL:
            return {
                loading: false,
                error: action.payload, 
            };
        case DOCTORHASBEENPAID_RESET:
            return {};
        default:
            return state;
    }
};


export const doctorReviewCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case DOCTOR_CREATE_REVIEW_REQUEST:
      return { loading: true };
    case DOCTOR_CREATE_REVIEW_SUCCESS:
      return { loading: false, success: true };
    case DOCTOR_CREATE_REVIEW_FAIL:
      return { loading: false, error: action.payload };
    case DOCTOR_CREATE_REVIEW_RESET:
      return {};
    default:
      return state;
  }
};

export const getPromoCodeReducer = (state = {}, action) => {
    switch (action.type) {
        case PROMO_CODE_REQUEST:
            return {
                loading: true,
            };
        case PROMO_CODE_SUCCESS:
            return {
                loading: false,
                success:true,
                mcode: action.payload,
            };
        case PROMO_CODE_FAIL:
            return {
                loading: false,
                error: action.payload,
            };
        case PROMO_CODE_RESET:
            return {};
        default:
            return state;
    }
};
