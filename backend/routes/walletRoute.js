import express from "express";
import {
  transactionResponse,
  getWallet,
  fundWallet,
  getTransactions,
  widthdrawWalletFund,
  verifyAccountNumber,
  transferRecipient,
  getBanks,
  webhookEvents,
} from "../controllers/walletController.js";

import {
  patientProtect,
  protect,
  doctorProtect,
} from "../middleware/authMiddleware.js";
const router = express.Router();

router.route("/").get(protect, getWallet);
router.route("/transactions").get(protect, getTransactions);
router.route("/fund-wallet").post(patientProtect, fundWallet);
router.route("/fund-verify").post(transactionResponse);
router.route("/widthdraw-fund").post(protect, widthdrawWalletFund);
router.route("/bank/verify").post(protect, verifyAccountNumber);
router.route("/bank/banks").get(getBanks);
router.route("/bank/createrecipient").post(doctorProtect, transferRecipient);
router.route("/webhook").post(webhookEvents);

export default router;
