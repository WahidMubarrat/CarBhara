import Customer from "../models/Customer.js";
import Businessman from "../models/Businessman.js";

// @desc Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const { userId, role } = req.user; // Will come from auth middleware

    const Model = role === 'customer' ? Customer : Businessman;
    const user = await Model.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching profile:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const { userId, role } = req.user; // Will come from auth middleware
    const { fullname, age, address, phone, companyName } = req.body;

    const Model = role === 'customer' ? Customer : Businessman;
    const updateData = role === 'customer' 
      ? { fullname, age, address, phone }
      : { fullname, companyName, address, phone };

    const user = await Model.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Profile updated successfully",
      user
    });
  } catch (error) {
    console.error("Error updating profile:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};