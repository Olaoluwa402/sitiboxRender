import asyncHandler from "express-async-handler";
import Admin from "../../models/userModel/adminModel.js";
import generateToken from "../../utils/generateToken.js";
import Receipt from "../../models/receiptModel.js";
import Referral from "../../models/referralModel.js";
import Promo from "../../models/promocodeModel.js";
import Summary from "../../models/summaryModel.js";
import Prescription from "../../models/prescriptionModel.js";
import Patient from "../../models/userModel/patientModel.js";
import Doctor from "../../models/userModel/doctorModel.js";
import Order from "../../models/orderModel.js";
import { sendSMS } from "../../helpers/misc.js";
import nodemailer from "nodemailer";
import mailGun from "nodemailer-mailgun-transport";
import smtp from "nodemailer-smtp-transport";
import path from "path";
import ejs from "ejs";
import crypto from "crypto";
import Account from "../../models/accountModel.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
// import { identity } from "lodash";

// extend dayjs pluginss
dayjs.extend(utc);
dayjs.extend(timezone);

const __dirname = path.resolve();

// @desc Auth user, get token
// @route POST /api/users/login
// @access Public

const authAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });

  if (admin && (await admin.matchPassword(password))) {
    res.json({
      _id: admin._id,
      name: admin.name, 
      email: admin.email,
      token: generateToken(admin._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc Register user
// @route POST /api/users
// @access Public

const registerAdmin = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const adminExits = await Admin.findOne({ email });

  if (adminExits) {
    res.status(400);
    throw new Error("Admin already exist");
  }

  const admin = await Admin.create({
    name,
    email,
    password,
  });

  if (admin) {
    res.status(201).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      token: generateToken(admin._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid admin's data");
  }
});

// @desc    Get all receipts for loogedIn admin
// @route   GET /api/admins/receipts
// @access  Private
const allReceipts = asyncHandler(async (req, res) => {
  try {
    const receipts = await Receipt.find({}).sort({ _id: -1 });
    res.json(receipts);
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error("Something went wrong");
  }
});

// @desc    Get all my generated prescriptions
// @route   GET /api/admins/prescriptions
// @access  Private
const getAllPrescriptions = asyncHandler(async (req, res) => {
  try {
    const prescriptions = await Prescription.find({}).sort({ _id: -1 });
    res.json(prescriptions);
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error("Something went wrong");
  }
});

// @desc    Get all patients list
// @route   GET /api/admins/patients
// @access  Private
const getAllPatients = asyncHandler(async (req, res) => {
  try {
    const patients = await Patient.find({}).sort({ _id: -1 });
    res.json(patients);
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error("Something went wrong");
  }
});

// @desc    Get all doctors list
// @route   GET /api/admins/doctors
// @access  Private
const getAllDoctors = asyncHandler(async (req, res) => {
  try {
    const doctors = await Doctor.find({}).sort({ _id: -1 });
    res.json(doctors);
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error("Something went wrong");
  }
});

// @desc GET patient details
// @route GET /api/admins/patients/:id
// @access Private Admin

const getPatientDetail = asyncHandler(async (req, res) => {
  const patient = await Patient.findById(req.params.id).select("-password");

  if (patient) {
    res.json(patient);
  } else {
    res.status(404);
    throw new Error("Patient not found");
  }
});

// @desc GET doctor details
// @route GET /api/admins/doctors/:id
// @access Private Admin

const getDoctorDetail = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id).select("-password");

  if (doctor) {
    res.json(doctor);
  } else {
    res.status(404);
    throw new Error("Doctor not found");
  }
});

// @desc Delete doctor
// @route DELETE /api/admins/doctor/:id
// @access Private/Admin

const deleteDoctor = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);

  if (doctor) { 
    await Account.deleteMany({ doctor: req.params.id });
    await Prescription.deleteMany({ patient: req.params.id });
    await Receipt.deleteMany({ patient: req.params.id });
    await Referral.deleteMany({ patient: req.params.id });
    await Summary.deleteMany({ patient: req.params.id });
    await doctor.remove();
    res.json({ message: "Doctor removed" });
  } else {
    res.status(404);
    throw new Error("Doctor not found");
  }
});

// @desc Delete Patient
// @route DELETE /api/admins/patients/:id
// @access Private/Admin

const deletePatient = asyncHandler(async (req, res) => {
  const patient = await Patient.findById(req.params.id);

  if (patient) {
    await Order.deleteMany({ patient: req.params.id });
    await Prescription.deleteMany({ patient: req.params.id });
    await Receipt.deleteMany({ patient: req.params.id });
    await Referral.deleteMany({ patient: req.params.id });
    await Summary.deleteMany({ patient: req.params.id });

    await patient.remove();
    res.json({ message: "Patient and all associated resources removed" });
  } else {
    res.status(404);
    throw new Error("Patient not found");
  }
});

