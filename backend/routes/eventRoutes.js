import express from "express";
import jwt from "jsonwebtoken";
import Event from "../models/Event.js";

const router = express.Router();

// =============================
// 🔑 Middleware: Verify token
// =============================
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
}

// =============================
// 🔑 Middleware: Only Admins
// =============================
function adminMiddleware(req, res, next) {
  if (req.user.role !== "college_admin") {
    return res.status(403).json({ error: "Only college admins can create events" });
  }
  next();
}

// =============================
// 📌 Create Event (Admin Only)
// =============================
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { title, description, category, location, startDate, endDate, onlineLink } = req.body;

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
      startDate: { $gte: new Date() }, // ✅ only future events
    }).sort({ startDate: 1 }); // earliest first

    res.json(events);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

export default router;
