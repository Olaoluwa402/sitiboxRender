import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors";
import patients from "./data/patients.js";
import admin from "./data/admin.js";
import doctors from "./data/doctors.js";
import Patient from "./models/userModel/patientModel.js";
import Doctor from "./models/userModel/doctorModel.js";
import Admin from "./models/userModel/adminModel.js";
import Order from "./models/orderModel.js";
import Messages from "./models/messagesModel.js";
import Chats from "./models/chatsModel.js";
import Prescription from "./models/prescriptionModel.js";
import Receipt from "./models/receiptModel.js";
import connectDB from "./config/db.js";
import PromoCode from "./models/promocodeModel.js";
import Referral from "./models/referralModel.js";
import Summary from "./models/summaryModel.js";

dotenv.config();

connectDB();

const importData = async () => {
    try {
        await Doctor.deleteMany();
        await Patient.deleteMany();
        await Admin.deleteMany();
        await Order.deleteMany();
        await Messages.deleteMany();
        await Chats.deleteMany();
        await Prescription.deleteMany();
        await Receipt.deleteMany();
        await PromoCode.deleteMany();
        await Referral.deleteMany();
        await Summary.deleteMany();

        // const createdPatients = await Patient.insertMany(patients);
        // const createdDoctor = await Doctor.insertMany(doctors);
        const createdAdmin = await Admin.insertMany(admin);

        console.log("Data Imported!".green.inverse);
        process.exit();
    } catch (error) {
        console.log(`${error}`.red.inverse);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Doctor.deleteMany();
        await Patient.deleteMany();
        await Admin.deleteMany();
        await Order.deleteMany();
        await Messages.deleteMany();
        await Chats.deleteMany();
        await Prescription.deleteMany();
        await Receipt.deleteMany();
        await PromoCode.deleteMany();
        await Referral.deleteMany();
        await Summary.deleteMany();

        console.log("Data Destroyed!".red.inverse);
        process.exit();
    } catch (error) {
        console.log(`${error}`.red.inverse);
        process.exit(1);
    }
};

if (process.argv[2] === "-d") {
    destroyData();
} else {
    importData();
}