// @desc    Update doctor to doctorIsVerified
// @route  GET /api/admins/doctors/:id/verified
// @access  Private/Admin
const updateDoctorToVerified = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);

  if (doctor) {
    if (doctor.doctorIsVerified) {
      doctor.doctorIsVerified = false;
      const updatedDoctor = await doctor.save();
      res.json(updatedDoctor);
    } else {
      doctor.doctorIsVerified = true;
      const updatedDoctor = await doctor.save();
      res.json(updatedDoctor);

      // message doctor
      function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }

      const docPhone = updatedDoctor.phone;
      const adminMsg =
        "Txt: Account Verification Alert \n" +
        `Congratulations! Your account has been verified. Invite your patients to consult you on the app by using 
        your unique Ingress code ${updatedDoctor.inviteCode}.\n` +
        "Don't forget to update your profile details when you log in.\n" +
        "https://sitibox.9jaclinic.com";
      sendSMS({ phone: docPhone, message: adminMsg });
    }
  } else {
    res.status(404);
    throw new Error("Doctor not found");
  }
});

// @desc    Get all reviews
// @route   GET /api/admins/reviews
// @access  Private
const getDoctorReviews = asyncHandler(async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    const reviews = doctor.reviews;

    res.json(reviews);
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error("Something went wrong");
  }
});

// @desc    Update review to reviewApproved
// @route   GET /api/admins/reviews/:id/confirm
// @access  Private/Admin
const updateReviewApproved = asyncHandler(async (req, res) => {
  const review = await Doctor.reviews.findById(req.params.id);

  if (review) {
    if (review.reviewApproved) {
      review.reviewApproved = false;
      const updatedReview = await review.save();
      res.json(updatedReview);
    } else {
      review.reviewApproved = true;
      const updatedReview = await review.save();
      res.json(updatedReview);
    }
  } else {
    res.status(404);
    throw new Error("Review not found");
  }
});

// @desc Delete Patient
// @route DELETE /api/admins/patients/:id
// @access Private/Admin

const deleteReview = asyncHandler(async (req, res) => {
  const review = await Doctor.reviews.findById(req.params.id);

  if (review) {
    await review.remove();
    res.json({ message: "Review removed" });
  } else {
    res.status(404);
    throw new Error("Review not found");
  }
});

// @desc generate promocode
// @route POST/api/admins/promocode
// @access Private/Admin

