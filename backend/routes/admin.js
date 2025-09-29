import express from "express";
import Registration from "../models/Registration.js";
import Event from "../models/Event.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET registrations for admin's events only
router.get("/registrations", authMiddleware, async (req, res) => {
  if (req.user.role !== "college_admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  try {
    // First, get all events created by this admin
    const adminEvents = await Event.find({ collegeId: req.user.id });
    const eventIds = adminEvents.map(event => event._id);

    // Then get registrations for those events only
    const registrations = await Registration.find({ 
      event: { $in: eventIds } 
    })
      .populate("student", "name email")
      .populate("event", "title category startDate endDate college")
      .sort({ registeredAt: -1 }); // Most recent first

    res.json(registrations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET pending registrations only
router.get("/registrations/pending", authMiddleware, async (req, res) => {
  if (req.user.role !== "college_admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  try {
    // Get all events created by this admin
    const adminEvents = await Event.find({ collegeId: req.user.id });
    const eventIds = adminEvents.map(event => event._id);

    // Get only pending registrations for admin's events
    const registrations = await Registration.find({ 
      event: { $in: eventIds },
      status: "pending"
    })
      .populate("student", "name email")
      .populate("event", "title category startDate endDate college")
      .sort({ registeredAt: -1 });

    res.json(registrations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT approve registration
router.put("/registrations/:id/approve", authMiddleware, async (req, res) => {
  if (req.user.role !== "college_admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  try {
    const registration = await Registration.findById(req.params.id)
      .populate("event");

    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    // Check if this registration belongs to admin's event
    if (registration.event.collegeId.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only approve registrations for your events" });
    }

    registration.status = "approved";
    registration.approvedAt = new Date();
    await registration.save();

    res.json({ message: "Registration approved successfully", registration });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT reject registration
router.put("/registrations/:id/reject", authMiddleware, async (req, res) => {
  if (req.user.role !== "college_admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  try {
    const registration = await Registration.findById(req.params.id)
      .populate("event");

    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    // Check if this registration belongs to admin's event
    if (registration.event.collegeId.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only reject registrations for your events" });
    }

    registration.status = "rejected";
    registration.rejectedAt = new Date();
    await registration.save();

    res.json({ message: "Registration rejected successfully", registration });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;