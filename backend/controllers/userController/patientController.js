import asyncHandler from "express-async-handler";
import Patient from "../../models/userModel/patientModel.js";
import Doctor from "../../models/userModel/doctorModel.js";
import generateToken from "../../utils/generateToken.js";
import Prescription from "../../models/prescriptionModel.js";
import Referral from "../../models/referralModel.js";
import Receipt from "../../models/receiptModel.js";
import Vonage from "@vonage/server-sdk";
import cloudinary from "cloudinary";
import crypto from "crypto";
import nodemailer from "nodemailer";
import mailGun from "nodemailer-mailgun-transport";
import smtp from "nodemailer-smtp-transport";
import googleapis from "googleapis";
import ejs from "ejs";
import path from "path";
import validator from "express-validator";
import { sendSMS } from "../../helpers/misc.js";
import Wallet from "../../models/wallet/walletModel.js";

const { validationResult } = validator;

const { google } = googleapis;

const __dirname = path.resolve();

// @desc Auth patient, get token
// @route POST /api/patients/login
// @access Public

const authPatient = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const patient = await Patient.findOne({ email });

  if (patient && (await patient.matchPassword(password))) {
    // check that wallet do not exist already
    const walletExist = await Wallet.findOne({ patientId: patient._id });
    if (!walletExist) {
      // create wallet if it does not exist yet
      await Wallet.create({
        patientId: patient._id,
      });
    }

    res.json({
      _id: patient._id,
      clinicName: patient.clinicName,
      phone: patient.phone,
      gender: patient.gender,
      email: patient.email,
      image: patient.image,
      firstName: patient.firstName,
      lastName: patient.lastName,
      emailIsVerified: patient.emailIsVerified,
      token: generateToken(patient._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc Check if email clinic name exist
// @route GET /api/patients
// @access Public

const checkEmailexist = asyncHandler(async (req, res) => {
  const { email, clinicName } = req.body;

  const mailExist1 = await Doctor.findOne({ email });
  const mailExist2 = await Patient.findOne({ email });
  const clinicNameExist = await Patient.findOne({ clinicName });

  if (mailExist1 || mailExist2 || clinicNameExist) {
    res.json({
      emailExist: true,
      clinicNameExist: true,
      message: "Pls ensure email and clinic name are unique",
    });
  } else {
    res.json({
      emailExist: false,
      clinicNameExist: false,
      message: "Email and Clinic Name is available",
    });
  }
});

// @desc Register patient
// @route POST /api/users
// @access Public

const registerPatient = asyncHandler(async (req, res) => {
  // Finds the validation errors in this request nd wrap them in an object
  // const errors = validationResult(req);
  // if(!errors.isEmpty()){
  //   console.log(errors.array())
  //     return res.status(400).json({errors:errors.array()})
  //   }

  const { clinicName, phone, email, password, firstName, lastName, isChecked } =
    req.body;

  const patientExist = await Patient.findOne({ email });
  const emailExist = await Doctor.findOne({ email });
  const clinicNameExist = await Patient.findOne({ clinicName });

  // mailjet email setup
  const auth = {
    host: "in.mailjet.com",
    port: 2525,
    auth: {
      user: process.env.MAILJET_API_KEY || "<your-mailjet-api-key",
      pass: process.env.MAILJET_API_SECRET || "<your-mailjet-api-secret>",
    },
  };
  let transporter = nodemailer.createTransport(smtp(auth));

  if (patientExist || emailExist) {
    res.status(400);
    throw new Error("email already exist");
  } else if (clinicNameExist) {
    res.status(400);
    throw new Error("clinicName already exist");
  } else {
    const buffer = await crypto.randomBytes(32);
    const token = buffer.toString("hex");

    const patient = await Patient.create({
      clinicName: clinicName,
      phone: phone,
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
      isAgreedToTerms: isChecked,
      emailIsVerified: false,
      emailVerificationToken: token,
    });

    if (patient) {
      try {
        const doctor = undefined;
        const template = await ejs.renderFile(
          __dirname + "/backend/views/mailVerificationTemplate.ejs",
          { patient: patient, doctor: doctor, token: token }
        );

        const mailOptions = {
          to: patient.email,
          from: "Sitibox <support@9jaclinic.com>",
          subject: "Complete your registration",
          text:
            "Thanks for registering with Sitibox(powered by 9jaclinic)\n\n" +
            "Are you ready to gain access to all of the online consultation tools we prepared for clients and doctors of 9jaclinic?:\n\n" +
            "First you must complete your registration by clicking on the link below" +
            "https://" +
            "sitibox.9jaclinic.com" +
            "/p-confirm-email/" +
            token +
            "\n\n" +
            "This link will verify your email address, and then you will officially be apart of the sitibox community" +
            "See You There!" +
            "Best regards, the sitibox App team",
          html: template,
        };

        // console.log("html data =========>", mailOptions.html);
        const sendMail = await transporter.sendMail(mailOptions);

        if (sendMail) {
          res.json({
            name: patient.clinicName,
            email: patient.email,
            isPatient: true,
            msg: "Registration successful! Please check your mail to complete your registration",
          });
        } else {
          res.status(400);
          throw new Error("Mail not sent");
        }
      } catch (err) {
        console.log(err);
        throw new Error("Pls try again");
      }
    } else {
      res.status(400);
      throw new Error("Invalid patient's data");
    }
  }
});

// @desc email verification patient
// @route POST /api/patients/email-verification
// @access Public
const emailVerification = asyncHandler(async (req, res) => {
  const { emailToken } = req.body;

  try {
    const patient = await Patient.findOne({
      emailVerificationToken: emailToken,
    });

    if (!patient) {
      // return res.status(422).json({error:"Try again session expired"})
      res.status(422);
      throw new Error("Token is invalid. Please contact us for help");
    } else {
      patient.emailVerificationToken = null;
      patient.emailIsVerified = true;
      const savedpatient = await patient.save();
      if (savedpatient) {
        res.status(201).json({
          _id: savedpatient._id,
          clinicName: savedpatient.clinicName,
          phone: savedpatient.phone,
          gender: savedpatient.gender,
          email: savedpatient.email,
          image: savedpatient.image,
          firstName: savedpatient.firstName,
          lastName: savedpatient.lastName,
          emailIsVerified: savedpatient.emailIsVerified,
          token: generateToken(savedpatient._id),
        });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(422);
    throw new Error("Token is invalid. Please contact us for help");
  }
});

const resendMail = asyncHandler(async (req, res) => {
  const { name, email } = req.body;

  // generate token
  const buffer = await crypto.randomBytes(32);
  const token = buffer.toString("hex");

  // mailjet email setup
  const auth = {
    host: "in.mailjet.com",
    port: 2525,
    auth: {
      user: process.env.MAILJET_API_KEY || "<your-mailjet-api-key",
      pass: process.env.MAILJET_API_SECRET || "<your-mailjet-api-secret>",
    },
  };
  let transporter = nodemailer.createTransport(smtp(auth));

  const patient = await Patient.findOne({ email });

  patient.emailVerificationToken = token;

  const savedPatient = await patient.save();

  if (savedPatient) {
    try {
      const doctor = undefined;
      const template = await ejs.renderFile(
        __dirname + "/backend/views/mailVerificationTemplate.ejs",
        { patient: savedPatient, doctor: doctor, token: token }
      );

      const mailOptions = {
        to: savedPatient.email,
        from: "Sitibox <support@9jaclinic.com>",
        subject: "Complete registration",
        text:
          "Thanks for registering with Sitibox(powered by 9jaclinic)\n\n" +
          "Are you ready to gain access to all of the online consultation tools we prepared for clients and doctors of 9jaclinic?:\n\n" +
          "First you must complete your registration by clicking on the link below" +
          "https://" +
          "sitibox.9jaclinic.com" +
          "/p-confirm-email/" +
          token +
          "\n\n" +
          "This link will verify your email address, and then you will officially be apart of the sitibox community" +
          "See You There!" +
          "Best regards, the sitibox App team",
        html: template,
      };

      // console.log("html data =========>", mailOptions.html);
      const sendMail = await transporter.sendMail(mailOptions);
      if (sendMail) {
        res.json({
          msg: "mail sent",
        });
      } else {
        res.status(400);
        throw new Error("Mail not sent");
      }
    } catch (err) {
      console.log(err);
    }
  }
});

// @desc reset patient password
// @route POST /api/patient/passwordreset
// @access Private
const passwordReset = asyncHandler(async (req, res) => {
  // mailjet email setup
  const auth = {
    host: "in.mailjet.com",
    port: 2525,
    auth: {
      user: process.env.MAILJET_API_KEY || "<your-mailjet-api-key",
      pass: process.env.MAILJET_API_SECRET || "<your-mailjet-api-secret>",
    },
  };
  let transporter = nodemailer.createTransport(smtp(auth));

  try {
    // generate random number for token
    const buffer = await crypto.randomBytes(32);
    const token = buffer.toString("hex");
    if (!buffer) {
      res.status(422);
      throw new Error("Something went wrong with buffer generation");
    }

    const patient = await Patient.findOne({ email: req.body.email });

    if (!patient) {
      res.status(422);
      throw new Error("Patient does no exist");
    } else {
      const doctor = undefined;
      const template = await ejs.renderFile(
        __dirname + "/backend/views/forgotPasswordTemplate.ejs",
        { patient: patient, doctor: doctor, token: token }
      );

      const mailOptions = {
        to: patient.email,
        from: "Sitibox <support@9jaclinic.com>",
        subject: "password reset",
        text:
          "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
          "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
          "https://" +
          "sitibox.9jaclinic.com" +
          "/resetpw/" +
          token +
          "\n\n" +
          "If you did not request this, please ignore this email and your password will remain unchanged.\n",
        html: template,
      };

      patient.resetToken = token;
      // expires in 1months time
      patient.expireToken = Date.now() + 2.62974383 * 10 ** 9;

      const result = await patient.save();

      if (result) {
        const sendMail = await transporter.sendMail(mailOptions);

        if (sendMail) {
          res
            .status(201)
            .json("Mail sent. Please check your mail for a reset link");
        } else {
          res.status(400);
          throw new Error("Mail not sent");
        }
      }
    }
  } catch (err) {
    console.log("Error", err);
  }
});

// @desc set new patient password
// @route POST /api/patient/newpassword
// @access Private

const newPassword = asyncHandler(async (req, res) => {
  const newPassword = req.body.password;
  const sentToken = req.body.token;

  try {
    const patient = await Patient.findOne({
      resetToken: sentToken,
      expireToken: { $gt: Date.now() },
    });

    if (!patient) {
      // return res.status(422).json({error:"Try again session expired"})
      res.status(422);
      throw new Error("Try again session expired");
    } else {
      patient.password = newPassword;
      patient.resetToken = undefined;
      patient.expireToken = undefined;
      const savedpatient = await patient.save();
      if (savedpatient) {
        res.json({ message: "password updated success" });
      }
    }
  } catch (err) {
    res.status(422);
    throw new Error("Try again session expired", err);
  }
});

// @desc GET patient profile
// @route GET /api/patients/profile
// @access Private

const getPatientProfile = asyncHandler(async (req, res) => {
  const patient = await Patient.findById(req.patient._id);

  if (patient) {
    res.json({
      _id: patient._id,
      clinicName: patient.clinicName,
      phone: patient.phone.toString(),
      gender: patient.gender,
      email: patient.email,
      image: patient.image,
      phoneVerified: patient.phoneVerified,
    });
  } else {
    res.status(404);
    throw new Error("Patient not found");
  }
});

// @desc Update patient profile
// @route PUT /api/patients/profile
// @access Private

const updatePatientProfile = asyncHandler(async (req, res) => {
  const { phone } = req.body.myData;

  try {
    const patient = await Patient.findById(req.patient._id);

    if (patient) {
      if (phone) {
        patient.phone = phone;
      }

      if (patient.phone) {
        patient.phoneVerified = false;
      }

      const updatedPatient = await patient.save();

      if (updatedPatient) {
        res.json({
          _id: updatedPatient._id,
          clinicName: updatedPatient.clinicName,
          email: updatedPatient.email,
          gender: updatedPatient.gender,
          phone: updatedPatient.phone,
          image: updatedPatient.image,
          phoneVerified: updatedPatient.phoneVerified,
          token: generateToken(updatedPatient._id),
        });
      }
    } else {
      res.status(404);
      throw new Error("Patient not found");
    }
  } catch (error) {
    console.log("err", error);
    res.status(500);
    throw new Error("Something went wrong");
  }
});

// @desc POST verify doctor number
// @route POST /api/patients/phoneverify
// @access Private

const verifyPatientPhone = asyncHandler(async (req, res, next) => {
  const phone = req.body;

  const APIKEY = process.env.API_KEY_VONAGE;
  const APISECRET = process.env.API_SECRET_VONAGE;

  const vonage = new Vonage({
    apiKey: APIKEY,
    apiSecret: APISECRET,
  });

  vonage.verify.request(
    {
      number: phone.phoneToVerify,
      brand: "Vonage",
    },
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(404);
        throw new Error("Something went wrong, pls try again later");
      } else {
        const verifyRequestId = result.request_id;

        if (result.status === "0") {
          res.json({ request_id: verifyRequestId });
        } else {
          res.status(500);
          throw new Error(result.error_text);
        }
      }
    }
  );
});

// @desc POST verify doctor number
// @route POST /api/patients/verifyphonecode
// @access Private

const verifyPatientPhoneCode = asyncHandler(async (req, res) => {
  const { code, verifyId, patientId } = req.body;

  const vonage = new Vonage({
    apiKey: "21bfc939",
    apiSecret: "NmOnRL3DWWwMdkfs",
  });

  vonage.verify.check(
    {
      request_id: verifyId,
      code: code,
    },
    async (err, result) => {
      if (err) {
        console.error(err);
        res.status(500);
        throw new Error("something went wrong, pls try again");
      } else {
        if (result.status == 0) {
          const patient = await Patient.findById({ _id: patientId });
          if (patient) {
            patient.phoneVerified = true;
            patient.phoneVerificationId = verifyId;

            const updatedPatient = await patient.save();

            const updatedProfile = {
              _id: updatedPatient._id,
              clinicName: updatedPatient.clinicName,
              email: updatedPatient.email,
              image: updatedPatient.image,
              phone: updatedPatient.phone,
              phoneVerified: updatedPatient.phoneVerified,
              gender: updatedPatient.gender,
            };

            res.status(200).json({ result, updatedProfile });
          }
        } else {
          res.status(500);
          throw new Error(result.error_text);
        }
      }
    }
  );
});

// @desc    Get logged in patient prescriptions
// @route   GET /api/patients/prescriptions
// @access  Private
const getMyPrescriptions = asyncHandler(async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ patient: req.patient._id })
      .populate("patient", "firstName lastName")
      .sort({ _id: -1 });
    res.json(prescriptions);
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error("Something went wrong");
  }
});

