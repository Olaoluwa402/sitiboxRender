import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Account from "../accountModel.js";


const reviewSchema = mongoose.Schema({
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Patient',
    },
}, {
    timestamps: true,
});

const doctorSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName:{
        type: String,
        required: true,
    },
    inviteCode:{
        type:String,
        required:true,
        unique: true,
    },
     ingressCode1:{
        type:String,
    },
     ingressCode1Confirmed: {
        type: Boolean,
        default: false
    },
     ingressCode2:{
        type:String,
    },
    ingressCode2Confirmed: {
        type: Boolean,
        default: false
    },
    specialty: {
        type: String,
        required: true,
    },
    gender:{
        type: String,
    },
    age:{
        type: String,
    },
    phone: {
        type: Number,
        required: true
    },
    birthDate:{
        type: Date,
    },
     isAgreedToTerms:{
        type: String,
        required: true,
    },
    
    phoneVerified: {
        type: Boolean,
        default: false
    },
    phoneVerificationId: {
        type: String
    },
    image: {
        type: String,
    },
    imageId: {
        type: String,
    },
   
    fellowshipExamImage: {
        type: String,
    },
    fellowshipExamImageId: {
        type: String,
    },
    licenseImage: {
        type: String,
    },
    licenseImageId: {
        type: String,
    },
    
    biodata: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    reviews: [reviewSchema],
    rating: {
        type: Number,
        required: true, 
        default: 3,
    },
    numReviews: {
        type: Number,
        required: true, 
        default: 0,
    },
    doctorIsVerified:{
        type: Boolean,
        required: true,
        default: false,
    },
    emailIsVerified:{
        type: Boolean,
        default: false
    },
    emailVerificationToken:{
        type: String,
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

doctorSchema.pre("remove", function(next){
	Account.find({doctor: this.id}, (err, doctors) => {
			if(err){
				next(err);
			} else if(doctors.length > 0){
				next(new Error("This doctor has account details still"));
			} else {
				next();
			}
	});
});

doctorSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

doctorSchema.pre("save", async function(next) {
    if (!this.isModified("password")) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});
const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;