import JWT from "jsonwebtoken";
import Patient from "../models/userModel/patientModel.js";
import Doctor from "../models/userModel/doctorModel.js";
import Admin from "../models/userModel/adminModel.js";
import asyncHandler from "express-async-handler";
import csrf from 'csurf';

const patientProtect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];

            const decoded = JWT.verify(token, process.env.JWT_SECRET);

            req.patient = await Patient.findById(decoded.id).select("-password");

            next();
        } catch (error) {
            res.status(401); 
            throw new Error("Not authorized, token failed");
        }
    }

    if (!token) {
        res.status(401);
        throw new Error("Not authorized, no token");
    }
});

const doctorProtect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];

            const decoded = JWT.verify(token, process.env.JWT_SECRET);

            req.doctor = await Doctor.findById(decoded.id).select("-password");

            next();
        } catch (error) {
            res.status(401);
            throw new Error("Not authorized, token failed");
        }
    }

    if (!token) {
        res.status(401);
        throw new Error("Not authorized, no token");
    }
});

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];

            const decoded = JWT.verify(token, process.env.JWT_SECRET);
            let user = await Patient.findById(decoded.id).select("-password");
            if (!user) {
                user = await Doctor.findById(decoded.id).select("-password");
            } 
            req.user = user;
            next();
        } catch (error) {
            res.status(401);
            throw new Error("Not authorized, token failed");
        }
    }

    if (!token) {
        res.status(401);
        throw new Error("Not authorized, no token");
    }
});



const adminProtect = asyncHandler(async (req, res, next) => {
    
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];

            const decoded = JWT.verify(token, process.env.JWT_SECRET);

            req.admin = await Admin.findById(decoded.id).select("-password");

            next();
        } catch (error) {
            res.status(401);
            throw new Error("Not authorized, token failed");
        }
    }

    if (!token) {
        res.status(401);
        throw new Error("Not authorized, no token");
    }
});

const isSecure = process.env.NODE_ENV === "production" ? true : false;

// middleware
const csrfProtection = csrf(
    { 
        cookie:{key:"_cProtect", secure:isSecure, sameSite:"lax", httpOnly:"true"}
    });

export { patientProtect, adminProtect, doctorProtect, protect, csrfProtection };