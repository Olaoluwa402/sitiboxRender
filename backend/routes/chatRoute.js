import express from "express";
const router = express.Router();
import {
    chatUploads

} from "../controllers/chatController.js";
// import { chatProtect } from "../middleware/authMiddleware.js";

router.route("/").post(chatUploads);


export default router;