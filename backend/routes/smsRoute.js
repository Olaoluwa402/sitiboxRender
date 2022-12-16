import express from "express";
const router = express.Router();
import { SendSMS } from "../controllers/smsController.js";
import { patientProtect } from "../middleware/authMiddleware.js";

router.route("/").post(patientProtect, SendSMS);

export default router;
