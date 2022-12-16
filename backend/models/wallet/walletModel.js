import mongoose from "mongoose";

const walletSchema =  new mongoose.Schema(
  {
    balance: { type: Number, default: 0 },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
    },  
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
      },
  },
  { timestamps: true }
);

 const Wallet = mongoose.model("Wallet", walletSchema);

 export default Wallet; 
