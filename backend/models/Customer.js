import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number },
    address: { type: String },
    phone: { type: String },
    profilePicture: { type: String, default: '' }, // URL to Cloudinary image
  },
  { timestamps: true }
);

const Customer = mongoose.model("Customer", customerSchema);
export default Customer;
