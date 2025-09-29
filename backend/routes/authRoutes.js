import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// ==========================
// REGISTER
// ==========================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, college, role } = req.body;

    // Check if email already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      college,
      role,
    });

    res.json({
      message: "User registered successfully",
      user: {
        id: user._id,        // ✅ include userId
        name: user.name,
        email: user.email,
        role: user.role,
        college: user.college,
      },
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ==========================
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

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // ✅ Send back userId along with other info
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
