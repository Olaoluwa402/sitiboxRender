import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
    },
    transactionId: {
      type: String,
      required:true,
    }, 
    transactionType:{ 
      type: String,
      required: [true, "transaction type is required"],
      enum: ["fund", "transfer"],
    },
    name: {
      type: String,
      required: [true, "name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      trim: true,
    },
    phone: {
      type: String,
    },
    amount: {
      type: Number,
      required: [true, "amount is required"],
    },
    currency: {
      type: String,
      required: [true, "currency is required"],
      enum: ["NGN", "USD", "EUR", "GBP"],
    },
    paymentStatus: {
      type: String,
      enum: ["success", "pending", "failed","reversed"],
      default: "pending",
    },
    paymentGateway: {
      type: String, 
      required: [true, "payment gateway is required"],
      enum: ["paystack"], // Payment gateway might differs as the application grows
    },
    transfer_code: {
      type: String,
    },
    account_number: {
      type: String,
    },
    reason: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;