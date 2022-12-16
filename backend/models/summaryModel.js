import mongoose from "mongoose";

const summarySchema = mongoose.Schema(
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
    summaryDetail: {
      name: { type: String, required: true },
      age: { type: Number },
      summary: { type: String, required: true },
      doctorName: { type: String, required: true },
      doctorSpecialty: { type: String, required: true },
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Order",
    },
  },
  {
    timestamps: true,
  }
);

const Summary = mongoose.model("Summary", summarySchema);

export default Summary;
