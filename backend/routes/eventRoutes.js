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
    res.status(201).json({ message: "✅ Event created successfully!", event: newEvent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =============================
// 📌 Get All Upcoming Events
// =============================
router.get("/", async (req, res) => {
  try {
    const events = await Event.find({
      startDate: { $gte: new Date() },
    }).sort({ startDate: 1 });

    res.json(events);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

export default router;
