import express from "express";
import { getUserProfile, updateUserProfile } from "../controllers/userController.js";

const router = express.Router();

// User routes
router.get("/profile", getUserProfile);
router.put("/profile", updateUserProfile);

export default router;
