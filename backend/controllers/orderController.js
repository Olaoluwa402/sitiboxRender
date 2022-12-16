import asyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";
import Receipt from "../models/receiptModel.js";
import cloudinary from "cloudinary";
import Promo from "../models/promocodeModel.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import { sendSMS } from "../helpers/misc.js";
import Patient from "../models/userModel/patientModel.js";
import Doctor from "../models/userModel/doctorModel.js";
import Wallet from '../models/wallet/walletModel.js'

// extend dayjs plugins
dayjs.extend(utc);
dayjs.extend(timezone);

// using toISOSting will use javascript Date(), so add 1hr
const dt = new Date();
const date = dayjs.utc(dt, "z").add(1, "hour").tz("Africa/Lagos").format();
// modifiedDate = new Date(date).toISOString();
const modifiedDate = new Date(date).toISOString();

//@desc    Create new order
// @route   POST /api/orders 
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    consultationorderItem,
    complaint,
    consultationPrice,
    paymentMethods,
  } = req.body;

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  try {
    let uploadedResponse = "";
    if (complaint.file !== "") {
      uploadedResponse = await cloudinary.v2.uploader.upload(complaint.file, {
        resource_type: "image",
        folder: "patients_complaint",
        width: 450,
        height: 450,
        crop: "scale",
      });
    }

    // calculate age from birth date

    let age;
    // calculate age from birth date
    const calculateYear = (selectedDate) => {
      let DOB = selectedDate;
      let millisecondsBetweenDOBAnd1970 = Date.parse(DOB);

      let millisecondsBetweenNowAnd1970 = Date.now();

      let ageInMilliseconds =
        millisecondsBetweenNowAnd1970 - millisecondsBetweenDOBAnd1970;
      //--We will leverage Date.parse and now method to calculate age in milliseconds refer here https://www.w3schools.com/jsref/jsref_parse.asp
      let milliseconds = ageInMilliseconds;
      let second = 1000;
      let minute = second * 60;
      let hour = minute * 60;
      let day = hour * 24;
      let month = day * 30;
      /*using 30 as base as months can have 28, 29, 30 or 31 days depending a month in a year it itself is a different piece of comuptation*/
      let year = day * 365;

      // //let the age conversion begin
      age = Math.round(milliseconds / year);
    };

    if (req.patient.birthDate) {
      calculateYear(req.patient.birthDate);
    }

    const mycomplaint = {
      firstName: req.patient.firstName,
      lastName: req.patient.lastName,
      complaint: complaint.complaint,
      age: age ? age : null,
      gender: req.patient.gender,
      image: uploadedResponse.secure_url
        ? uploadedResponse.secure_url
        : uploadedResponse,
      imageId: uploadedResponse.public_id
        ? uploadedResponse.public_id
        : uploadedResponse,
    };

    const dt = new Date();
    const date = dayjs.utc(dt, "z").add(3, "Day").tz("Africa/Lagos").format();

    const order = new Order({
      consultationorderItem,
      patient: req.patient._id,
      mycomplaint,
      consultationPrice,
      paymentMethods,
      orderExpiryDate: date,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);

    // sent text message to admin
    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const adminPhone = process.env.ADMIN_PHONE;
    const adminMsg =
      "SITIBOX: FollowUp Alert \n" +
      `${capitalizeFirstLetter(
        req.patient.clinicName
      )} has just created an order. \n` +
      "Kindly FollowUp with a call.\n" +
      `Contact: ${req.patient.phone}\n`;
    sendSMS({ phone: adminPhone, message: adminMsg });
  } catch (error) {
    console.log("err", error);
    res.status(500);
    throw new Error("Something went wrong");
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "patient",
    "clinicName email"
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Update order to paid
// @route   GET /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  // debit wallet for the consultation price
  const wallet = await Wallet.findOne({patientId:req.patient._id})
  if(!wallet){
    res.status(404);
    throw new Error("No wallet found, setup wallet to make payment");
  } 


  const order = await Order.findById(req.params.id);
 
  if (order) { 
    if (parseInt(order.consultationPrice) > parseInt(wallet.balance)){
      res.status(404);
      throw new Error("Insufficient wallet balance, please fund your wallet");
    }
 
     // update wallet
     await Wallet.findOneAndUpdate(
      { patientId:req.patient._id },
      { $inc: { balance: -parseInt(order.consultationPrice) } },
      { new: true }
    );

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      userId: req.patient._id, 
      status: 'success',  
      amount: order.consultationPrice,
      email_address: req.patient.email,
    };

    const updatedOrder = await order.save();

    res.json(updatedOrder);
 
    // sent text message to admin
    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const date = new Date();
    const start_Date = dayjs
      .utc(date, "z")
      .tz("Africa/Lagos")
      .format("D MMM, YYYY");
    const end_Date = dayjs
      .utc(date, "z")
      .add(2, "day")
      .tz("Africa/Lagos")
      .format("D MMM, YYYY");

    const adminPhone = process.env.ADMIN_PHONE;
    const adminMsg =
      "SITIBOX: FollowUp Alert \n" +
      `Doc: Dr. ${capitalizeFirstLetter(
        updatedOrder.consultationorderItem.lastName
      )} \n` +
      `Pat: ${capitalizeFirstLetter(req.patient.clinicName)} \n` +
      "Desc: Consult/3DAYS \n" +
      `Start: ${start_Date} \n` +
      `End: ${end_Date} \n` +
      "Kindly follow-up the Doctor!";

      const phone = updatedOrder.consultationorderItem.phone
      const Msg =
      "SITIBOX: Consult \n" +
      `Doc: Dr. ${capitalizeFirstLetter(
        updatedOrder.consultationorderItem.lastName
      )} \n` +
      `Pat: ${capitalizeFirstLetter(req.patient.clinicName)} \n` +
      "Desc: Consult/3DAYS \n" +
      `Start: ${start_Date} \n` +
      `End: ${end_Date} \n` +
      "Kindly attend to the patient!";

    sendSMS({ phone: adminPhone, message: adminMsg });

    setTimeout(()=> {
      sendSMS({ phone: phone, message: Msg });
    }, 5000)


  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Update order to completed
// @route   GET /api/orders/:id/deliver
// @access  Private/Doctor/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
 // debit wallet for the consultation price
 const wallet = await Wallet.findOne({doctorId:req.doctor._id})
 if(!wallet){ 
   res.status(404);
   throw new Error("No wallet found, setup wallet to receive payment");
 } 

  if (order) {
    const reward = parseInt(order.consultationPrice - (order.consultationPrice * (30/100)))
     // update wallet
     await Wallet.findOneAndUpdate(
      { doctorId:req.doctor._id },
      { $inc: { balance:  reward} },
      { new: true }
    );

    //keep record of reward sharing in db X
 
    order.isConfirmed = true;
    order.isConfirmedAt = Date.now();

    const updatedOrder = await order.save();
    const patient = await Patient.findById(updatedOrder.patient);
    const doctor = await Doctor.findById(updatedOrder.consultationorderItem.doctor).populate('doctor', 'phone firstName lastName')

    // sent text message to admin
    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const msg =
      "SITIBOX: Consultation \n" +
      `Date:${dayjs(updatedOrder.updatedAt).format('DD-MM-YYYY h:mm:ss A')}` +
      `Desc: TELEMEDICINE:CHAT_SESSION_ENDED with Dr. ${capitalizeFirstLetter(
        updatedOrder.consultationorderItem.lastName
      )}.\n` +
      "Pls, Check your dashboard for prescriptions. \n" + 
      "https://sitibox.9jaclinic.com/feedback";
    sendSMS({ phone: patient.phone, message: msg });
       
      // sent text message to admin
      const msgDoc =
        `SITIBOX Credit: NGN${reward} \n` +
        `Date: ${dayjs(updatedOrder.updatedAt).format('DD-MM-YYYY h:mm:ss A')}\n` + 
        `Desc: TELEMEDCINE: CHAT_SESSION_WALLET_CREDIT for Dr ${capitalizeFirstLetter(updatedOrder.consultationorderItem.lastName)} \n` +
        `https://sitibox.9jaclinic.com/feedback`

      setTimeout(() =>{
        sendSMS({ phone: doctor.phone, message: msgDoc });
      }, 5000)
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Update order to doctorhasbeenpaid
// @route   GET /api/orders/:id/doctorpaid
// @access  Private/Admin
const updateOrderToDoctorIsPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.doctorIsPaid = true;
    order.doctorIsPaidAt = Date.now();

    const updatedOrder = await order.save();

    res.json(updatedOrder);

    // sent text message to admin
    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const msg =
      "Txt: Payment Alert \n" +
      `Hello Dr. ${capitalizeFirstLetter(
        updatedOrder.consultationorderItem.lastName
      )}, Your completed consultations has been marked paid by admin. Please confirm through your bank. Thanks\n`;
    sendSMS({ phone: updatedOrder.consultationorderItem.phone, message: msg });
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Get logged in patient orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ patient: req.patient._id })
    .populate("patient", "id clinicName")
    .sort({ _id: -1 });

  res.json(orders);
});

