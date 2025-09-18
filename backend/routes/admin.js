import express from "express";
import Event from "../models/Event.js";
import User from "../models/User.js";

const router = express.Router();

// ✅ Admin stats endpoint
router.get("/stats", async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const totalRegistrationsAgg = await Event.aggregate([
      { $project: { count: { $size: "$registrations" } } },
      { $group: { _id: null, total: { $sum: "$count" } } },
    ]);
    const totalRegistrations =
      totalRegistrationsAgg.length > 0 ? totalRegistrationsAgg[0].total : 0;

    const activeUsers = await User.countDocuments({
      lastLogin: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }, // last 7 days
    });

    // If you don't have reviews yet, set static for now
    const pendingReviews = 12;

    res.json({
      totalEvents,
      totalRegistrations,
      activeUsers,
      pendingReviews,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