// @desc    Get logged in patient receipts
// @route   GET /api/patients/receipts
// @access  Private
const getMyReceipts = asyncHandler(async (req, res) => {
  try {
    const receipts = await Receipt.find({ patient: req.patient._id }).sort({
      _id: -1,
    });
    res.json(receipts);
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error("Something went wrong");
  }
});

// @desc    Get receipt by ID
// @route   GET /api/patients/receipts/:id/receipt
// @access  Private
const getReceiptById = asyncHandler(async (req, res) => {
  const receipt = await Receipt.findById(req.params.id).populate(
    "patient",
    "clinicName phone"
  );

  if (receipt) {
    res.json(receipt);
  } else {
    res.status(404);
    throw new Error("Receipt not found");
  }
});

// @desc    Get prescription by ID
// @route   GET /api/prescriptions/:id/prescription
// @access  Private
const getPrescriptionById = asyncHandler(async (req, res) => {
  const prescription = await Prescription.findById(req.params.id).populate(
    "patient",
    "firstName lastName"
  );

  if (prescription) {
    res.json(prescription);
  } else {
    res.status(404);
    throw new Error("Prescription not found");
  }
});

// @desc    Get all referrals for patient
// @route   GET /api/patients/referrals
// @access  Private
const getReferrals = asyncHandler(async (req, res) => {
  try {
    const referrals = await Referral.find({ patient: req.patient._id }).sort({
      _id: -1,
    });
    res.json(referrals);
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error("Something went wrong");
  }
});

