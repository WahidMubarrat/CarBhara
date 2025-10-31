import mongoose from "mongoose";

const businessmanSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    companyName: { type: String },
    address: { type: String },
    phone: { type: String },
  },
  { timestamps: true }
);

const Businessman = mongoose.model("Businessman", businessmanSchema);
export default Businessman;
