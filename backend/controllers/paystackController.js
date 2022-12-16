import asyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";
import axios from "axios";

const getInitializePayment = asyncHandler(async (req, res, next) => {
    const { name, email, amount } = req.body;

    const form = {
        name: name,
        email: email,
    };
    form.metadata = {
        name: form.name,
        email: form.email,
    };
    form.amount = amount * 100;


    const PAYSTACK_KEY = process.env.PAYSTACK_KEY;

    const url = "https://api.paystack.co/transaction/initialize";
    const option = {
        headers: {
            authorization: `Bearer ${PAYSTACK_KEY}`,
            "content-type": "application/json",
            "cache-control": "no-cache",
        },
    };

    const { data } = await axios.post(`${url}`, form, option);
    res.redirect(data.data.authorization_url)
});

const getVerifyPayment = asyncHandler(async (req, res) => {

    const ref = req.params.ref;

    const data = await axios.get(
        `https://api.paystack.co/transaction/verify/${ref}`, {
            headers: {
                authorization: `Bearer ${process.env.PAYSTACK_KEY}`,
                "content-type": "application/json",
                "cache-control": "no-cache",
            },
        }
    );


    if (data.data.status === true) {
        res.status(200).json(data.data);
    } else {
        res.status(500);
        throw new Error("Not verified, invalid credentials");
    }
});

export { getInitializePayment, getVerifyPayment };