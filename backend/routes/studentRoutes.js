// routes/studentRoutes.js
import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
import Registration from "../models/Registration.js";
import Event from "../models/Event.js";

const router = express.Router();

// Get all available events (students can view before registering)
router.get(
  "/events",
  authMiddleware,
  roleMiddleware(["student"]),
  async (req, res) => {
    try {
      const events = await Event.find().sort({ startDate: 1 });
      res.json(events);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Register for an event
router.post(
  "/register-event",
  authMiddleware,
  roleMiddleware(["student"]),
  async (req, res) => {
    try {
      const { eventId } = req.body;

      // Check if already registered
      const existing = await Registration.findOne({ student: req.user.id, event: eventId });
      if (existing) {
        return res.status(400).json({ error: "Already registered for this event" });
      }

      const registration = await Registration.create({
        student: req.user.id,
        event: eventId,
      });

      res.json({ message: "Event registered successfully", registration });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Get all events a student registered for
router.get(
  "/my-events",
  authMiddleware,
  roleMiddleware(["student","college_admin"]),
  async (req, res) => {
    try {
      const registrations = await Registration.find({ student: req.user.id }).populate("event");
      res.json(registrations);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

export default router;