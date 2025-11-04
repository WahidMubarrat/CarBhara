import express from "express";
import { signup, signin } from "../controllers/authController.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Authentication routes
router.post("/signup", upload.single('profilePicture'), signup);
router.post("/signin", signin);

export default router;