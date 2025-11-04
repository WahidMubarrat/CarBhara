import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Customer from "../models/Customer.js";
import Businessman from "../models/Businessman.js";
import { uploadImage } from "../config/cloudinary.js";

// @desc Register a new user (Customer or Businessman)
export const signup = async (req, res) => {
  try {
    console.log('📝 Signup request received');
    console.log('Body:', req.body);
    console.log('File:', req.file);
    
    const {
      role,
      fullname,
      email,
      password,
      age,
      address,
      phone,
      companyName,
    } = req.body;

    // Validate required fields
    if (!fullname || !email || !password || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate profile picture is required
    if (!req.file) {
      return res.status(400).json({ message: "Profile picture is required" });
    }

    // Check if user already exists in their respective collection
    const existingCustomer = await Customer.findOne({ email });
    const existingBusinessman = await Businessman.findOne({ email });

    if (existingCustomer || existingBusinessman) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Handle profile picture upload
    let profilePictureUrl = '';
    try {
      const base64Image = req.file.buffer.toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${base64Image}`;
      profilePictureUrl = await uploadImage(dataURI);
    } catch (uploadError) {
      console.error("Error uploading profile picture:", uploadError);
      return res.status(400).json({ message: "Failed to upload profile picture" });
    }

    let user;

    if (role === "customer") {
      user = await Customer.create({
        fullname,
        email,
        password: hashedPassword,
        age,
        address,
        phone,
        profilePicture: profilePictureUrl,
      });
    } else if (role === "businessman") {
      user = await Businessman.create({
        fullname,
        email,
        password: hashedPassword,
        companyName,
        address,
        phone,
        profilePicture: profilePictureUrl,
      });
    } else {
      return res.status(400).json({ message: "Invalid role type" });
    }

    return res.status(201).json({
      message: "Signup successful",
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        role,
      },
    });
  } catch (error) {
    console.error("Error during signup:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

// @desc Login user (Customer or Businessman)
export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    // Check in both collections
    const customer = await Customer.findOne({ email });
    const businessman = await Businessman.findOne({ email });

    // If user doesn't exist in either collection
    if (!customer && !businessman) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    let user = customer || businessman;
    const role = customer ? "customer" : "businessman";

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        id: user._id, 
        role,
        email: user.email 
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "1d" }
    );

    // Send success response
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        role,
      },
      token,
    });

  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};