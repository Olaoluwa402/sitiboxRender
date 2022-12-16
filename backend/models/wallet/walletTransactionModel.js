import mongoose from "mongoose";

const walletTransactionSchema = new mongoose.Schema(
  {
    amount: { type: Number, default: 0 },

    // Even though user can be implied from wallet, let us
    // double save it for security
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
    },

    isInflow: { type: Boolean },

    paymentMethod: { type: String, default: "paystatck" },

    currency: {
      type: String,
      required: [true, "currency is required"],
      enum: ["NGN", "USD", "EUR", "GBP"],
    },

    status: {
      type: String,
      required: [true, "payment status is required"],
      enum: ["success", "pending", "failed"],
    },
  },
  { timestamp: true }
);

const WalletTransaction = mongoose.model("WalletTransaction", walletTransactionSchema);

export default WalletTransaction;
