import express from "express";
const router = express.Router();
import {
  authAdmin,
  registerAdmin,
  allReceipts,
  getAllPrescriptions,
  getAllPatients,
  getAllDoctors,
  getPatientDetail,
  getDoctorDetail,
  deleteDoctor,
  deletePatient,
  updateDoctorToVerified,
  getDoctorReviews,
  updateReviewApproved,
  deleteReview,
  generatePromoCode,
  getPromoCodes,
  deletePromoCode,
  getAllGeneratedSummaries,
  getReferrals,
  sendContactPageMail,
  sendMailToAll,
  sendSmsToAll,
} from "../../controllers/userController/adminController.js";
import {
  adminProtect,
  csrfProtection,
} from "../../middleware/authMiddleware.js";

router.route("/login").post(authAdmin);
router.route("/receipts").get(adminProtect, allReceipts);
router.route("/prescriptions").get(adminProtect, getAllPrescriptions);
router.route("/allpromocode").get(adminProtect, getPromoCodes);
router.route("/contact-mail").post(sendContactPageMail);
router.route("/genpromocode").post(adminProtect, generatePromoCode);
router.route("/sendmailtoall").post(adminProtect, sendMailToAll);
router.route("/sendsmstoall").post(adminProtect, sendSmsToAll);
router.route("/patients").get(adminProtect, getAllPatients);
router.route("/referrals").get(adminProtect, getReferrals);
router.route("/doctors").get(adminProtect, getAllDoctors);
router.route("/summaries").get(adminProtect, getAllGeneratedSummaries);
router.route("/reviews/:id").delete(adminProtect, deleteReview);
router.route("/allpromocode/:id").delete(adminProtect, deletePromoCode);
router
  .route("/patients/:id")
  .delete(adminProtect, deletePatient)
  .get(adminProtect, getPatientDetail);
router
  .route("/doctors/:id")
  .delete(adminProtect, deleteDoctor)
  .get(adminProtect, getDoctorDetail);
router.route("/doctors/:id/verified").put(adminProtect, updateDoctorToVerified);
router.route("/doctors/:id/reviews").get(adminProtect, getDoctorReviews);
router
  .route("/reviews/:id/approved")
  .delete(adminProtect, updateReviewApproved);

export default router;
