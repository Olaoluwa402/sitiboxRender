import mongoose from "mongoose";

const referralSchema = mongoose.Schema({
        doctor: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Doctor",
        },
        patient: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: "Patient",
            },
        orderId: {
                type: mongoose.Schema.Types.ObjectId, 
                required: true,
                ref: "Order", 
              },
       referralDetail: {
            name: { type: String, required: true },
            age: { type: Number, required: true },
            referral: {type: String, required: true},
            doctorName: { type: String, required: true },
            doctorSpecialty: { type: String, required: true },
        },
        
    }, {
        timestamps: true,
    }

);

const Referral = mongoose.model("Referral", referralSchema);

export default Referral;