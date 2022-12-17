import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginScreen from "./screens/LoginScreens/LoginScreen/LoginScreen";
import FaqScreen from "./screens/FaqScreen/FaqScreen";
import Team from "./screens/Team/Team";
import AppGuideScreen from "./screens/AppGuideScreen/AppGuideScreen";
import TermConditionScreen from "./screens/TermConditionScreen/TermConditionScreen";
import PrivacyScreen from "./screens/PrivacyScreen/PrivacyScreen";
import WalletScreen from "./screens/WalletScreen/WalletScreen";
import FeedbackScreen from "./screens/FeedbackScreen/FeedbackScreen";
import GuideDownloadScreen from "./screens/GuideDownloadScreen/GuideDownloadScreen";
import ContactScreen from "./screens/ContactScreen/ContactScreen";
import ServicesScreen from "./screens/ServicesScreen/ServicesScreen";
import AboutScreen from "./screens/AboutScreen/AboutScreen";
import ResendMailScreen from "./screens/ResendMailScreen/ResendMailScreen";
import ForgotScreen from "./screens/LoginScreens/LoginScreen/ForgotScreen";
import ResetScreen from "./screens/LoginScreens/LoginScreen/ResetScreen";
import DoctorForgotScreen from "./screens/LoginScreens/DoctorLoginScreen/DoctorForgotScreen";
import DoctorResetScreen from "./screens/LoginScreens/DoctorLoginScreen/DoctorResetScreen";
import PatientRegisterScreen from "./screens/RegisterScreens/PatientRegisterScreen/PatientRegisterScreen";
import RegWelcomeScreen from "./screens/RegisterScreens/PatientRegisterScreen/RegWelcomeScreen";
import PatientConfirmRegisterScreen from "./screens/RegisterScreens/PatientRegisterScreen/PatientConfirmRegisterScreen";
import DoctorConfirmRegisterScreen from "./screens/RegisterScreens/DoctorRegisterScreen/DoctorConfirmRegisterScreen";
import RegScreenStep1 from "./screens/RegisterScreens/PatientRegisterScreen/step1";
import RegScreenStep2 from "./screens/RegisterScreens/PatientRegisterScreen/step2";
import RegScreenStep3 from "./screens/RegisterScreens/PatientRegisterScreen/step3";
import DocRegScreenStep1 from "./screens/RegisterScreens/DoctorRegisterScreen/step1";
import DocRegScreenStep2 from "./screens/RegisterScreens/DoctorRegisterScreen/step2";
import DocRegScreenStep3 from "./screens/RegisterScreens/DoctorRegisterScreen/step3";
import LandingScreen from "./screens/LandingScreen/LandingScreen";
import ConsultantsScreen from "./screens/ConsultantsScreen/ConsultantsScreen";
import DoctorLoginScreen from "./screens/LoginScreens/DoctorLoginScreen/DoctorLoginScreen";
import AdminLoginScreen from "./screens/LoginScreens/AdminLoginScreen/AdminLoginScreen";
import PatientLayout from "./components/PatientDashboard/Layout/Layout";
import DoctorLayout from "./components/DoctorDashboard/Layout/Layout";
import AdminLayout from "./components/AdminDashboard/Layout/Layout";
import ComplaintScreen from "./screens/ComplaintScreen/ComplaintScreen";
import DoctorPublicDetailScreen from "./screens/DoctorPublicDetail/DoctorPublicDetailScreen";
import PickADoctorScreen from "./screens/PickADoctorScreen/PickADoctorScreen";
import SelectedDoctorScreen from "./screens/SelectedDoctorScreen/SelectedDoctorScreen";
import RequestConsultationScreen from "./screens/RequestConsultationScreen/RequestConsultationScreen";
import OrderScreen from "./screens/OrderScreen/OrderScreen";
import PrescriptionScreen from "./screens/PrescriptionScreen/PrescriptionScreen";
import NewPrescriptionScreen from "./screens/PrescriptionScreen/NewPrescriptionScreen";
import EditPrescriptionScreen from "./screens/PrescriptionScreen/EditPrescriptionScreen";
import CreateConsultationSummaryScreen from "./screens/ConsultationSummaryScreen/CreateConsultationSummaryScreen";
import ConsultationSummaryListScreen from "./screens/ConsultationSummaryScreen/ConsultationSummaryListScreen";
import EditConsultationSummaryScreen from "./screens/ConsultationSummaryScreen/EditConsultationSummaryScreen";
import ChatConsultationSummaryListScreen from "./screens/ConsultationSummaryScreen/ChatConsultationSummaryListScreen";
import ConsultationSummaryScreen from "./screens/ConsultationSummaryScreen/ConsultationSummaryScreen";
import NewReferralScreen from "./screens/ReferralScreen/NewReferralScreen";
import EditReferralScreen from "./screens/ReferralScreen/EditReferralScreen";
import ReceiptScreen from "./screens/ReceiptScreen/ReceiptScreen";
import ChatScreen from "./screens/ChatScreen/ChatScreen";
import VideoCallScreen from "./screens/VideoCallScreen/VideoCallScreen";
import PhoneVerifyScreen from "./screens/PhoneVerifyScreen/PhoneVerifyScreen";
import PatientPhoneVerifyScreen from "./screens/PhoneVerifyScreen/PatientPhoneVerifyScreen";
import DoctorConsultationListScreen from "./screens/DoctorProfileScreen/DoctorConsultationListScreen";
import DoctorProfileScreen from "./screens/DoctorProfileScreen/DoctorProfileScreen";
import DoctorProfileUpdateScreen from "./screens/DoctorProfileScreen/DoctorProfileUpdateScreen";
import UpdateDocumentScreen from "./screens/DoctorProfileScreen/UpdateDocumentScreen";
import ChangePasswordScreen from "./screens/DoctorProfileScreen/ChangePasswordScreen";
import DoctorPrescriptionListScreen from "./screens/PrescriptionScreen/DoctorPrescriptionListScreen";
import PatientProfileScreen from "./screens/PatientProfileScreen/PatientProfileScreen";
import PatientDocumentUpdateScreen from "./screens/PatientProfileScreen/PatientDocumentUpdateScreen";
import PatientPasswordUpdateScreen from "./screens/PatientProfileScreen/PatientPasswordUpdateScreen";
import AdminDefaultScreen from "./screens/AdminDashboardScreen/AdminDefaultScreen";
import PatientsListScreen from "./screens/AdminDashboardScreen/PatientsListScreen";
import PromoCodeScreen from "./screens/AdminDashboardScreen/PromoCodeScreen/PromoCodeScreen";
import ConsultationSummaryListScreenAdmin from "./screens/AdminDashboardScreen/ConsultationSummaryListScreenAdmin/ConsultationSummaryListScreenAdmin";
import DoctorsListScreen from "./screens/AdminDashboardScreen/DoctorsListScreen";
import PatientDetailsScreen from "./screens/AdminDashboardScreen/PatientDetailsScreen";
import DoctorDetailsScreen from "./screens/AdminDashboardScreen/DoctorDetailsScreen";
import ReviewListScreen from "./screens/AdminDashboardScreen/ReviewListScreen";
import PatientConsultationListScreen from "./screens/PatientProfileScreen/PatientConsultationListScreen";
import PatientProfileUpdateScreen from "./screens/PatientProfileScreen/PatientProfileUpdateScreen";
import PatientPrescriptionListScreen from "./screens/PrescriptionScreen/PatientPrescriptionListScreen";
import PatientReceiptListScreen from "./screens/ReceiptScreen/PatientReceiptListScreen";
import AllReceiptsScreen from "./screens/ReceiptScreen/AllReceiptsScreen";
import DoctorReferralListScreen from "./screens/ReferralScreen/DoctorReferralListScreen";
import AllReferralScreen from "./screens/ReferralScreen/AllReferralScreen";
import PatientReferralListScreen from "./screens/ReferralScreen/PatientReferralListScreen";
import ReferralScreen from "./screens/ReferralScreen/ReferralScreen";
import AllPrescriptionsScreen from "./screens/PrescriptionScreen/AllPrescriptionsScreen";
import NotFoundScreen from "./screens/NotFoundScreen/NotFoundScreen";
import PaymentScreen from "./screens/PaymentScreen/PaymentScreen";
import PaymentDetailScreen from "./screens/PaymentDetailScreen/PaymentDetailScreen";
// import updatePaymentDetailScreen from "./screens/PaymentDetailScreen/updatePaymentDetailScreen";
import ReviewScreen from "./screens/ReviewScreen/ReviewScreen";
import EmailScreen from "./screens/AdminDashboardScreen/EmailScreen";
import SmsScreen from "./screens/AdminDashboardScreen/SmsScreen";
const Router = ({ doctorConnected, patientConnected }) => {
  return (
    <Routes>
      <Route path="/" element={<LandingScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/doclogin" element={<DoctorLoginScreen />} />
      <Route path="/adminlogin" element={<AdminLoginScreen />} />
      <Route path="/register" element={<RegScreenStep1 />} />
      <Route path="/regstep2" element={<RegScreenStep2 />} />
      <Route path="/regstep3" element={<RegScreenStep3 />} />
      <Route path="/docregister" element={<DocRegScreenStep1 />} />
      <Route path="/docregstep2" element={<DocRegScreenStep2 />} />
      <Route path="/docregstep3" element={<DocRegScreenStep3 />} />
      <Route path="/consultants" element={<ConsultantsScreen />} />
      <Route path="/complaint" element={<ComplaintScreen />} />
      <Route path="/pickdoctor" element={<PickADoctorScreen />} />
      <Route path="/request" element={<RequestConsultationScreen />} />
      <Route path="/resend-mail" element={<ResendMailScreen />} />
      <Route path="/forgotpw" element={<ForgotScreen />} />
      <Route path="/faq" element={<FaqScreen />} />
      <Route path="/feedback" element={<FeedbackScreen />} />
      <Route path="/privacy" element={<PrivacyScreen />} />
      <Route path="/terms" element={<TermConditionScreen />} />
      <Route path="/about" element={<AboutScreen />} />
      <Route path="/contact" element={<ContactScreen />} />
      <Route path="/sitibox-guide" element={<AppGuideScreen />} />
      <Route path="/services" element={<ServicesScreen />} />
      <Route path="/our-team" element={<Team />} />
      <Route path="/appguide" element={<GuideDownloadScreen />} />
      <Route path="/reg-welcome" element={<RegWelcomeScreen />} />
      <Route path="/dforgotpw" element={<DoctorForgotScreen />} />
      <Route
        path="/d-confirm-email/:token"
        element={<DoctorConfirmRegisterScreen />}
      />
      <Route path="/resetpw/:token" element={<ResetScreen />} />
      <Route path="/dresetpw/:token" element={<DoctorResetScreen />} />
      <Route
        path="/p-confirm-email/:token"
        element={<PatientConfirmRegisterScreen />}
      />
      <Route path="/pubdetail/:id" element={<DoctorPublicDetailScreen />} />
      <Route path="/consultation/:id" element={<SelectedDoctorScreen />} />

      <Route path="/not-found" element={<NotFoundScreen />} />

      <Route path="/admindashboard" element={<AdminLayout />}>
        <Route index element={<AdminDefaultScreen />} />
        <Route path="promocodes" element={<PromoCodeScreen />} />
        <Route path="email" element={<EmailScreen />} />
        <Route path="sms" element={<SmsScreen />} />
        <Route path="receipts" element={<AllReceiptsScreen />} />
        <Route path="prescriptions" element={<AllPrescriptionsScreen />} />
        <Route path="patients" element={<PatientsListScreen />} />
        <Route path="doctors" element={<DoctorsListScreen />} />
        <Route
          path="summaries"
          element={<ConsultationSummaryListScreenAdmin />}
        />
        <Route path="referrals" element={<AllReferralScreen />} />
        <Route path="order/:id" element={<OrderScreen />} />
        <Route path="receipt/:id" element={<ReceiptScreen />} />
        <Route path="patients/:id" element={<PatientDetailsScreen />} />
        <Route path="doctors/:id" element={<DoctorDetailsScreen />} />
        <Route path="summaries/:id" element={<ConsultationSummaryScreen />} />
        <Route path="referrals/:id" element={<ReferralScreen />} />
        <Route path="doctors/:id/reviews" element={<ReviewListScreen />} />
      </Route>

      <Route path="/dashboard" element={<PatientLayout />}>
        <Route index element={<PatientConsultationListScreen />} />
        <Route path="patientguide" element={<AppGuideScreen />} />
        <Route path="profile" element={<PatientProfileScreen />} />
        <Route path="profileupdate" element={<PatientProfileUpdateScreen />} />
        <Route path="document" element={<PatientDocumentUpdateScreen />} />
        <Route path="pw" element={<PatientPasswordUpdateScreen />} />
        <Route
          path="prescriptions"
          element={<PatientPrescriptionListScreen />}
        />
        <Route path="receipts" element={<PatientReceiptListScreen />} />
        <Route path="complaint" element={<ComplaintScreen />} />
        <Route path="referrals" element={<PatientReferralListScreen />} />
        <Route path="wallet" element={<WalletScreen />} />
        <Route path="chatroom" element={<ChatScreen />} />
        <Route path="videocall" element={<VideoCallScreen />} />
        <Route path="verifyphone" element={<PatientPhoneVerifyScreen />} />
        <Route path="doctor/:id/rating" element={<ReviewScreen />} />
        <Route path="prescription/:id" element={<PrescriptionScreen />} />
        <Route path="receipt/:id" element={<ReceiptScreen />} />
        <Route path="referrals/:id" element={<ReferralScreen />} />
        <Route path="order/:id" element={<OrderScreen />} />
      </Route>

      <Route path="/docdashboard" element={<DoctorLayout />}>
        <Route index element={<DoctorConsultationListScreen />} />
        <Route path="doctorguide" element={<AppGuideScreen />} />
        <Route path="doctorguide" element={<AppGuideScreen />} />
        <Route path="docprofile" element={<DoctorProfileScreen />} />
        <Route
          path="docprofileupdate"
          element={<DoctorProfileUpdateScreen />}
        />
        <Route path="wallet" element={<WalletScreen />} />
        <Route path="pw" element={<ChangePasswordScreen />} />
        <Route path="document" element={<UpdateDocumentScreen />} />
        <Route path="verifyphone" element={<PhoneVerifyScreen />} />
        <Route
          path="docprescriptions"
          element={<DoctorPrescriptionListScreen />}
        />
        <Route path="summaries" element={<ConsultationSummaryListScreen />} />
        <Route path="referrals" element={<DoctorReferralListScreen />} />
        <Route path="chatroom" element={<ChatScreen />} />
        <Route path="videocall" element={<VideoCallScreen />} />
        <Route path="records" element={<PaymentScreen />} />
        <Route path="paydetail" element={<PaymentDetailScreen />} />
        <Route path="paydetail/:id" element={<updatePaymentDetailScreen />} />
        <Route
          path="chatsummaries/:id"
          element={<ChatConsultationSummaryListScreen />}
        />
        <Route path="newprescription/:id" element={<NewPrescriptionScreen />} />
        <Route path="prescription/:id" element={<PrescriptionScreen />} />
        <Route
          path="newsummary/:id"
          element={<CreateConsultationSummaryScreen />}
        />
        <Route path="newreferral/:id" element={<NewReferralScreen />} />
        <Route path="summaries/:id" element={<ConsultationSummaryScreen />} />
        <Route
          path="summaries/:id/edit"
          element={<EditConsultationSummaryScreen />}
        />
        <Route
          path="prescription/:id/edit"
          element={<EditPrescriptionScreen />}
        />
        <Route path="referrals/:id" element={<ReferralScreen />} />
        <Route path="referrals/:id/edit" element={<EditReferralScreen />} />
        <Route path="order/:id" element={<OrderScreen />} />
        <Route path="referrals/:id/edit" element={<EditReferralScreen />} />
      </Route>

      <Route path="*" element={<Navigate to={"/not-found"} />} />
    </Routes>
  );
};

export default Router;
