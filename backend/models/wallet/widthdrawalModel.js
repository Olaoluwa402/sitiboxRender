import mongoose from "mongoose";

const withdrawalTransactionSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
    },
    transactionType:{
      type: String,
      required: [true, "transaction type is required"],
      enum: ["Fund", "Widthdrawal"],
    },
    transfer_code: {
      type: String,
      required: true,
      trim: true,
    },
    reference: {
      type: String,
      required: true,
      trim: true,
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
    status: {
      type: String,
      enum: ["success", "pending", "failed"],
      default: "pending",
    },
    paymentGateway: {
      type: String,
      required: [true, "payment gateway is required"],
      enum: ["paystack"], // Payment gateway might differs as the application grows
    },
  },
  {
    timestamps: true,
  }
);

const WidthdrawalTransaction = mongoose.model("WidthdrawalTransaction", withdrawalTransactionSchema);
export default WidthdrawalTransaction;