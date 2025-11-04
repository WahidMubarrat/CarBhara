import express from "express";
import { getUserProfile, updateUserProfile, changePassword } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Protected User routes
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, upload.single('profilePicture'), updateUserProfile);
router.put("/change-password", protect, changePassword);

export default router;
