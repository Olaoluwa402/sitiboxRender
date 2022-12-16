import asyncHandler from "express-async-handler";
import Order from "../../models/orderModel.js";
import Doctor from "../../models/userModel/doctorModel.js";
import Patient from "../../models/userModel/patientModel.js";
import Wallet from "../../models/wallet/walletModel.js";
import Prescription from "../../models/prescriptionModel.js";
import Summary from "../../models/summaryModel.js";
import Referral from "../../models/referralModel.js";
import Account from "../../models/accountModel.js";
import Lastcode from "../../models/userModel/lastcodeModel.js"; 
import generateToken from "../../utils/generateToken.js";
import { sendSMS } from "../../helpers/misc.js";
import cloudinary from "cloudinary";
import Vonage from "@vonage/server-sdk";
import crypto from "crypto";
import nodemailer from "nodemailer";
import mailGun from "nodemailer-mailgun-transport";
import smtp from "nodemailer-smtp-transport";
import googleapis from "googleapis";
import ejs from "ejs";
import path from "path";

const __dirname = path.resolve();
// @desc Auth doctor, get token
// @route POST /api/doctors/login
// @access Public

const authDoctor = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const doctor = await Doctor.findOne({ email });

  if (doctor && (await doctor.matchPassword(password))) {

      // check that wallet do not exist already
      const walletExist = await Wallet.findOne({doctorId:doctor._id});
      if(!walletExist){
        // create wallet if it does not exist yet
        await Wallet.create({
          doctorId:doctor._id
        })
      }

    res.status(201).json({
      _id: doctor._id,
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      inviteCode: doctor.inviteCode,
      ingressCode1: doctor.ingressCode1,
      ingressCode2: doctor.ingressCode2,
      specialty: doctor.specialty,
      phone: doctor.phone,
      phoneVerified: doctor.phoneVerified,
      email: doctor.email,
      image: doctor.image,
      imageId: doctor.imageId,
      age: doctor.age,
      birthDate: doctor.birthDate,
      biodata: doctor.biodata,
      token: generateToken(doctor._id),
      emailIsVerified: doctor.emailIsVerified,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc Check if email exist
// @route GET /api/doctors
// @access Public

const checkEmailexist = asyncHandler(async (req, res) => {
  const email = req.params.email;
  console.log("email", email);
  const mailExist1 = await Doctor.findOne({ email });
  const mailExist2 = await Patient.findOne({ email });

  if (mailExist1 || mailExist2) {
    res.json({
      emailExist: true,
      message: "Email already taken",
    });
  } else {
    res.json({
      emailExist: false,
      message: "Email is available",
    });
  }
});

// @desc Register doctor
// @route POST /api/doctors
// @access Public

const registerDoctor = asyncHandler(async (req, res) => {
  const { isChecked, firstName, lastName, phone, email, specialty, password } =
    req.body;

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

  // asign ingress code to doctor
  const lastAsignedCode = await Lastcode.find({}).sort({ _id: -1 }).limit(1);
  let inviteCode;
  lastAsignedCode.forEach((code) => {
    let codeToNumber = Number(code.lastAsignedCode);
    codeToNumber++;
    inviteCode = codeToNumber.toString();
  });

  await Lastcode.create({ lastAsignedCode: inviteCode });

  const myEmail = email.email;

  const doctorExist = await Doctor.findOne({ myEmail });
  const emailExist = await Patient.findOne({ myEmail });
  const inviteCodeExist = await Doctor.findOne({ inviteCode });

  if (doctorExist || emailExist) {
    res.status(400);
    throw new Error("email already exist");
  } else if (inviteCodeExist) {
    res.status(400);
    throw new Error("Ingress Code already taken");
  } else {
    try {
      const buffer = await crypto.randomBytes(32);
      const token = buffer.toString("hex");

      const Data = {
        isAgreedToTerms: isChecked,
        firstName: firstName,
        lastName: lastName,
        inviteCode: inviteCode,
        phone: phone,
        email: myEmail,
        specialty: specialty,
        password: password,
        emailIsVerified: false,
        emailVerificationToken: token,
      };

      const doctorRegistered = await Doctor.create(Data);

      if (doctorRegistered) {
        const patient = undefined;
        const template = await ejs.renderFile(
          __dirname + "/backend/views/mailVerificationTemplate.ejs",
          { doctor: doctorRegistered, patient: patient, token: token }
        );

        const mailOptions = {
          to: doctorRegistered.email,
          from: "Sitibox <support@9jaclinic.com>",
          subject: "Complete your registration",
          text:
            "Thanks for registering with Sitibox(powered by 9jaclinic)\n\n" +
            "Are you ready to gain access to all of the online consultation tools we prepared for clients and doctors of 9jaclinic?:\n\n" +
            "First you must complete your registration by clicking on the link below" +
            "https://" +
            "sitibox.9jaclinic.com" +
            "/d-confirm-email/" +
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
            name: doctorRegistered.firstName,
            email: doctorRegistered.email,
            isDoctor: true,
            msg: "Registration successful! Please check your mail to complete your registration",
          });
        } else {
          res.status(400);
          throw new Error("Mail not sent");
        }
      } else {
        res.status(400);
        throw new Error("Invalid doctor's data");
      }
    } catch (err) {
      console.log("err", err);
      res.status(400);
      throw new Error("Registration not successful, please try again", err);
    }
  }
});

// @desc email verification doctor
// @route POST /api/doctors/email-verification
// @access Public
const emailVerification = asyncHandler(async (req, res) => {
  const { emailToken } = req.body;

  const doctor = await Doctor.findOne({ emailVerificationToken: emailToken });

  if (!doctor) {
    // return res.status(422).json({error:"Try again session expired"})
    res.status(422);
    throw new Error("Please, you can login with your credentials");
  } else {
    doctor.emailVerificationToken = null;
    doctor.emailIsVerified = true;
    const saveddoctor = await doctor.save();

    if (saveddoctor) {
      res.status(201).json({
        _id: saveddoctor._id,
        firstName: saveddoctor.firstName,
        lastName: saveddoctor.lastName,
        inviteCode: saveddoctor.inviteCode,
        specialty: saveddoctor.specialty,
        phone: saveddoctor.phone,
        phoneVerified: saveddoctor.phoneVerified,
        email: saveddoctor.email,
        image: saveddoctor.image,
        imageId: saveddoctor.imageId,
        age: saveddoctor.age,
        birthDate: saveddoctor.birthDate,
        biodata: saveddoctor.biodata,
        token: generateToken(saveddoctor._id),
        emailIsVerified: saveddoctor.emailIsVerified,
      });

      // sent text message to admin
      function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }

      const adminPhone = process.env.ADMIN_PHONE;
      const adminMsg =
        "Txt: Verify Doctor Alert \n" +
        `Dr. ${capitalizeFirstLetter(
          saveddoctor.firstName
        )} ${capitalizeFirstLetter(
          saveddoctor.lastName
        )} has just registered and email verified. \n` +
        "Kindly verify account if records are correct. Thanks \n" +
        "https://sitibox.9jaclinic.com/admindashboard";
      sendSMS({ phone: adminPhone, message: adminMsg });

      const docPhone = saveddoctor.phone;
      const Msg =
        "Txt: Verification Alert \n" +
        ` Your email has been confirmed Dr. ${capitalizeFirstLetter(
          saveddoctor.firstName
        )} ${capitalizeFirstLetter(saveddoctor.lastName)}. \n` +
        "Kindly login to complete your records. Your account will be verified by our admin once all records are filled. Thanks \n" +
        "https://sitibox.9jaclinic.com/docdashboard";

      setTimeout(function () {
        sendSMS({ phone: docPhone, message: Msg });
      }, 4000);
    } else {
      res.status(401);
      throw new Error("Please try again or contact us");
    }
  }
});

