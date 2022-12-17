import {
    INITIATE_ADD_DOCTORSUCCESS,
    INITIATE_ADD_DOCTORFAIL,
    INITIATE_ADD_COMPLAINT,
    INITIATE_SAVE_PAYMENT_METHOD,
    INITIATE_CLEAR_ITEMS
} from "../constants/initiateConstants";

export const initiateReducer = (state = { initiateItem: {} }, action) => {
    switch (action.type) {
        case INITIATE_ADD_DOCTORSUCCESS:
            const item = action.payload;
            return {
                ...state,
                initiateItem: item,
            };

        case INITIATE_ADD_DOCTORFAIL:
            return { loading: false, error: action.payload };

        case INITIATE_ADD_COMPLAINT:
            return {
                ...state,
                addComplaint: action.payload
            };

        case INITIATE_SAVE_PAYMENT_METHOD:
            return {
                ...state,
                paymentMethod: action.payload,
            };
        case INITIATE_CLEAR_ITEMS:
            return {
                ...state,
                initiateItem: {},
            };

        default:
            return state;
    }
};