import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();


// REGISTER
// ==========================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, college, role } = req.body;
    console.log("Registration attempt:", { name, email, college, role });

    // Validate required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "All Fields are required!" });
    }

    // Check if email already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "Email already registered!" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with approval logic - students and superadmin are auto-approved
    const isApproved = role === "student" || role === "superadmin" ? true : false; // only college_admin needs approval
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      college,
      role,
      isApproved,
    });

    const message = role === "college_admin" 
      ? "Admin registration submitted. Awaiting superadmin approval."
      : "User registered successfully";
      
    console.log("Registration successful:", user._id);
    res.json({
      message,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        college: user.college,
        isApproved: user.isApproved,
      },
    });
  } catch (err) {
    console.error("Registration error:", err.message);
    res.status(400).json({ error: err.message });
  }
});


// UPDATE PROFILE
// ==========================
router.put("/update-profile", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ error: "Access token required" });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { name, email, college } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      decoded.id,
      { name, email, college },
      { new: true }
    ).select("-password");
    
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// LOGIN
// ==========================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });
    
    // Check if admin is approved
    if (user.role === "college_admin" && !user.isApproved) {
      return res.status(403).json({ error: "Admin account pending,need superadmin approval" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    //  Send back userId along with other info
    res.json({
      token,
      userId: user._id,    // ✅ critical for socket.io
      role: user.role,
      name: user.name,
      college: user.college,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
