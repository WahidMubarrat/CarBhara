import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import { configureCloudinary } from "./config/cloudinary.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import carRoutes from "./routes/carRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

dotenv.config();
connectDB();
configureCloudinary(); // Configure Cloudinary after env is loaded

const app = express();

// CORS configuration - allows both local dev and production
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL // Add your deployed frontend URL as env variable
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// Mount routes
app.use("/api/auth", authRoutes);     // Auth routes (/api/auth/signin, /api/auth/signup)
app.use("/api/users", userRoutes);    // User routes (/api/users/profile)
app.use("/api/cars", carRoutes);      // Car routes (/api/cars)
app.use("/api/bookings", bookingRoutes); // Booking routes (/api/bookings)

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Test endpoint to verify Cloudinary config
app.get("/api/test-cloudinary", (req, res) => {
  res.json({
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || 'NOT SET',
    apiKey: process.env.CLOUDINARY_API_KEY || 'NOT SET',
    apiSecretPresent: !!process.env.CLOUDINARY_API_SECRET
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
