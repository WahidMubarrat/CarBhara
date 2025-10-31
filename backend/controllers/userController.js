import Customer from "../models/Customer.js";
import Businessman from "../models/Businessman.js";

// @desc Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const { id: userId, role } = req.user;

    const Model = role === 'customer' ? Customer : Businessman;
    const user = await Model.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      user: {
        fullname: user.fullname,
        email: user.email,
        age: user.age,
        address: user.address,
        phone: user.phone,
        role,
        ...(role === 'businessman' && { companyName: user.companyName })
      }
    });
  } catch (error) {
    console.error("Error fetching profile:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch profile" });
  }
};

// @desc Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const { id: userId, role } = req.user;
    const { fullname, age, address, phone, companyName } = req.body;

    // Validate input
    if (!fullname || !phone || !address) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields"
      });
    }

    const Model = role === 'customer' ? Customer : Businessman;
    
    // Build update object
    const updateData = {
      fullname,
      phone,
      address,
      ...(role === 'customer' && age && { age: Number(age) }),
      ...(role === 'businessman' && companyName && { companyName })
    };

    const user = await Model.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        fullname: user.fullname,
        email: user.email,
        age: user.age,
        address: user.address,
        phone: user.phone,
        role,
        ...(role === 'businessman' && { companyName: user.companyName })
      }
    });
  } catch (error) {
    console.error("Error updating profile:", error.message);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: "Invalid input data",
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to update profile"
    });
  }
};