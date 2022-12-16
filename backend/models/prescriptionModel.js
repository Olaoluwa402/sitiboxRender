import mongoose from "mongoose";

const prescriptionSchema = mongoose.Schema(
  {
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
    presDetail: {
      name: { type: String, required: true },
      age: { type: Number, required: true },
      prescription: { type: String, required: true },
      prescriptionNumber: { type: String, required: true },
      doctorName: { type: String, required: true },
      doctorSpecialty: { type: String, required: true },
    },
  },
  {
    timestamps: true,
  }
);

const Prescription = mongoose.model("Prescription", prescriptionSchema);

export default Prescription;
