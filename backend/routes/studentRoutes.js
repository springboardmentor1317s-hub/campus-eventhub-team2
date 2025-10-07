// routes/studentRoutes.js
import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
import Registration from "../models/Registration.js";
import Event from "../models/Event.js";

const router = express.Router();

// ✅ Get all available events (students can view before registering)
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

// ✅ Register for an event
router.post(
  "/register-event",
  authMiddleware,
  roleMiddleware(["student"]),
  async (req, res) => {
    try {
      const { eventId } = req.body;

      // Prevent duplicate registrations
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

// ✅ Cancel registration for an event
router.delete(
  "/cancel-registration",
  authMiddleware,
  roleMiddleware(["student"]),
  async (req, res) => {
    try {
      const { eventId } = req.body;

      const registration = await Registration.findOneAndDelete({ 
        student: req.user.id, 
        event: eventId 
      });

      if (!registration) {
        return res.status(404).json({ error: "Registration not found" });
      }

      res.json({ message: "Registration cancelled successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// ✅ Get all events a student registered for (with status + notification)
router.get(
  "/my-events",
  authMiddleware,
  roleMiddleware(["student", "college_admin"]),
  async (req, res) => {
    try {
      const registrations = await Registration.find({ student: req.user.id })
        .populate("event")
        .sort({ createdAt: -1 });

      res.json(registrations);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// ✅ Download ticket (only if approved)
router.get(
  "/download-ticket/:id",
  authMiddleware,
  roleMiddleware(["student"]),
  async (req, res) => {
    try {
      const registration = await Registration.findOne({
        _id: req.params.id,
        student: req.user.id,
      }).populate("event");

      if (!registration) {
        return res.status(404).json({ error: "Registration not found" });
      }

      if (registration.status !== "approved") {
        return res.status(403).json({ error: "Ticket not available. Registration not approved yet." });
      }

      // Example: send plain text ticket (replace with PDF generator later if needed)
      res.setHeader("Content-Disposition", `attachment; filename=ticket-${registration.event.title}.txt`);
      res.setHeader("Content-Type", "text/plain");

      res.send(
        `🎟 Event Ticket\n\nEvent: ${registration.event.title}\nDate: ${registration.event.startDate} - ${registration.event.endDate}\nStudent: ${req.user.name}\nStatus: APPROVED`
      );
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

export default router;
