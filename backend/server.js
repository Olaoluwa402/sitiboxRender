// cofig connection
dotenv.config();

import { Server } from "socket.io";
import { createServer } from "http";
import express from "express";
import JWT from "jsonwebtoken";
import { socketConfig } from "./utils/socket.js";
import cookieParser from "cookie-parser";

const app = express();
const server = createServer(app);
const io = new Server(server);

import path from "path";
import dotenv from "dotenv";
import colors from "colors";
import morgan from "morgan";
import cors from "cors";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
// import { csrfProtection } from "./middleware/authMiddleware.js";

import connectDB from "./config/db.js";
import axios from "axios";
import bodyParser from "body-parser";
import asyncHandler from "express-async-handler";

// route connection

import patientRoutes from "./routes/userRoutes/patientRoutes.js";
import doctorRoutes from "./routes/userRoutes/doctorRoutes.js";
import adminRoutes from "./routes/userRoutes/adminRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paystackRoute from "./routes/paystackRoute.js";
import chatRoute from "./routes/chatRoute.js";
import smsRoute from "./routes/smsRoute.js";
import walletRoute from "./routes/walletRoute.js";

// socket connection
socketConfig(io);

const origin =
  process.NODE_ENV === "development"
    ? "http://localhost:3005"
    : "https://sitibox.9jaclinic.com";

const corsOptions = {
  origin: "*",
  credentials: true,
};

app.use(cors(corsOptions));

// parse cookies
// we need this because "cookie" is true in csrfProtection
app.use(cookieParser());
// express sanitizer

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(morgan("dev"));

app.use("/api/patients", patientRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/paystack", paystackRoute);
app.use("/api/sendsms", smsRoute);
app.use("/api/chatuploads", chatRoute);
app.use("/api/wallet", walletRoute);

// app.get("/getcsrf", csrfProtection, function (req, res) {
//   // pass the csrfToken to the view
//   // res.render('send', { csrfToken: req.csrfToken() })
//   res.json({ csrfToken: req.csrfToken() });
// });

const __dirname = path.resolve();
// build and use static for production
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "/frontend/build")));

//   app.get("*", (req, res) =>
//     res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
//   );
// } else {
//   app.get("/", (req, res) => {
//     res.send("api is running..");
//   });
// }

  app.get("/", (req, res) => {
    res.send("api is running..");
  });


app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3005;

const start = async () => {
  try {
    // database connection

    const conn = await connectDB();
    server.listen(
      PORT,
      console.log(
        `Server running on ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
          .underline
      )
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.log(`Error: ${error.message}`.red.underline.bold);
    process.exit(1);
  }
};

start();
