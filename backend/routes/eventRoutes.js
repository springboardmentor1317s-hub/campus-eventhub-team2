import express from "express";
import Registration from "../models/Registration.js";
import Event from "../models/Event.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

// =========================================================
// 📌 Get events registered by the current user
// =========================================================
router.get("/my-registered", authMiddleware, async (req, res) => {
  try {
    const registrations = await Registration.find({ student: req.user.id });
    const eventIds = registrations.map(reg => reg.event);
    const registeredEvents = await Event.find({ _id: { $in: eventIds } });

    res.status(200).json(registeredEvents);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch your registered events" });
  }
});

// =============================
// 📌 Create Event (Admin Only)
// =============================
router.post("/", authMiddleware, roleMiddleware(["college_admin"]), async (req, res) => {
  try {
    console.log("📅 Creating event with data:", req.body);
    console.log("👤 Admin user:", req.user);
    
    const { title, description, category, location, startDate, endDate, college, onlineLink } = req.body;

    if (!title || !startDate || !endDate) {
      return res.status(400).json({ error: "Title, startDate, and endDate are required" });
    }

    const newEvent = new Event({
      collegeId: req.user.id, // ✅ auto attach admin who created it
      title,
      description,
      category,
      location,
      startDate,
      endDate,
      college,
      onlineLink,
    });

    await newEvent.save();
    console.log("✅ Event created successfully:", newEvent);
    res.status(201).json({ message: "✅ Event created successfully!", event: newEvent });
  } catch (err) {
    console.error("❌ Event creation error:", err);
    res.status(500).json({ error: err.message });
  }
});

// =============================
// 📌 Get Events Created by Admin
// =============================
router.get("/my-events", authMiddleware, roleMiddleware(["college_admin"]), async (req, res) => {
  try {
    const events = await Event.find({ collegeId: req.user.id }).sort({ startDate: 1 });
    console.log("📅 Admin fetching their events, found:", events.length, "events");
    res.json(events);
  } catch (err) {
    console.error("❌ Error fetching admin events:", err);
    res.status(500).json({ error: "Failed to fetch your events" });
  }
});

// =============================
// 📌 Get Single Event by ID
// =============================
router.get("/:eventId", async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.json(event);
  } catch (err) {
    console.error("❌ Error fetching event:", err);
    res.status(500).json({ error: "Failed to fetch event" });
  }
});

// =============================
// 📌 Get All Upcoming Events (For Students)
// =============================
router.get("/", async (req, res) => {
  try {
    const events = await Event.find({}).sort({ startDate: 1 });
    console.log("📅 Fetching all events, found:", events.length, "events");
    res.json(events);
  } catch (err) {
    console.error("❌ Error fetching events:", err);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

export default router;
