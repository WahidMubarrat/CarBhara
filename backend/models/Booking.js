import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    businessmanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Businessman",
      required: true,
    },
    carId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: true,
    },
    startLocation: {
      type: String,
      required: [true, "Start location is required"],
      trim: true,
    },
    endLocation: {
      type: String,
      required: [true, "End location is required"],
      trim: true,
    },
    startDateTime: {
      type: Date,
      required: [true, "Start date and time is required"],
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed"],
      default: "pending",
    },
    rejectionReason: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
bookingSchema.index({ customerId: 1, createdAt: -1 });
bookingSchema.index({ businessmanId: 1, status: 1 });
bookingSchema.index({ carId: 1 });

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
