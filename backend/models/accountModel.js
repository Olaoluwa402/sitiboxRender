import mongoose from "mongoose";

const accountSchema = mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Doctor",
    },
    name: {
      type: String,
      required: true,
    },
    acctNumber: {
      type: String,
      required: true,
    },
    bankName: {
      type: String,
      required: true,
    },
    paymentPattern: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Account = mongoose.model("Account", accountSchema);

export default Account;
