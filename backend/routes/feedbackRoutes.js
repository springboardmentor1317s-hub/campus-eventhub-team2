import express from "express";
import Feedback from "../models/Feedback.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Submit feedback
router.post("/submit", authenticateToken, async (req, res) => {
  try {
    const { message, rating } = req.body;
    
    const feedback = await Feedback.create({
      user: req.user._id,
      message,
      rating
    });
    
    res.json({ message: "Feedback submitted successfully", feedback });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all feedback
router.get("/all", async (req, res) => {
  try {
    const feedback = await Feedback.find({})
      .populate("user", "name college")
      .sort({ createdAt: -1 });
    
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;