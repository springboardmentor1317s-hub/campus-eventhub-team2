// routes/admin.js
import express from "express";
import Registration from "../models/Registration.js";
import Event from "../models/Event.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { io } from "../server.js";

const router = express.Router();

// GET admin statistics
router.get("/stats", authMiddleware, async (req, res) => {
  if (req.user.role !== "college_admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  try {
    const adminEvents = await Event.find({ collegeId: req.user.id });
    const eventIds = adminEvents.map(event => event._id);

    const registrations = await Registration.find({ 
      event: { $in: eventIds } 
    });

    const pendingRegistrations = registrations.filter(
      reg => reg.status === "pending"
    ).length;

    const uniqueStudents = [...new Set(registrations.map(reg => reg.student.toString()))];

    const stats = {
      totalEvents: adminEvents.length,
      totalRegistrations: registrations.length,
      activeUsers: uniqueStudents.length,
      pendingReviews: pendingRegistrations,
    };

    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET registrations for admin's events only
router.get("/registrations", authMiddleware, async (req, res) => {
  if (req.user.role !== "college_admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  try {
    const adminEvents = await Event.find({ collegeId: req.user.id });
    const eventIds = adminEvents.map(event => event._id);

    const registrations = await Registration.find({ event: { $in: eventIds } })
      .populate("student", "name email")
      .populate("event", "title category startDate endDate college")
      .sort({ registeredAt: -1 });

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
    const adminEvents = await Event.find({ collegeId: req.user.id });
    const eventIds = adminEvents.map(event => event._id);

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

// PUT approve registration + notify student
router.put("/registrations/:id/approve", authMiddleware, async (req, res) => {
  if (req.user.role !== "college_admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  try {
    const registration = await Registration.findById(req.params.id)
      .populate("event")
      .populate("student");

    if (!registration) return res.status(404).json({ message: "Registration not found" });

    if (registration.event.collegeId.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only approve registrations for your events" });
    }

    registration.status = "approved";
    registration.approvedAt = new Date();
    registration.notification = `✅ Your registration for "${registration.event.title}" has been approved. You can now download your ticket.`;

    await registration.save();

    // 🔔 Notify student live via Socket.IO
    io.to(registration.student._id.toString()).emit("registrationStatusChanged", {
      event: registration.event.title,
      status: registration.status,
      message: registration.notification,
    });

    res.json({ message: "Registration approved successfully", registration });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT reject registration + notify student
router.put("/registrations/:id/reject", authMiddleware, async (req, res) => {
  if (req.user.role !== "college_admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  try {
    const registration = await Registration.findById(req.params.id)
      .populate("event")
      .populate("student");

    if (!registration) return res.status(404).json({ message: "Registration not found" });

    if (registration.event.collegeId.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only reject registrations for your events" });
    }

    registration.status = "rejected";
    registration.rejectedAt = new Date();
    registration.notification = `❌ Your registration for "${registration.event.title}" has been rejected.`;

    await registration.save();

    // 🔔 Notify student live via Socket.IO
    io.to(registration.student._id.toString()).emit("registrationStatusChanged", {
      event: registration.event.title,
      status: registration.status,
      message: registration.notification,
    });

    res.json({ message: "Registration rejected successfully", registration });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE event
router.delete("/delete-event/:id", authMiddleware, async (req, res) => {
  if (req.user.role !== "college_admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  try {
    const { id } = req.params;
    
    // Find the event first to check ownership
    const event = await Event.findById(id);
    
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    
    // Check if the admin owns this event
    if (event.collegeId.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only delete your own events" });
    }
    
    // Delete the event
    await Event.findByIdAndDelete(id);
    
    // Delete all registrations for this event
    await Registration.deleteMany({ event: id });
    
    res.status(200).json({ 
      message: "Event deleted successfully", 
      eventId: id 
    });
  } catch (err) {
    console.error("Error deleting event:", err);
    res.status(500).json({ message: "Server error while deleting event" });
  }
});

export default router;