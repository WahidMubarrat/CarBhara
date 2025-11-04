import Customer from "../models/Customer.js";
import Businessman from "../models/Businessman.js";
import { uploadImage } from "../config/cloudinary.js";
import bcrypt from "bcryptjs";

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
        profilePicture: user.profilePicture,
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

    // Handle profile picture upload if provided
    if (req.file) {
      try {
        const base64Image = req.file.buffer.toString('base64');
        const dataURI = `data:${req.file.mimetype};base64,${base64Image}`;
        const imageUrl = await uploadImage(dataURI);
        updateData.profilePicture = imageUrl;
      } catch (error) {
        console.error('Error uploading image:', error);
        return res.status(400).json({
          success: false,
          message: "Failed to upload profile picture"
        });
      }
    }

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
        profilePicture: user.profilePicture,
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

// @desc Change user password
export const changePassword = async (req, res) => {
  try {
    const { id: userId, role } = req.user;
    const { oldPassword, newPassword, confirmPassword } = req.body;

    // Validate input
    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields"
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match"
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long"
      });
    }

    const Model = role === 'customer' ? Customer : Businessman;
    const user = await Model.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Check if old password is correct
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect"
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    user.password = hashedPassword;
    await user.save();

    res.json({
      success: true,
      message: "Password changed successfully"
    });

  } catch (error) {
    console.error("Error changing password:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to change password"
    });
  }
};