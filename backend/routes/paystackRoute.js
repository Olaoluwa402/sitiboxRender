import express from "express";
const router = express.Router();
import {
  getInitializePayment,
  getVerifyPayment,
} from "../controllers/paystackController.js";
import { patientProtect } from "../middleware/authMiddleware.js";

router.route("/").post(patientProtect, getInitializePayment);
router.route("/:ref").get(patientProtect, getVerifyPayment);

export default router;
