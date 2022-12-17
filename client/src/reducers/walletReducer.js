import {
    WALLET_BALANCE_REQUEST,
    WALLET_BALANCE_SUCCESS,
    WALLET_BALANCE_FAIL,
    WALLET_BALANCE_RESET,
    FUND_WALLET_REQUEST,
    FUND_WALLET_SUCCESS,
    FUND_WALLET_FAIL,
    FUND_WALLET_RESET,
    VERIFY_PAYSTACKFUND_REQUEST,
    VERIFY_PAYSTACKFUND_SUCCESS,
    VERIFY_PAYSTACKFUND_FAIL,
    VERIFY_PAYSTACKFUND_RESET,
    WALLET_TRANSACTIONS_REQUEST,
    WALLET_TRANSACTIONS_SUCCESS,
    WALLET_TRANSACTIONS_FAIL,
    WALLET_TRANSACTIONS_RESET,
    BANK_VERIFY_REQUEST,
    BANK_VERIFY_SUCCESS,
    BANK_VERIFY_FAIL,
    BANK_VERIFY_RESET,
    GET_BANKS_REQUEST,
    GET_BANKS_SUCCESS,
    GET_BANKS_FAIL,
    GET_BANKS_RESET,
    CREATE_RECIPIENT_REQUEST,
    CREATE_RECIPIENT_SUCCESS,
    CREATE_RECIPIENT_FAIL,
    CREATE_RECIPIENT_RESET,
} from '../constants/walletConstants' 

const getBalanceReducer = (state = {},action)=> {
    switch(action.type){
        case WALLET_BALANCE_REQUEST:
            return {loading:true}
        case WALLET_BALANCE_SUCCESS:
            return {loading:false, success:true,wallet: action.payload}
        case WALLET_BALANCE_FAIL:
            return { loading:false, error:action.payload}
        case WALLET_BALANCE_RESET:
            return {}
        default: 
            return state
    }
}

const fundWalletReducer = (state={}, action)=> {
    switch(action.type){
        case FUND_WALLET_REQUEST :
            return {loading:true}
        case FUND_WALLET_SUCCESS :
            return {loading:false, success:true, fund:action.payload}
        case FUND_WALLET_FAIL:
            return {loading:false, error:action.payload}
        case FUND_WALLET_RESET:
            return {}
        default:
            return state
    }
}

const verifyFundReducer = (state={}, action)=> {
    switch(action.type){
        case VERIFY_PAYSTACKFUND_REQUEST :
            return {loading:true}
        case VERIFY_PAYSTACKFUND_SUCCESS :
            return {loading:false, success:true, fund:action.payload}
        case VERIFY_PAYSTACKFUND_FAIL:
            return {loading:false, error:action.payload}
        case VERIFY_PAYSTACKFUND_RESET:
            return {}
        default:
            return state
    }
} 

const walletTransactionsReducer = (state={transactions:[]}, action)=> {
    switch(action.type){
        case WALLET_TRANSACTIONS_REQUEST :
            return {loading:true}
        case WALLET_TRANSACTIONS_SUCCESS :
            return {loading:false, success:true, transactions:action.payload}
        case WALLET_TRANSACTIONS_FAIL:
            return {loading:false, error:action.payload}
        case WALLET_TRANSACTIONS_RESET:
            return {}
        default:
            return state
    }
}

const bankVerifyReducer = (state={}, action)=> {
    switch(action.type){
        case BANK_VERIFY_REQUEST :
            return {loading:true}
        case BANK_VERIFY_SUCCESS :
            return {loading:false, success:true, verify:action.payload}
        case BANK_VERIFY_FAIL:
            return {loading:false, error:action.payload}
        case BANK_VERIFY_RESET:
            return {}
        default:
            return state
    }
} 

const getBanksReducer = (state={banks:[]}, action)=> {
    switch(action.type){
        case GET_BANKS_REQUEST :
            return {loading:true}
        case GET_BANKS_SUCCESS :
            return {loading:false, success:true, banks:action.payload}
        case GET_BANKS_FAIL:
            return {loading:false, error:action.payload}
        case GET_BANKS_RESET:
            return {}
        default:
            return state
    }
} 
const createRecipientReducer = (state={}, action)=> {
    switch(action.type){
        case CREATE_RECIPIENT_REQUEST :
            return {loading:true}
        case CREATE_RECIPIENT_SUCCESS :
            return {loading:false, success:true, recipient:action.payload}
        case CREATE_RECIPIENT_FAIL:
            return {loading:false, error:action.payload}
        case CREATE_RECIPIENT_RESET:
            return {}
        default:
            return state
    }
} 


export {
    getBalanceReducer,
    fundWalletReducer,
    verifyFundReducer,
    walletTransactionsReducer,
    bankVerifyReducer,
    getBanksReducer,
    createRecipientReducer
}