import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
  {
    businessmanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Businessman",
      required: true,
    },
    carName: { type: String, required: true },
    model: { type: String, required: true },
    carPicture: { type: String, required: true }, // Cloudinary URL
    registrationPaper: { type: String, required: true }, // Cloudinary URL
    driverName: { type: String, required: true },
    driverPhone: { type: String, required: true },
    drivingLicense: { type: String, required: true }, // Cloudinary URL
    otherDocuments: [{ type: String }], // Array of Cloudinary URLs
    hourlyFare: { type: Number, required: true },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Car = mongoose.model("Car", carSchema);
export default Car;