// @desc reset doctor password
// @route POST /api/doctor/passwordreset
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
      res.status(400);
      throw new Error("Something went wrong with buffer generation");
    }
    const doctor = await Doctor.findOne({ email: req.body.email });

    if (!doctor) {
      res.status(400);
      throw new Error("Doctor does no exist");
    } else {
      const patient = undefined;
      const template = await ejs.renderFile(
        __dirname + "/backend/views/forgotPasswordTemplate.ejs",
        { doctor: doctor, patient: patient, token: token }
      );

      const mailOptions = {
        to: doctor.email,
        from: "Sitibox <support@9jaclinic.com>",
        subject: "password reset",
        text:
          "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
          "Please click on the following link, to complete the process:\n\n" +
          "https://" +
          "sitibox.9jaclinic.com" +
          "/dresetpw/" +
          token +
          "\n\n" +
          "If you did not request this, please ignore this email and your password will remain unchanged.\n",
        html: template,
      };

      doctor.resetToken = token;
      // expires in 1months time
      doctor.expireToken = Date.now() + 2.62974383 * 10 ** 9;

      const result = await doctor.save();

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
    res.status(400);
    throw new Error(err);
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

  const doctor = await Doctor.findOne({ email });

  doctor.emailVerificationToken = token;

  const savedDoctor = await doctor.save();

  if (savedDoctor) {
    try {
      const patient = undefined;
      const template = await ejs.renderFile(
        __dirname + "/backend/views/mailVerificationTemplate.ejs",
        { patient: patient, doctor: savedDoctor, token: token }
      );

      const mailOptions = {
        to: savedDoctor.email,
        from: "Sitibox <support@9jaclinic.com>",
        subject: "Complete registration",
        text:
          "Thanks for registering with Sitibox(powered by 9jaclinic)\n\n" +
          "Are you ready to gain access to all of the online consultation tools we prepared for clients and doctors of 9jaclinic?:\n\n" +
          "First you must complete your registration by clicking on the link below" +
          "https://" +
          "sitibox.9jaclinic.com" +
          "/d-confirm-email/" +
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

// @desc set new doctor password
// @route POST /api/doctor/newpassword
// @access Private

const newPassword = asyncHandler(async (req, res) => {
  const newPassword = req.body.password;
  const sentToken = req.body.token;

  try {
    const doctor = await Doctor.findOne({
      resetToken: sentToken,
      expireToken: { $gt: Date.now() },
    });

    if (doctor) {
      doctor.password = newPassword;
      doctor.resetToken = undefined;
      doctor.expireToken = undefined;
      const saveddoctor = await doctor.save();
      if (saveddoctor) {
        res.json("password updated successfully");
      }
    }
  } catch (err) {
    res.status(422);
    throw new Error("Try again session expired", err);
  }
});

// @desc POST verify doctor number
// @route POST /api/doctors/docphoneverify
// @access Private

const verifyDocPhone = asyncHandler(async (req, res, next) => {
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
        throw new Error(err);
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
// @route POST /api/doctors/docphoneverify
// @access Private

const verifyDocPhoneCode = asyncHandler(async (req, res) => {
  const { code, verifyId, docId } = req.body;

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
        throw new Error(err);
      } else {
        if (result.status === "0") {
          const doctor = await Doctor.findById({ _id: docId });
          if (doctor) {
            doctor.phoneVerified = true;
            doctor.phoneVerificationId = verifyId;

            const updatedDoctor = await doctor.save();

            const updatedProfile = {
              _id: updatedDoctor._id,
              name: updatedDoctor.name,
              email: updatedDoctor.email,
              image: updatedDoctor.image,
              phone: updatedDoctor.phone,
              phoneVerified: updatedDoctor.phoneVerified,
              biodata: updatedDoctor.biodata,
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

// @desc GET doctor profile
// @route GET /api/doctors/profile
// @access Private

const getDoctorProfile = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.doctor._id);

  if (doctor) {
    res.json({
      _id: doctor._id,
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      ingressCode: doctor.inviteCode,
      email: doctor.email,
      image: doctor.image,
      gender: doctor.gender,
      specialty: doctor.specialty,
      phone: doctor.phone.toString(),
      phoneVerified: doctor.phoneVerified,
      doctorIsVerified: doctor.doctorIsVerified,
      biodata: doctor.biodata,
      rating: doctor.rating,
      numReviews: doctor.numReviews,
      fellowshipExamImage: doctor.fellowshipExamImage,
      licenseImage: doctor.licenseImage,
    });
  } else {
    res.status(404);
    throw new Error("Doctor not found");
  }
});

// @desc Update doctor profile
// @route PUT /api/doctors/profile
// @access Private

const updateDoctorProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName, phone, biodata, email, specialty } =
    req.body.myData;

  try {
    const doctor = await Doctor.findById(req.doctor._id);

    if (doctor) {
      if (firstName) {
        doctor.firstName = firstName;
      }

      if (lastName) {
        doctor.lastName = lastName;
      }

      if (email) {
        doctor.email = email;
      }

      if (phone) {
        doctor.phone = phone;
      }

      if (biodata) {
        doctor.biodata = biodata;
      }

      if (specialty) {
        doctor.specialty = specialty;
      }

      if (doctor.phone) {
        doctor.phoneVerified = false;
      }

      const updatedDoctor = await doctor.save();

      if (updatedDoctor) {
        res.json({
          _id: updatedDoctor._id,
          firstName: updatedDoctor.firstName,
          lastName: updatedDoctor.lastName,
          email: updatedDoctor.email,
          ingressCode: updatedDoctor.inviteCode,
          ingressCode1: updatedDoctor.ingressCode1,
          ingressCode2: updatedDoctor.ingressCode2,
          gender: updatedDoctor.gender,
          phone: updatedDoctor.phone,
          phoneVerified: updatedDoctor.phoneVerified,
          biodata: updatedDoctor.biodata,
          doctorIsVerified: updatedDoctor.doctorIsVerified,
          specialty: updatedDoctor.specialty,
          image: updatedDoctor.image,
          licenseImage: updatedDoctor.licenseImage,
          fellowshipExamImage: updatedDoctor.fellowshipExamImage,
          token: generateToken(updatedDoctor._id),
        });
      }
    }
  } catch (error) {
    console.log("err", error);
    res.status(500);
    throw new Error("Doctor not found");
  }
});

// @desc Get all doctors
// @route GET /api/doctors
// @access Public

const getDoctors = asyncHandler(async (req, res) => {
  const doctors = await Doctor.find({});

  res.json(doctors);
});

const getDoctorById = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id).select("-password");

  if (doctor) {
    res.json(doctor);
  } else {
    res.status(404);
    throw new Error("Doctor not found");
  }
});

// @desc POST create prescription
// @route GET /api/doctors/prescription
// @access Private
const newPrescription = asyncHandler(async (req, res) => {
  const { presDetail } = req.body;

  try {
    const exist = await Prescription.findOne({ orderId: presDetail.orderId });

    if (exist) {
      res.status(400);
      throw new Error("Prescription already written for this order");
    }

    const prescription = new Prescription({
      doctor: req.doctor._id,
      patient: presDetail.patient,
      orderId: presDetail.orderId,
      presDetail: presDetail,
    });

    const createdPrescription = await prescription.save();

    res.status(201).json(createdPrescription);
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc POST create consulation summary
// @route GET /api/doctors/summary
// @access Private
const newConsultationSummary = asyncHandler(async (req, res) => {
  const { summaryDetail } = req.body;

  try {
    const exist = await Summary.findOne({ orderId: summaryDetail.orderId });
    const order = await Order.findById({ _id: summaryDetail.orderId });

    if (exist) {
      res.status(400);
      throw new Error("Case file already exist");
    }

    if (order) {
      order.summaryWritten = true;
      const summary = new Summary({
        doctor: req.doctor._id,
        patient: summaryDetail.patient,
        summaryDetail: summaryDetail,
        orderId: summaryDetail.orderId,
      });

      await order.save();
      const createdSummary = await summary.save();

      res.status(201).json(createdSummary);
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Get summary by ID
// @route   GET /api/summaries/summary/:id
// @access
const getSummaryById = asyncHandler(async (req, res) => {
  const summary = await Summary.findById(req.params.id).populate(
    "patient",
    "firstName lastName"
  );

  if (summary) {
    res.json(summary);
  } else {
    res.status(404);
    throw new Error("summary not found");
  }
});

// @desc    Get all my generated prescriptions for doctor
// @route   GET /api/doctors/prescriptions
// @access  Private
const getMyGeneratedPrescriptions = asyncHandler(async (req, res) => {
  try {
    const prescriptions = await Prescription.find({
      doctor: req.doctor._id,
    })
      .populate("patient", "firstName lastName")
      .sort({ _id: -1 });
    res.json(prescriptions);
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error("Something went wrong");
  }
});

// @desc Update summary
// @route PUT /api/doctors/prescriptions/:id//edit
// @access Private  

const updatePrescription = asyncHandler(async (req, res) => {
  const prescriptionId = req.params.id;
  const { name, age, prescription } = req.body.myData;

  const isPrescription = await Prescription.findById(prescriptionId);

  if (isPrescription) {
    if (name) { 
      isPrescription.presDetail.name = name;
    }

    if (age) {
      isPrescription.presDetail.age = age;
    }

    if (prescription) {
      isPrescription.presDetail.prescription = prescription;
    }

    const updatedPrescription = await isPrescription.save();

    if (updatedPrescription) {
      res.json(updatedPrescription);
    } else {
      res.status(404);
      throw new Error("Not successfull, pls try again!");
    }
  } else {
    res.status(404);
    throw new Error("No record found");
  }
});


// @desc    Get all my generated summary for doctor
// @route   GET /api/doctors/summaries
// @access  Private
const getMyGeneratedSummaries = asyncHandler(async (req, res) => {
  try {
    const summaries = await Summary.find({ doctor: req.doctor._id }).populate(
      "patient",
      "firstName lastName"
    );
    res.json(summaries);
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error("Something went wrong");
  }
});

// @desc Update summary
// @route PUT /api/doctors/summaries/:id//edit
// @access Private

const updateSummaries = asyncHandler(async (req, res) => {
  const summaryId = req.params.id;
  const { name, age, summary } = req.body.myData;

  const isSummary = await Summary.findById(summaryId);

  if (isSummary) {
    if (name) {
      isSummary.summaryDetail.name = name;
    }

    if (age) {
      isSummary.summaryDetail.age = age;
    }

    if (summary) {
      isSummary.summaryDetail.summary = summary;
    }

    const updatedSummary = await isSummary.save();

    if (updatedSummary) {
      res.json(updatedSummary);
    } else {
      res.status(404);
      throw new Error("Not successfull, pls try again!");
    }
  } else {
    res.status(404);
    throw new Error("No record found");
  }
});

// @desc    Get all my generated summary per patient
// @route   GET /api/doctors/chatsummaries
// @access  Private
const getChatSummaries = asyncHandler(async (req, res) => {
  try {
    const summaries = await Summary.find({ patient: req.params.id }).sort({
      _id: -1,
    });
    res.json(summaries);
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error("Something went wrong");
  }
});

// @desc    Create new review
// @route   POST /api/doctors/:id/reviews
// @access  only logged in patient
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const doctor = await Doctor.findById(req.params.id);

  if (doctor) {
    const alreadyReviewed = doctor.reviews.find(
      (r) => r.user.toString() === req.patient._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error(" Already reviewed");
    }

    const review = {
      name: req.patient.clinicName,
      rating: Number(rating),
      comment, 
      user: req.patient._id,
    }; 

    doctor.reviews.push(review); 

    doctor.numReviews = doctor.reviews.length;

    doctor.rating =
      doctor.reviews.reduce((acc, item) => item.rating + acc, 0) /
      doctor.reviews.length;

    await doctor.save();
    res.status(201).json({ message: "Review added" });
  } else {
    res.status(404);
    throw new Error("Doctor not found");
  }
});

// @desc POST create consulation referral
// @route POST /api/doctors/referral
// @access Private
const newConsultationReferral = asyncHandler(async (req, res) => {
  const { referralDetail } = req.body;

  try{
    const exist = await Referral.findOne({ orderId: referralDetail.orderId });
    const order = await Order.findById({ _id: referralDetail.orderId });

    if (exist) {
      res.status(400);
      throw new Error("A referral file for this order already exist");
    }

    if (order) {

      const referral = new Referral({
          doctor: req.doctor._id, 
          patient: referralDetail.patient,
          orderId:referralDetail.orderId,
          referralDetail: referralDetail, 
        });


        const createdReferral = await referral.save();

        res.status(201).json(createdReferral);
    }
  }catch(error){
    res.status(500);
    throw new Error(error);
  }

});

// @desc    Get all referrals a doctor generated
// @route   GET /api/doctors/referrals
// @access  Private
const getMyGeneratedReferrals = asyncHandler(async (req, res) => {
  try {
    const referrals = await Referral.find({ doctor: req.doctor._id }).sort({
      _id: -1,
    }).populate(
      "patient",
      "firstName lastName"
    );
    res.json(referrals);
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error("Something went wrong");
  }
});

// @desc    Get referral by ID
// @route   GET /api/doctors/referrals/:id
// @access
const getreferralById = asyncHandler(async (req, res) => {
  const referral = await Referral.findById(req.params.id).populate(
    "patient",
    "firstName lastName"
  );;

  if (referral) {
    res.json(referral);
  } else {
    res.status(404);
    throw new Error("referral not found");
  }
});

// @desc Update referral
// @route PUT /api/doctors/referrals/:id//edit
// @access Private

const updateReferral = asyncHandler(async (req, res) => {
  const referralId = req.params.id;
  const { name, age, referral } = req.body.myData;

  const isReferral = await Referral.findById(referralId);

  if (isReferral) {
    if (name) {
      isReferral.referralDetail.name = name;
    }

    if (age) {
      isReferral.referralDetail.age = age;
    }

    if (referral) {
      isReferral.referralDetail.referral = referral;
    }

    const updatedReferral = await isReferral.save();

    if (updatedReferral) {
      res.json(updatedReferral);
    } else {
      res.status(404);
      throw new Error("Not successfull, pls try again!");
    }
  } else {
    res.status(404);
    throw new Error("No record found");
  }
});


// @desc    Get Doctor  by invite Id
// @route   GET /api/doctors/:id/doctor_invite
// @access  public
const getDoctorByInviteId = asyncHandler(async (req, res) => {
  const doctorInviteID = req.params.id;

  const code = doctorInviteID.toLowerCase();

  // const doctor = await Doctor.find({doctorInviteId:req.params.doctorInviteID});
  const doctor = await Doctor.findOne({
    inviteCode: code,
    doctorIsVerified: true,
  });

  if (doctor) {
    const doc = {
      doctorId: doctor._id,
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      image: doctor.image,
      specialty: doctor.specialty,
      gender: doctor.gender,
      biodata: doctor.biodata,
      rating: doctor.rating,
      doctorIsVerified: doctor.doctorIsVerified,
    };
    res.json(doc);
  } else {
    res.status(404);
    throw new Error(
      "Doctor not found, pls confirm the invite id is correct and try again"
    );
  }
});

// @desc POST add account detail
// @route POST /api/doctors/acct
// @access Private
const addAcctDetail = asyncHandler(async (req, res) => {
  const { myData } = req.body;

  try {
    const account = new Account({
      doctor: req.doctor._id,
      name: myData.name,
      acctNumber: myData.acctNumber,
      bankName: myData.bankName,
      paymentPattern: myData.paymentPattern,
    });

    const createdAccount = await account.save();

    res.status(201).json(createdAccount);
  } catch (error) {
    res.status(500);
    throw new Error("Not successful. Try again");
  }
});

// @desc GET accounts
// @route GET /api/doctors/acct
// @access Private doctor
const getAcctList = asyncHandler(async (req, res) => {
  try {
    const accts = await Account.find({ doctor: req.doctor._id });

    res.status(201).json(accts);
  } catch (error) {
    res.status(500);
    console.log(error);
    throw new Error("No Account found!");
  }
});

// @desc GET accounts
// @route GET /api/doctors/:id/acct
// @access
const acctListOpenAccess = asyncHandler(async (req, res) => {
  try {
    const accts = await Account.find({ doctor: req.params.id });

    res.status(201).json(accts);
  } catch (error) {
    res.status(500);
    console.log(error);
    throw new Error("No Account found!");
  }
});

// @desc GET account detail
// @route GET /api/doctors/acct/:id
// @access Private
const getAcctDetail = asyncHandler(async (req, res) => {
  const acct = await Account.findOne({ _id: req.params.id });

  if (acct) {
    res.status(201).json(acct);
  } else {
    console.log("err", error);
    res.status(500);
    throw new Error(error);
  }
});

// @desc Update doctor acct
// @route PUT /api/doctors/acct
// @access Private

const updateAcct = asyncHandler(async (req, res) => {
  const { name, acctNumber, bankName, paymentPattern } = req.body.myData;

  const account = await Account.findOne({ doctor: req.doctor._id });

  if (account) {
    if (name) {
      account.name = name;
    }

    if (acctNumber) {
      account.acctNumber = acctNumber;
    }

    if (bankName) {
      account.bankName = bankName;
    }
    if (paymentPattern) {
      account.paymentPattern = paymentPattern;
    }

    const updatedAcct = await account.save();

    if (updatedAcct) {
      res.json(updatedAcct);
    } else {
      res.status(404);
      throw new Error("Not successfully, pls try again!");
    }
  } else {
    res.status(404);
    throw new Error("Account not found");
  }
});

// @desc Delete Acct
// @route DELETE /api/doctors/:id
// @access Private/Doctor

const deleteAcct = asyncHandler(async (req, res) => {
  const account = await Account.findById(req.params.id);

  if (account) {
    await account.remove();
    res.json("Account deleted!");
  } else {
    res.status(404);
    throw new Error("Account not found");
  }
});

// @desc Update doctor password
// @route PUT /api/doctors/pw
// @access Private

const updatepw = asyncHandler(async (req, res) => {
  const { password } = req.body.myData;

  const doctor = await Doctor.findById(req.doctor._id);

  if (doctor && password) {
    doctor.password = password;

    const updatedPw = await doctor.save();

    if (updatedPw) {
      res.json("password update successfull");
    } else {
      res.status(404);
      throw new Error("Not successfull, pls try again!");
    }
  } else {
    res.status(404);
    throw new Error("Doctor not found");
  }
});

// @desc Update doctor document
// @route PUT /api/doctors/document
// @access Private

const updateDocument = asyncHandler(async (req, res) => {
  let doctor = undefined;

  const { image, fellowshipExam, license } = req.body.myData;

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  try {
    doctor = await Doctor.findById(req.doctor._id);
  } catch (err) {
    console.log(err);
    res.status(505);
    throw new Error("Doctor not found!");
  }

  if (image) {
    try {
      if (doctor.profileImageId) {
        await cloudinary.v2.uploader.destroy(doctor.profileImageId);
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
        doctor.image = profileImage;
        doctor.imageId = profileImageId;
      }
    } catch (err) {
      console.log(err);
      res.status(505);
      throw new Error(
        "Something went wrong with upload profile picture. Try Again"
      );
    }
  }

  if (fellowshipExam) {
    try {
      if (doctor.fellowshipExamImageId) {
        await cloudinary.v2.uploader.destroy(doctor.fellowshipExamImageId);
      }

      const uploadedResponse = await cloudinary.v2.uploader.upload(
        fellowshipExam,
        {
          resource_type: "auto",
          folder: "Documents",
        }
      );

      if (uploadedResponse) {
        const fellowshipExamImage = uploadedResponse.secure_url;
        const fellowshipExamImageId = uploadedResponse.public_id;
        doctor.fellowshipExamImage = fellowshipExamImage;
        doctor.fellowshipExamImageId = fellowshipExamImageId;
      }
    } catch (err) {
      console.log(err);
      res.status(505);
      throw new Error("Something went wrong with PDF upload. Try Again");
    }
  }

  if (license) {
    try {
      if (doctor.licenseImageId) {
        await cloudinary.v2.uploader.destroy(doctor.licenseImageId);
      }
      const uploadedResponse = await cloudinary.v2.uploader.upload(license, {
        resource_type: "auto",
        folder: "Documents",
      });

      if (uploadedResponse) {
        const licenseImage = uploadedResponse.secure_url;
        const licenseImageId = uploadedResponse.public_id;
        doctor.licenseImage = licenseImage;
        doctor.licenseImageId = licenseImageId;
      }
    } catch (err) {
      console.log(err);
      res.status(505);
      throw new Error("Something went wrong PDF upload. Try Again");
    }
  }

  const updatedDoctor = await doctor.save();

  if (updatedDoctor) {
    res.json({
      _id: updatedDoctor._id,
      firstName: updatedDoctor.firstName,
      lastName: updatedDoctor.lastName,
      email: updatedDoctor.email,
      ingressCode: updatedDoctor.inviteCode,
      ingressCode1: updatedDoctor.ingressCode1,
      ingressCode2: updatedDoctor.ingressCode2,
      gender: updatedDoctor.gender,
      phone: updatedDoctor.phone,
      phoneVerified: updatedDoctor.phoneVerified,
      biodata: updatedDoctor.biodata,
      doctorIsVerified: updatedDoctor.doctorIsVerified,
      specialty: updatedDoctor.specialty,
      image: updatedDoctor.image,
      licenseImage: updatedDoctor.licenseImage,
      fellowshipExamImage: updatedDoctor.fellowshipExamImage,
      token: generateToken(updatedDoctor._id),
    });
  } else {
    console.log(err);
    res.status(505);
    throw new Error("Something went wrong. Try Again");
  }
});

// @desc    POST send sms reminder to patient
// @route   GET /api/doctors/reminder
// @access  Private
const sendSmsReminder = asyncHandler(async (req, res) => {
  const { receiver } = req.body;
  try {
    const patient = await Patient.findById({ _id: receiver });

    // sent text message to admin
    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const patientPhone = patient.phone;
    const msg =
      "Txt: Reminder Alert \n" +
      `Hello ${capitalizeFirstLetter(patient.clinicName)}\n` +
      `Dr ${capitalizeFirstLetter(
        req.doctor.firstName
      )} just sent a chat reminder from sitibox consultation room . You have a message. Kindly attend to this. Thanks \n` +
      "https://sitibox.9jaclinic.com";
    sendSMS({ phone: patientPhone, message: msg });

    res.json("sms sent successfully");
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error("Something went wrong");
  }
});

export {
  authDoctor,
  checkEmailexist,
  registerDoctor,
  getDoctorProfile,
  updateDoctorProfile,
  getDoctors,
  getDoctorById,
  verifyDocPhone,
  verifyDocPhoneCode,
  newPrescription,
  getMyGeneratedPrescriptions,
  updatePrescription,
  createProductReview,
  newPassword,
  passwordReset,
  newConsultationSummary,
  getMyGeneratedSummaries,
  getSummaryById,
  getChatSummaries,
  newConsultationReferral,
  getMyGeneratedReferrals,
  getreferralById,
  updateReferral,
  emailVerification,
  getDoctorByInviteId,
  resendMail,
  addAcctDetail,
  getAcctList,
  acctListOpenAccess,
  getAcctDetail,
  updateAcct,
  deleteAcct,
  updatepw,
  updateDocument,
  sendSmsReminder,
  updateSummaries,
};
