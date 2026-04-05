import express from "express";
import mongoose from "mongoose";
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import packageRoute from "./routes/package.route.js";
import ratingRoute from "./routes/rating.route.js";
import bookingRoute from "./routes/booking.route.js";
import uploadRoute from "./routes/upload.route.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
const app = express();
dotenv.config();

const __dirname = path.resolve();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => console.log(err));

// CORS: browser "Origin" is your *frontend* URL (Netlify/Vercel/custom domain), not the Render API URL.
// Upload & booking use credentials (cookies) → need credentials: true + an explicit allowed origin list.
const corsOrigins = [
  ...String(process.env.CLIENT_ORIGIN || "").split(","),
  ...String(process.env.SERVER_URL || "").split(","),
]
  .map((o) => o.trim())
  .filter(Boolean);
const corsOriginSet = [...new Set(corsOrigins)];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }
      if (corsOriginSet.length === 0) {
        console.warn(
          "CORS: CLIENT_ORIGIN / SERVER_URL empty — allowing requesting origin (set origins in production)."
        );
        return callback(null, origin);
      }
      if (corsOriginSet.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    optionsSuccessStatus: 204,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/package", packageRoute);
app.use("/api/rating", ratingRoute);
app.use("/api/booking", bookingRoute);
app.use("/api/upload", uploadRoute);

if (process.env.NODE_ENV_CUSTOM === "production") {
  //static files
  app.use(express.static(path.join(__dirname, "/client/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
  });
} else {
  // //rest api
  app.use("/", (req, res) => {
    res.send("Welcome to travel and tourism app");
  });
}

//port
app.listen(8000, () => {
  console.log("listening on 8000");
});
