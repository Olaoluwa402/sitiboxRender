import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Order from '../orderModel.js';
import Prescription from '../prescriptionModel.js';
import Receipt from '../receiptModel.js';
import Summary from '../summaryModel.js';
import Referral from '../referralModel.js';

const patientSchema = new mongoose.Schema({
    clinicName: {
        type: String,
        required: true,
        unique: true,
    },
    firstName:{
        type: String,
        required: true,
    },
    lastName:{
        type: String,
        required: true, 
    },
    age:{ 
        type: String,
    },
    emailIsVerified:{
        type: Boolean,
        default: false
    },
    emailVerificationToken:{
        type: String,
    },
    birthDate:{
        type: Date,
    },
     isAgreedToTerms:{
        type: String,
        required: true,
    },
    
    image: {
        type: String,
    },
    imageId: {
        type: String,
    },
    phone: {
        type: Number,
        required: true
    },
    phoneVerified: {
        type: Boolean,
        default: false
    },
    phoneVerificationId: {
        type: String
    },
    gender: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    resetToken:{
        type: String
    },
    expireToken:Date,
}, {
    timestamps: true,
});

patientSchema.pre("remove", function(next){
	Order.find({patient: this.id}, (err, orders) => {
			if(err){
				next(err);
			} else if(orders.length > 0){
				next(new Error("This patient has orders still"));
			} else {
				next();
			}
	});
});

patientSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

patientSchema.pre("save", async function(next) {
    if (!this.isModified("password")) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});
const Patient = mongoose.model("Patient", patientSchema);

export default Patient;