const generatePromoCode = asyncHandler(async (req, res) => {
  try {
    const { uniqueCode } = req.body;
    console.log(uniqueCode);

    const codeExist = await Promo.findOne({ promoCode: uniqueCode });
    console.log(codeExist);

    if (codeExist) {
      res.status(422);
      throw new Error("Code already exist, Pls select a unique code");
    } else {
      // expire in 1 hr time - 3600000ms = 60minute
      // add 1 hr to account for issue with saving with Date into mongodb
      // add extra 1hr - expiring after an hour (2hr added in total)
      const dt = new Date();
      const date = dayjs
        .utc(dt, "z")
        .add(30, "day")
        .tz("Africa/Lagos")
        .format();
      const result = await Promo.create({
        promoCode: uniqueCode,
        expirePromoCode: date,
      });

      if (result) {
        res.json(result);
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500);
    throw new Error("Something went wrong, Try again!");
  }
});

// @desc get all promocodes
// @route GET /api/admins/promocodes
// @access Private/Admin

const getPromoCodes = asyncHandler(async (req, res) => {
  try {
    const allpromoCodes = await Promo.find({}).sort({ _id: -1 });
    if (allpromoCodes) {
      res.json(allpromoCodes);
    }
  } catch (err) {
    console.log(err);
    res.status(500);
    throw new Error("Try again!");
  }
});

// @desc Delete Promo code
// @route DELETE /api/admins/promocode/:id
// @access Private/Admin

const deletePromoCode = asyncHandler(async (req, res) => {
  const code = await Promo.findById(req.params.id);

  if (code) {
    await code.remove();
    res.json("Promocode deleted!");
  } else {
    res.status(404);
    throw new Error("Code not found Promo Code");
  }
});

// @desc    Get all my generated summaries
// @route   GET /api/admins/summaries
// @access  Private
const getAllGeneratedSummaries = asyncHandler(async (req, res) => {
  try {
    const summaries = await Summary.find({}).sort({ _id: -1 });
    res.json(summaries);
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error("Something went wrong");
  }
});

// @desc    Get all referrals
// @route   GET /api/admins/referrals
// @access  Private
const getReferrals = asyncHandler(async (req, res) => {
  try {
    const referrals = await Referral.find({}).sort({ _id: -1 });
    res.json(referrals);
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error("Something went wrong");
  }
});

// @desc    POST send mail to admin from contact page
// @route   POST /api/admins/contact-mail
// @access  Public
const sendContactPageMail = asyncHandler(async (req, res) => {
  const { name, subject, message, email } = req.body.mail;

   // mailjet email setup
     const auth = {
      host: 'in.mailjet.com',
      port: 2525,
      auth: {
        user: process.env.MAILJET_API_KEY || '<your-mailjet-api-key',
        pass: process.env.MAILJET_API_SECRET || '<your-mailjet-api-secret>',
      },
    };
    let transporter = nodemailer.createTransport(smtp(auth));
    
  try {
    const template = await ejs.renderFile(
      __dirname + "/backend/views/contactPageMailTemplate.ejs",
      { name: name, subject: subject, message: message, email: email }
    );

    const mailOptions = {
      to: "tech@9jaclinic.com",
      from: "tech@9jaclinic.com",
      reply: email,
      subject: subject,
      text: message,
      html: template,
    };

    // console.log("html data =========>", mailOptions.html);
    const sendMail = await transporter.sendMail(mailOptions);

    if (sendMail) {
      res.json({
        msg: "Your mail has been received. Thank you!",
      });
    } else {
      res.status(400);
      throw new Error("Mail not sent, Try again!");
    }
  } catch (error) {
    console.log("sendMailFailed", error);
  }
});

// @desc    POST send mail to all Doctors or Patients
// @route   POST /api/admins/sendmailtoall
// @access Admin
const sendMailToAll = asyncHandler(async (req, res) => {
  const { message, subject, option, id } = req.body.dataOption;

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

   // mailjet email setup
     const auth = {
      host: 'in.mailjet.com',
      port: 2525,
      auth: {
        user: process.env.MAILJET_API_KEY || '<your-mailjet-api-key',
        pass: process.env.MAILJET_API_SECRET || '<your-mailjet-api-secret>',
      },
    };
   

  if (option === "patients") {
    const patients = await Patient.find({});

    if (patients && patients.length > 0) {
      for (let i = 0; i < patients.length; i++) {
         let transporter = nodemailer.createTransport(smtp(auth));
        try {
          const template = await ejs.renderFile(
            __dirname + "/backend/views/mailTemplate.ejs",
            {
              name: capitalizeFirstLetter(patients[i].clinicName),
              subject: subject,
              message: message,
              email: patients[i].email,
            }
          );

          const mailOptions = {
            to: patients[i].email,
            from: "service@9jaclinic.com",
            subject: subject,
            text: message,
            html: template,
          };

          // console.log("html data =========>", mailOptions.html);
          const sendMail = await transporter.sendMail(mailOptions);
        } catch (error) {
          console.log("sendMailFailed", error);
        }
      }

      res.json({
        msg: "Your mail has been sent. Thank you!",
      });
    }
  }
  
  // if (option === "patients" && id) {
  //   const patient = await Patient.find({_id:id});

  //   let transporter = nodemailer.createTransport(mailGun(auth));
  //   try {
  //     const template = await ejs.renderFile(
  //       __dirname + "/backend/views/mailTemplate.ejs",
  //       {
  //         name: capitalizeFirstLetter(patient.clinicName),
  //         subject: subject,
  //         message: message,
  //         email: patient.email,
  //       }
  //     );

  //     const mailOptions = {
  //       to: patient.email,
  //       from: "tech@9jaclinic.com",
  //       subject: subject,
  //       text: message,
  //       html: template,
  //     };

  //     // console.log("html data =========>", mailOptions.html);
  //     const sendMail = await transporter.sendMail(mailOptions);
  //     if (sendMail) {
  //       res.json({
  //         msg: "Your mail has been received. Thank you!",
  //       });
  //     } else {
  //       res.status(400);
  //       throw new Error("Mail not sent, Try again!");
  //     }
  //   } catch (error) {
  //     console.log("sendMailFailed", error);
  //   }

  // }
  if (option === "doctors") {
    const doctors = await Doctor.find({});

    // const doctors = [
    //   {
    //     _id: "1",
    //     firstName: "Olaoluwa",
    //     email: "ibukunolaoluwa402@gmail.com",
    //     phone: "2347060507450",
    //   },
    //   {
    //     _id: "2",
    //     firstName: "Babatunde",
    //     email: "drolajohn@yahoo.com",
    //     phone: "2348132740610",
    //   },
    //   {
    //     _id: "3",
    //     firstName: "loboche",
    //     email: "obebeeunice@gmail.com",
    //     phone: "2349036036393",
    //   },
    // ];

    if (doctors && doctors.length > 0) {
      for (let i = 0; i < doctors.length; i++) {
         let transporter = nodemailer.createTransport(smtp(auth));
        try {
          const template = await ejs.renderFile(
            __dirname + "/backend/views/mailTemplate.ejs",
            {
              name: capitalizeFirstLetter(doctors[i].firstName),
              subject: subject,
              message: message,
              email: doctors[i].email,
            }
          );

          const mailOptions = {
            to: doctors[i].email,
            from: "service@9jaclinic.com",
            subject: subject,
            text: message,
            html: template,
          };

          // console.log("html data =========>", mailOptions.html);
           await transporter.sendMail(mailOptions);
        } catch (error) {
          console.log("sendMailFailed", error);
        }
      }
      res.json({
        msg: "Your mail has been sent. Thank you!",
      });
    }

    // if (option === "doctors" && id) {
    //   const doctor = await Doctor.find({_id:id});
     
  
    //   let transporter = nodemailer.createTransport(mailGun(auth));
    //   try {
    //     const template = await ejs.renderFile(
    //       __dirname + "/backend/views/mailTemplate.ejs",
    //       {
    //         name: capitalizeFirstLetter(Doctor.firstName),
    //         subject: subject,
    //         message: message,
    //         email: doctor.email,
    //       }
    //     );
  
    //     const mailOptions = {
    //       to: doctor.email,
    //       from: "tech@9jaclinic.com",
    //       subject: subject,
    //       text: message,
    //       html: template,
    //     };
  
    //     // console.log("html data =========>", mailOptions.html);
    //     const sendMail = await transporter.sendMail(mailOptions);
    //     if (sendMail) {
    //       res.json({
    //         msg: "Your mail has been received. Thank you!",
    //       });
    //     } else {
    //       res.status(400);
    //       throw new Error("Mail not sent, Try again!");
    //     }
    //   } catch (error) {
    //     console.log("sendMailFailed", error);
    //   }
  
    // }
  }
});

// @desc    POST send sms to all Doctors or Patients
// @route   POST /api/admins/sendsmstoall
// @access Admin
const sendSmsToAll = asyncHandler(async (req, res) => {
  const { message, title, option, id } = req.body.dataOption;

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  if (option === "patients") {
    const patients = await Patient.find({});
    
    if (patients && patients.length > 0) {
      for (let i = 0; i < patients.length; i++) {
        const phone = patients[i].phone;
        const msg =
          `${title} ${capitalizeFirstLetter(patients[i].clinicName)} \n` +
          `${message}\n` +
          "https://sitibox.9jaclinic.com";

        sendSMS({ phone: phone, message: msg });
      }

      res.json({
        msg: "Your mail has been sent. Thank you!",
      });
    }
  }

  // if (option === "patients") {
  //   const patient = await Patient.findById({_id:id});

  //   const phone = patient.phone;
  //       const msg =
  //         `${title} ${capitalizeFirstLetter(patient.clinicName)} \n` +
  //         `${message}\n` +
  //         "https://sitibox.9jaclinic.com";

  //       sendSMS({ phone: phone, message: msg });

  //       res.json({
  //         msg: "Your mail has been sent. Thank you!",
  //       });
  // }

  if (option === "doctors") {
    const doctors = await Doctor.find({});
    
    // const doctors = [
    //   {
    //     _id: "1",
    //     firstName: "Olaoluwa",
    //     email: "ibukunolaoluwa402@gmail.com",
    //     phone: "2347060507450",
    //   },
    //   {
    //     _id: "2",
    //     firstName: "Babatunde",
    //     email: "drolajohn@yahoo.com",
    //     phone: "2348132740610",
    //   },
    //   {
    //     _id: "3",
    //     firstName: "loboche",
    //     email: "obebeeunice@gmail.com",
    //     phone: "2349036036393",
    //   },
    // ];


    if (doctors && doctors.length > 0) {
      for (let i = 0; i < doctors.length; i++) {
        const phone = doctors[i].phone;
        const msg =
          `${title} ${capitalizeFirstLetter(doctors[i].firstName)} \n` +
          `${message}\n` +
          "https://sitibox.9jaclinic.com";

        sendSMS({ phone: phone, message: msg });
      }

      res.json({
        msg: "Your mail has been sent. Thank you!",
      });
    }

  //   if (option === "doctors" && id !== null) {
  //     const doctor = await Doctor.findById({_id:id});
  // console.log("id is present")
  //     const phone = doctor.phone;
  //         const msg =
  //           `${title} ${capitalizeFirstLetter(doctor.firstName)} \n` +
  //           `${message}\n` +
  //           "https://sitibox.9jaclinic.com";
  
  //         sendSMS({ phone: phone, message: msg });
  
  //         res.json({
  //           msg: "Your mail has been sent. Thank you!",
  //         });
  //   }
  }
});



export {
  authAdmin,
  registerAdmin,
  allReceipts,
  sendContactPageMail,
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
  sendMailToAll,
  sendSmsToAll,
};
