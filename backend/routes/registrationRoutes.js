import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import Registration from "../models/Registration.js";

const router = express.Router();

// Register for an event
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { eventId } = req.body;

    // Validate input
    if (!eventId) {
      return res.status(400).json({ message: "Event ID is required" });
    }

    // Check if the user already registered for this event
    const existingRegistration = await Registration.findOne({
      student: req.user.id,
      event: eventId,
    });

    if (existingRegistration) {
      return res.status(400).json({ message: "Already registered for this event" });
    }

    // Create new registration
    const registration = new Registration({
      student: req.user.id, // comes from authMiddleware
      event: eventId,
    });

    await registration.save();

    res.status(201).json({ message: "Registered successfully", registration });
  } catch (err) {
    console.error("Error registering:", err);

    // Send validation errors if any
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(", ") });
    }

    res.status(500).json({ message: "Server error" });
  }
});

export default router;
