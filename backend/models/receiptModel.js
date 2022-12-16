import mongoose from "mongoose";

const receiptSchema = mongoose.Schema(
    {
        reference: { type: String, required: true },
        order: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Order",
        },
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Patient",
        },
        receiptNo: { type: String, required: true },
        email_address: { type: String, required: true },
        amount:{type:Number, required:true},
        last4Digit: { type: String, required: true },
        bank: { type: String, required: true },
        card_type: { type: String, required: true },
        currency: { type: String, required: true },
        channel: { type: String, required: true },
        method: { type: String, required: true },
        paidAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

const Receipt = mongoose.model("Receipt", receiptSchema);

export default Receipt;
