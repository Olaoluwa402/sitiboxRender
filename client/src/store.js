import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

import {
  patientLoginReducer,
  patientRegisterReducer,
  patientConfirmRegisterReducer,
  patientDetailsReducer,
  patientUpdateProfileReducer,
  patientPrescriptionListReducer,
  patientReceiptListReducer,
  receiptDetailReducer,
  prescriptionDetailReducer,
  patientPhoneVerifyReducer,
  patientPhoneCodeVerifyReducer,
  passwordResetReducer,
  newPasswordReducer,
  consultationReferralListReducer,
  getDoctorByInviteIdReducer,
  resendMailPatientReducer,
  sendReminderReducer,
  PatientchangePasswordReducer,
  PatientupdateDocumentReducer,
} from "./reducers/patientReducers";

import {
  getBalanceReducer, 
  fundWalletReducer, 
  verifyFundReducer, 
  walletTransactionsReducer, 
  bankVerifyReducer,
  getBanksReducer,
  createRecipientReducer
} from './reducers/walletReducer'

import {
  doctorLoginReducer,
  doctorRegisterReducer,
  doctorListReducer,
  doctorDetailsReducer,
  doctorProfileReducer,
  docPhoneVerifyReducer,
  docPhoneCodeVerifyReducer,
  sendPrescriptionReducer,
  doctorPrescriptionListReducer,
  updatePrescriptionDetailReducer,
  doctorUpdateProfileReducer,
  doctorPasswordResetReducer,
  doctorNewPasswordReducer,
  createConsultationSummaryReducer,
  consultationSummaryListReducer,
  summaryDetailReducer,
  updateSummaryDetailReducer,
  chatConsultationSummaryListReducer,
  createConsultationReferralReducer,
  consultReferralListReducer,
  referralDetailReducer,
  updateReferralDetailReducer,
  doctorConfirmRegisterReducer,
  resendMailReducer,
  addAcctReducer,
  getAcctListReducer,
  AcctListOpenAccessReducer,
  getAcctReducer,
  updateAcctReducer,
  deleteAcctReducer,
  changePasswordReducer,
  updateDocumentReducer,
} from "./reducers/doctorReducers";

import {
  adminLoginReducer,
  allReceiptsListReducer,
  allPrescriptionsListReducer,
  allPatientsListReducer,
  allDoctorsListReducer,
  doctorAdminDetailReducer,
  patientAdminDetailReducer,
  doctorDeleteReducer,
  patientDeleteReducer,
  doctorVerifyReducer,
  reviewListReducer,
  approveReviewReducer,
  deleteReviewReducer,
  generatePromoCodeReducer,
  getPromoCodesReducer,
  deletePromoCodeReducer,
  consultationSummaryListAdminReducer,
  allReferralListReducer,
  contactMailReducer,
  sendMailToAllReducer,
  sendSmsToAllReducer,
} from "./reducers/adminReducers";

import { initiateRegistrationStepsReducer } from "./reducers/regStepReducer";

import { initiateReducer } from "./reducers/initiateReducers";

import {
  orderCreateReducer,
  orderDetailsReducer,
  orderPayReducer,
  orderDeliverReducer,
  orderListMyReducer,
  orderListReducer,
  verifyPaystackReducer,
  doctorConsultationRequestsReducer,
  allConsultationRequestsReducer,
  sendSmsReducer,
  orderSendReceiptReducer,
  doctorReviewCreateReducer,
  doctorHasBeenPaidReducer,
  getPromoCodeReducer,
} from "./reducers/orderReducers";

import { chatReducer } from "./reducers/chatReducers";

