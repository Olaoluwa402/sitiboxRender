import express from "express";
const router = express.Router();
// const router = express.Router({mergeParams: true});
import {
  authDoctor,
  checkEmailexist,
  registerDoctor,
  getDoctorProfile,
  updateDoctorProfile,
  getDoctors,
  getDoctorById,
  verifyDocPhone,
  verifyDocPhoneCode,
  newPrescription,
  getMyGeneratedPrescriptions,
  createProductReview,
  passwordReset,
  newPassword,
  newConsultationSummary,
  getMyGeneratedSummaries,
  getSummaryById,
  getChatSummaries,
  newConsultationReferral,
  getMyGeneratedReferrals,
  getreferralById,
  emailVerification,
  getDoctorByInviteId,
  resendMail,
  addAcctDetail,
  getAcctList,
  acctListOpenAccess,
  getAcctDetail,
  updateAcct,
  deleteAcct,
  updatepw,
  updateDocument,
  sendSmsReminder,
  updateSummaries,
  updatePrescription,
  updateReferral,
} from "../../controllers/userController/doctorController.js";
import {
  doctorProtect,
  patientProtect,
  csrfProtection,
} from "../../middleware/authMiddleware.js";

router.route("/").post(registerDoctor).get(getDoctors);
router.route("/login").post(authDoctor);
router.route("/docphoneverify").post(doctorProtect, verifyDocPhone);
router.route("/verifyphonecode").post(doctorProtect, verifyDocPhoneCode);
router.route("/email-verification").post(emailVerification);
router.route("/resendmail").post(resendMail);
router.route("/prescription").post(doctorProtect, newPrescription);
router.route("/summary").post(doctorProtect, newConsultationSummary);
router.route("/referral").post(doctorProtect, newConsultationReferral);
router.route("/prescriptions").get(doctorProtect, getMyGeneratedPrescriptions);
router.route("/referrals").get(doctorProtect, getMyGeneratedReferrals);
router.route("/summaries").get(doctorProtect, getMyGeneratedSummaries);
router.route("/passwordreset").post(passwordReset);
router.route("/newpassword").post(newPassword);
router.route("/pw").put(doctorProtect, updatepw);
router.route("/document").put(doctorProtect, updateDocument);
router
  .route("/acct")
  .get(doctorProtect, getAcctList)
  .post(doctorProtect, addAcctDetail)
  .put(doctorProtect, updateAcct);
router
  .route("/profile")
  .get(doctorProtect, getDoctorProfile)
  .put(doctorProtect, updateDoctorProfile);
router.route("/reminder").post(doctorProtect, sendSmsReminder);
router.route("/acct/:id").get(getAcctDetail).delete(doctorProtect, deleteAcct);
router.route("/checkmails/:email").get(checkEmailexist);
router.route("/:id").get(getDoctorById);
router.route("/:id/acct").get(acctListOpenAccess);
router.route("/chatsummaries/:id").get(doctorProtect, getChatSummaries);
router.route("/:id/review").post(patientProtect, createProductReview);
router.route("/:id/doctor_invite").get(getDoctorByInviteId);
router.route("/summaries/:id").get(getSummaryById);
router.route("/summaries/:id/edit").put(doctorProtect, updateSummaries);
router.route("/prescriptions/:id/edit").put(doctorProtect, updatePrescription);
router.route("/referrals/:id").get(getreferralById);
router.route("/referrals/:id/edit").put(doctorProtect, updateReferral);

export default router;
