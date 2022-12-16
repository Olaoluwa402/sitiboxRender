import mongoose from "mongoose";

const promocodeSchema = mongoose.Schema({
    promoCode: {
        type: String,
        required: true,
        unique:true
    },
    expirePromoCode: {
        type: Date,
        required: true,
    },
},{
    timestamps: true,
});
const PromoCode = mongoose.model("PromoCode", promocodeSchema);

export default PromoCode;
 