// @desc    POST send sms reminder to doctor
// @route   GET /api/patients/reminder
// @access  Private
const sendSmsReminder = asyncHandler(async (req, res) => {
  const { receiver } = req.body;
  console.log("receiver", receiver);
  try {
    const doctor = await Doctor.findById({ _id: receiver });

    // sent text message to admin
    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const docPhone = doctor.phone;
    const msg =
      "Txt: Doctor Reminder Alert \n" +
      `Hello Dr. ${capitalizeFirstLetter(
        doctor.firstName
      )} ${capitalizeFirstLetter(doctor.lastName)}\n` +
      `${capitalizeFirstLetter(
        req.patient.clinicName
      )} just sent a chat reminder from sitibox consultation room . Kindly attend to this. Thanks \n` +
      "https://sitibox.9jaclinic.com";
    sendSMS({ phone: docPhone, message: msg });

    const adminPhone = process.env.ADMIN_PHONE;
    const adminMsg =
      "Txt: Doctor Reminder Alert \n" +
      `Hello Admin, Dr. ${capitalizeFirstLetter(
        doctor.firstName
      )} ${capitalizeFirstLetter(
        doctor.lastName
      )} was sent a chat reminder by` +
      `${capitalizeFirstLetter(
        req.patient.clinicName
      )}. Kindly followup the Doctor \n` +
      `Doctor: ${doctor.phone}, Thanks \n`;

    setTimeout(function () {
      sendSMS({ phone: adminPhone, message: adminMsg });
    }, 5000);

    res.json("sms sent successfully");
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error("Something went wrong");
  }
});

