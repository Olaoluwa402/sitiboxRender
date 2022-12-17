import {
    REG_STEP1_SUCCESS,
    REG_EMAILSTATUS_SUCCESS,
    REG_STEP1_FAIL,
    REG_STEP2,
    REG_STEP3,
    CLEAR_EMAIL_STATUS,
    CLEAR_PW_STATUS
} from "../constants/regStepConstants";

export const initiateRegistrationStepsReducer = (state = {emailStatus:{} }, action) => {
    switch (action.type) {
        case REG_STEP1_SUCCESS:
            const item = action.payload;
            return {
                ...state,
                addData1: item,
            };
        case REG_EMAILSTATUS_SUCCESS:
                return {
                    ...state,
                    emailStatus: action.payload,
                };

        case REG_STEP1_FAIL:
            return { loading: false, error: action.payload };

        case REG_STEP2:
            return {
                ...state,
                addData2: action.payload
            };

        case REG_STEP3:
            return {
                ...state,
                addData3: action.payload,
            };
        case CLEAR_EMAIL_STATUS:
            return {
                ...state,
                emailStatus: {}
            }
        case CLEAR_PW_STATUS:
            return {};
        default:
            return state;
    }
};