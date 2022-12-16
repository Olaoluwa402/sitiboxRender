import express from "express";
const router = express.Router();
// const router = express.Router({mergeParams: true});
import {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  getDoctorOrderRequests,
  sendReceipt,
  updateOrderToDoctorIsPaid,
  getPromoCode,
} from "../controllers/orderController.js";
import {
  patientProtect,
  doctorProtect,
  adminProtect,
} from "../middleware/authMiddleware.js";

router
  .route("/")
  .post(patientProtect, addOrderItems)
  .get(adminProtect, getOrders);
router.route("/myorders").get(patientProtect, getMyOrders);
router.route("/docrequests").get(doctorProtect, getDoctorOrderRequests);
router.route("/promocode").post(patientProtect, getPromoCode);
router.route("/:id").get(getOrderById);
router.route("/:id/receipt").post(patientProtect, sendReceipt);
router.route("/:id/pay").put(patientProtect, updateOrderToPaid);
router.route("/:id/deliver").put(doctorProtect, updateOrderToDelivered);
router.route("/:id/doctorpaid").put(adminProtect, updateOrderToDoctorIsPaid);

export default router;