// @desc    Get logged in doctor order requests
// @route   GET /api/orders/docrequests
// @access  Private
const getDoctorOrderRequests = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate("patient", "id clinicName")
    .sort({ _id: -1 });

  res.json(orders);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate("patient", "id clinicName")
    .sort({ _id: -1 });
  res.json(orders);
});

// @desc    POST send order receipt to patient
// @route   GET /api/orders/receipt
// @access  Private/patient
const sendReceipt = asyncHandler(async (req, res) => {
  const { receiptDetail } = req.body;
  const orderId = req.params.id;
  try {
    const receipt = new Receipt({
      patient: req.patient._id,
      order: orderId,
      receiptNo: receiptDetail.id,
      paidAt: receiptDetail.paidAt,
      email_address: receiptDetail.email_address,
      amount: receiptDetail.amount,
      last4Digit: receiptDetail.last4Digit,
      bank: receiptDetail.bank,
      card_type: receiptDetail.card_type,
      currency: receiptDetail.currency,
      channel: receiptDetail.channel,
      reference: receiptDetail.reference,
      method: "paystack",
    });

    const createdReceipt = await receipt.save();
    console.log(createdReceipt);

    res.status(201).json(createdReceipt);
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    POST get promocode
// @route   GET /api/orders/promocode
// @access  Private/patient
const getPromoCode = asyncHandler(async (req, res) => {
  const { code } = req.body;

  try {
    const promoCode = await Promo.findOne({
      promoCode: code,
      expirePromoCode: { $gt: modifiedDate },
    });

    if (!promoCode) {
      res.status(422);
      throw new Error("Code has expired");
    } else {
      res.status(201).json(promoCode);
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

export {
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
};