const reducer = combineReducers({
  patientLogin: patientLoginReducer,
  patientRegister: patientRegisterReducer,
  patientConfirmRegister: patientConfirmRegisterReducer,
  patientDetails: patientDetailsReducer,
  patientUpdateProfile: patientUpdateProfileReducer,
  patientPhoneVerify: patientPhoneVerifyReducer,
  patientPhoneCodeVerify: patientPhoneCodeVerifyReducer,
  myprescriptionList: patientPrescriptionListReducer,
  myreceiptList: patientReceiptListReducer,
  myreceiptDetail: receiptDetailReducer,
  myprescriptionDetail: prescriptionDetailReducer,
  resetPassword: passwordResetReducer,
  passwordNew: newPasswordReducer,
  patientReferrals: consultationReferralListReducer,
  getDoctorInviteId: getDoctorByInviteIdReducer,
  mailSentPatient: resendMailPatientReducer,
  reminderSms: sendReminderReducer,
  patientUpdatePassword: PatientchangePasswordReducer,
  PatientUpdateDocument: PatientupdateDocumentReducer,

  adminLogin: adminLoginReducer,
  allReceipts: allReceiptsListReducer,
  allPatients: allPatientsListReducer,
  allDoctors: allDoctorsListReducer,
  adminDoctorDetail: doctorAdminDetailReducer,
  adminPatientDetail: patientAdminDetailReducer,
  doctorDelete: doctorDeleteReducer,
  patientDelete: patientDeleteReducer,
  doctorVerify: doctorVerifyReducer,
  reviewList: reviewListReducer,
  approveReview: approveReviewReducer,
  deleteReview: deleteReviewReducer,
  newpromocode: generatePromoCodeReducer,
  procodeList: getPromoCodesReducer,
  promocodeDelete: deletePromoCodeReducer,
  consultationSummaryListAdmin: consultationSummaryListAdminReducer,
  allReferrals: allReferralListReducer,
  contactMail: contactMailReducer,
  sendMailToAll: sendMailToAllReducer,
  sendSmsToAll: sendSmsToAllReducer,

  doctorLogin: doctorLoginReducer,
  doctorRegister: doctorRegisterReducer,
  doctorConfirmRegister: doctorConfirmRegisterReducer,
  doctorList: doctorListReducer,
  doctorDetails: doctorDetailsReducer,
  doctorProfile: doctorProfileReducer,
  docPhoneVerify: docPhoneVerifyReducer,
  docPhoneCodeVerify: docPhoneCodeVerifyReducer,
  addAcct: addAcctReducer,
  getAccts: getAcctListReducer,
  acctsNumber: AcctListOpenAccessReducer,
  getAcct: getAcctReducer,
  updateAcct: updateAcctReducer,
  acctDelete: deleteAcctReducer,
  sendPrescript: sendPrescriptionReducer,
  docprescriptionList: doctorPrescriptionListReducer,
  allPrescriptions: allPrescriptionsListReducer,
  updatePrescriptionDetail:updatePrescriptionDetailReducer,
  doctorUpdateProfile: doctorUpdateProfileReducer,
  doctorResetPassword: doctorPasswordResetReducer,
  doctorPasswordNew: doctorNewPasswordReducer,
  consultationSummary: createConsultationSummaryReducer,
  consultationReferral: createConsultationReferralReducer,
  docReferralList: consultReferralListReducer,
  referralDetail: referralDetailReducer,
  updateReferralDetail:updateReferralDetailReducer,
  listConsultationSummary: consultationSummaryListReducer,
  summaryDetail: summaryDetailReducer,
  updateSummaryDetail: updateSummaryDetailReducer,
  chatConsultationSummaries: chatConsultationSummaryListReducer,
  mailSentDoctor: resendMailReducer,
  changePassword: changePasswordReducer,
  updateDocument: updateDocumentReducer,

  initiateRegSteps: initiateRegistrationStepsReducer,
  initiate: initiateReducer,

  orderCreate: orderCreateReducer,
  orderDetails: orderDetailsReducer,
  orderPay: orderPayReducer,
  orderDeliver: orderDeliverReducer,
  doctorIsPaid: doctorHasBeenPaidReducer,
  orderListMy: orderListMyReducer,
  orderList: orderListReducer,
  verifyPaystack: verifyPaystackReducer,
  doctorConsultationRequests: doctorConsultationRequestsReducer,
  allConsultationRequests: allConsultationRequestsReducer,
  sendSms: sendSmsReducer,
  sendOrderReceipt: orderSendReceiptReducer,
  doctorReviewCreate: doctorReviewCreateReducer,
  codepromo: getPromoCodeReducer,

  chat: chatReducer,

  walletBalance: getBalanceReducer,
  walletFund:fundWalletReducer,
  verifyFundWallet:verifyFundReducer,
  walletTransactions:walletTransactionsReducer,
  bankVerify:bankVerifyReducer,
  getBanks:getBanksReducer,
  createRecipient:createRecipientReducer,
  // chatroomCreate: createChatroomReducer
});

const initiateItemFromStorage = localStorage.getItem("initiateItem")
  ? JSON.parse(localStorage.getItem("initiateItem"))
  : {};

const phoneverifyDataFromStorage = localStorage.getItem("phoneVerifyInfo")
  ? JSON.parse(localStorage.getItem("phoneVerifyInfo"))
  : null;

const addComplaintFromStorage = localStorage.getItem("addComplaint")
  ? JSON.parse(localStorage.getItem("addComplaint"))
  : {};

const patientInfoFromStorage = localStorage.getItem("patientInfo")
  ? JSON.parse(localStorage.getItem("patientInfo"))
  : null;

const doctorInfoFromStorage = localStorage.getItem("doctorInfo")
  ? JSON.parse(localStorage.getItem("doctorInfo"))
  : null;

const adminInfoFromStorage = localStorage.getItem("adminInfo")
  ? JSON.parse(localStorage.getItem("adminInfo"))
  : null;

const addData1FromStorage = localStorage.getItem("addData1")
  ? JSON.parse(localStorage.getItem("addData1"))
  : null;

const addData2FromStorage = localStorage.getItem("addData2")
  ? JSON.parse(localStorage.getItem("addData2"))
  : null;

const addData3FromStorage = localStorage.getItem("addData3")
  ? JSON.parse(localStorage.getItem("addData3"))
  : null;

const initialState = {
  initiate: {
    initiateItem: initiateItemFromStorage,
    addComplaint: addComplaintFromStorage,
  },
  initiateRegSteps: {
    addData1: addData1FromStorage,
    addData2: addData2FromStorage,
    addData3: addData3FromStorage,
  },
  patientLogin: { patientInfo: patientInfoFromStorage },
  doctorLogin: { doctorInfo: doctorInfoFromStorage },
  adminLogin: { adminInfo: adminInfoFromStorage },

  docPhoneVerify: { phoneVerifyInfo: phoneverifyDataFromStorage },
};

const middleware = [thunk];

const devTools =
  process.env.NODE_ENV === "production"
    ? applyMiddleware(...middleware)
    : composeWithDevTools(applyMiddleware(...middleware));

const store = createStore(reducer, initialState, devTools);

export default store;
