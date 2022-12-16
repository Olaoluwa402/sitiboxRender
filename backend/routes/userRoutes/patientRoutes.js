import express from "express";
const router = express.Router();
// const router = express.Router({mergeParams: true});
import {
  authPatient,
  checkEmailexist,
  registerPatient,
  getPatientProfile,
  updatePatientProfile,
  getMyPrescriptions,
  getMyReceipts,
  getReceiptById,
  getPrescriptionById,
  verifyPatientPhone,
  verifyPatientPhoneCode,
  passwordReset,
  newPassword,
  emailVerification,
  getReferrals,
  resendMail,
  sendSmsReminder,
  updatepw,
  updateDocument,
} from "../../controllers/userController/patientController.js";
import { patientProtect } from "../../middleware/authMiddleware.js";
// validate and sanitize post inputs to server
import validator from "express-validator";

const { body } = validator;

router.route("/").post(
  body("email").isEmail().normalizeEmail(),
  body("clinicName").not().isEmpty().trim().escape(),
  body("firstName").not().isEmpty().trim().escape(),
  body("lastName").not().isEmpty().trim().escape(),
  body("phone").isNumeric(),
  body("age").not().isEmpty().escape(),
  body("gender").not().isEmpty().escape(),
  body("isChecked").not().isEmpty().escape(),
  body("birthDate").isDate(),
  body("password").isLength({ min: 8 }),

  registerPatient
);
router
  .route("/login")
  .post(
    body("email").isEmail().normalizeEmail(),
    body("password").not().isEmpty(),
    authPatient
  );

router.route("/checkdetails").post(checkEmailexist);
router.route("/phoneverify").post(patientProtect, verifyPatientPhone);
router.route("/verifyphonecode").post(patientProtect, verifyPatientPhoneCode);
router.route("/passwordreset").post(passwordReset);
router.route("/newpassword").post(newPassword);
router.route("/email-verification").post(emailVerification);
router.route("/resendmail").post(resendMail);
router.route("/referrals").get(patientProtect, getReferrals);
router.route("/reminder").post(patientProtect, sendSmsReminder);
router
  .route("/profile")
  .get(patientProtect, getPatientProfile)
  .put(patientProtect, updatePatientProfile);
router.route("/pw").put(patientProtect, updatepw);
router.route("/document").put(patientProtect, updateDocument);
router.route("/prescriptions").get(patientProtect, getMyPrescriptions);
router.route("/receipts").get(patientProtect, getMyReceipts);
router.route("/receipts/:id/receipt").get(getReceiptById);
router.route("/prescriptions/:id/prescription").get(getPrescriptionById);

export default router;
