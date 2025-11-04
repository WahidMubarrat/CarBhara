import express from "express";
import {
  createBooking,
  getCustomerBookings,
  getBusinessmanBookings,
  updateBookingStatus,
  getCustomerBookingHistory,
  getBusinessmanBookingHistory
} from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Customer routes
router.post("/", protect, createBooking);
router.get("/customer", protect, getCustomerBookings);
router.get("/customer/history", protect, getCustomerBookingHistory);

// Businessman routes
router.get("/businessman", protect, getBusinessmanBookings);
router.get("/businessman/history", protect, getBusinessmanBookingHistory);
router.put("/:bookingId/status", protect, updateBookingStatus);

export default router;
