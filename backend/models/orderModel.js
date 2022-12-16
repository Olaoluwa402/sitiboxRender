import mongoose from "mongoose";

const orderSchema = mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Patient",
    },
    consultationorderItem: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      image: { type: String, required: true },
      specialty: { type: String, required: true },
      phone: { type: Number, required: true },
      doctor: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Doctor",
      },
    },
    mycomplaint: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      birthdate: { type: Date },
      complaint: { type: String, required: true },
      age: { type: Number },
      gender: { type: String },
      image: { type: String },
      imageId: { type: String },
    },
    paymentMethods: { 
      type: String,
      required: true,
    }, 
    paymentResult: {
      userId: { type: String },
      amount: { type: Number,},
      status: { 
        type: String,
        enum: ["success", "pending", "failed"],
        default: "pending", 
      },
      method:{ type: String,
        enum: ["wallet", "paystack", "flutterwave"],
        default: "wallet", 
      },
      email_address: { type: String },
    },
    consultationPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isConfirmed: {
      type: Boolean,
      required: true,
      default: false,
    },
    isConfirmedAt: {
      type: Date,
    },
    doctorIsPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    summaryWritten: {
      type: Boolean,
      required: true,
      default: false,
    },
    orderExpiryDate: {
      type: Date,
      required: true,
    },
    doctorIsPaidAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
