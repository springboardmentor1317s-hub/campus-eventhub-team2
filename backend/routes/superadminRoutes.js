import express from "express";
import User from "../models/User.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Middleware to check if user is superadmin
const requireSuperadmin = (req, res, next) => {
  if (req.user.role !== "superadmin") {
    return res.status(403).json({ error: "Access denied. Access for Superadmin only." });
  }
  next();
};

// Get all pending admin approvals
router.get("/pending-users", authenticateToken, requireSuperadmin, async (req, res) => {
  try {
    const pendingUsers = await User.find({
      role: "college_admin",
      isApproved: false
    }).select("-password");
    
    res.json(pendingUsers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Approve user
router.put("/approve-user/:userId", authenticateToken, requireSuperadmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      {
        isApproved: true,
        approvedBy: req.user.id,
        approvedAt: new Date()
      },
      { new: true }
    ).select("-password");
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json({ message: "User approved successfully", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reject user
router.delete("/reject-user/:userId", authenticateToken, requireSuperadmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json({ message: "User rejected and removed!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete user
router.delete("/delete-user/:userId", authenticateToken, requireSuperadmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json({ message: "User deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all users (admins and students)
router.get("/all-users", authenticateToken, requireSuperadmin, async (req, res) => {
  try {
    const users = await User.find({}).select("-password").populate("approvedBy", "name");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all events from all colleges
router.get("/all-events", authenticateToken, requireSuperadmin, async (req, res) => {
  try {
    const Event = (await import("../models/Event.js")).default;
    const events = await Event.find({}).populate("collegeId", "name college");
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete event
router.delete("/delete-event/:eventId", authenticateToken, requireSuperadmin, async (req, res) => {
  try {
    const Event = (await import("../models/Event.js")).default;
    const event = await Event.findByIdAndDelete(req.params.eventId);
    
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    
    res.json({ message: "Event deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get event statistics by college admin
router.get("/event-stats", authenticateToken, requireSuperadmin, async (req, res) => {
  try {
    const Event = (await import("../models/Event.js")).default;
    const stats = await Event.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "collegeId",
          foreignField: "_id",
          as: "admin"
        }
      },
      {
        $unwind: "$admin"
      },
      {
        $group: {
          _id: "$admin.college",
          adminName: { $first: "$admin.name" },
          eventCount: { $sum: 1 }
        }
      },
      {
        $sort: { eventCount: -1 }
      }
    ]);
    
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;