// @desc Update patient document
// @route PUT /api/patients/document
// @access Private
const updateDocument = asyncHandler(async (req, res) => {
  let patient = undefined;

  const { image } = req.body.myData;

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  try {
    patient = await Patient.findById(req.patient._id);
  } catch (err) {
    console.log(err);
    res.status(505);
    throw new Error("Patient not found!");
  }

  if (image) {
    try {
      if (patient.profileImageId) {
        await cloudinary.v2.uploader.destroy(patient.profileImageId);
      }
      const uploadedResponse = await cloudinary.v2.uploader.upload(image, {
        resource_type: "image",
        folder: "liorwell",
        width: 450,
        height: 450,
        crop: "scale",
        quality: "auto",
      });

      if (uploadedResponse) {
        const profileImage = uploadedResponse.secure_url;
        const profileImageId = uploadedResponse.public_id;
        patient.image = profileImage;
        patient.imageId = profileImageId;
      }
    } catch (err) {
      console.log(err);
      res.status(505);
      throw new Error(
        "Something went wrong with upload profile picture. Try Again"
      );
    }
  }

  const updatedPatient = await patient.save();

  if (updatedPatient) {
    res.json({
      _id: updatedPatient._id,
      clinicName: updatedPatient.clinicName,
      email: updatedPatient.email,
      gender: updatedPatient.gender,
      phone: updatedPatient.phone,
      image: updatedPatient.image,
      phoneVerified: updatedPatient.phoneVerified,
      token: generateToken(updatedPatient._id),
    });
  } else {
    console.log(err);
    res.status(505);
    throw new Error("Something went wrong. Try Again");
  }
});

// @desc Update patient password
// @route PUT /api/patients/pw
// @access Private

const updatepw = asyncHandler(async (req, res) => {
  const { password } = req.body.myData;

  const patient = await Patient.findById(req.patient._id);

  if (patient && password) {
    patient.password = password;

    const updatedPw = await patient.save();

    if (updatedPw) {
      res.json("password update successfull");
    } else {
      res.status(404);
      throw new Error("Not successfull, pls try again!");
    }
  } else {
    res.status(404);
    throw new Error("Patient not found");
  }
});

export {
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
};
