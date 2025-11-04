import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import { configureCloudinary } from "./config/cloudinary.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import carRoutes from "./routes/carRoutes.js";

dotenv.config();
connectDB();
configureCloudinary(); // Configure Cloudinary after env is loaded

const app = express();
app.use(cors());
app.use(express.json());

// Mount routes
app.use("/api/auth", authRoutes);  // Auth routes (/api/auth/signin, /api/auth/signup)
app.use("/api/users", userRoutes); // User routes (/api/users/profile)
app.use("/api/cars", carRoutes);   // Car routes (/api/cars)

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
