import express from "express";
import mongoose from "mongoose";
import Registration from "../models/Registration.js";
import Event from "../models/Event.js";
import Comment from "../models/Comment.js";
import Rating from "../models/Rating.js";
import Notification from "../models/Notification.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
import User from "../models/User.js";
import { emitNotification } from "../utils/socketManager.js";

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
    // Check if admin is approved
    const admin = await User.findById(req.user.id);
    if (!admin.isApproved) {
      return res.status(403).json({ error: "Admin account not approved by superadmin" });
    }
    
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
// 📌 Update Event (Admin Only)
// =============================
router.put("/:eventId", authMiddleware, roleMiddleware(["college_admin"]), async (req, res) => {
  try {
    const { title, description, category, location, startDate, endDate, college, onlineLink } = req.body;
    
    const event = await Event.findOne({ _id: req.params.eventId, collegeId: req.user.id });
    if (!event) {
      return res.status(404).json({ error: "Event not found or unauthorized" });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.eventId,
      {
        title,
        description,
        category,
        location,
        startDate,
        endDate,
        college,
        onlineLink,
      },
      { new: true }
    );

    res.json({ message: "✅ Event updated successfully!", event: updatedEvent });
  } catch (err) {
    console.error("❌ Event update error:", err);
    res.status(500).json({ error: err.message });
  }
});

// =============================
// 📌 Get Events Created by Admin
// =============================
router.get("/my-events", authMiddleware, roleMiddleware(["college_admin"]), async (req, res) => {
  try {
    // Check if admin is approved
    const admin = await User.findById(req.user.id);
    if (!admin.isApproved) {
      return res.status(403).json({ error: "Admin account not approved by superadmin" });
    }
    
    const events = await Event.find({ collegeId: req.user.id }).sort({ startDate: 1 });
    console.log("📅 Admin fetching their events, found:", events.length, "events");
    res.json(events);
  } catch (err) {
    console.error("❌ Error fetching admin events:", err);
    res.status(500).json({ error: "Failed to fetch your events" });
  }
});

// =============================
// 📌 Get Comments for Event
// =============================
router.get("/:eventId/comments", async (req, res) => {
  try {
    const comments = await Comment.find({ event: req.params.eventId })
      .populate("user", "name role")
      .populate("pinnedBy", "name")
      .sort({ isPinned: -1, createdAt: -1 });
    
    // Group comments with their replies
    const parentComments = comments.filter(c => !c.parentComment);
    const replies = comments.filter(c => c.parentComment);
    
    const commentsWithReplies = parentComments.map(comment => {
      const commentObj = comment.toObject();
      return {
        ...commentObj,
        replies: replies.filter(r => r.parentComment && r.parentComment.toString() === comment._id.toString())
      };
    });
    
    console.log(`Found ${commentsWithReplies.length} comments for event ${req.params.eventId}`);
    res.json(commentsWithReplies);
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).json({ error: err.message });
  }
});

// =============================
// 📌 Add Comment to Event
// =============================
router.post("/:eventId/comments", authMiddleware, async (req, res) => {
  try {
    const { text, parentComment } = req.body;
    
    const comment = await Comment.create({
      user: req.user.id,
      event: req.params.eventId,
      text,
      parentComment: parentComment || null
    });
    
    await comment.populate("user", "name role");
    
    // Create notification for event admin when someone comments
    if (!parentComment) {
      const event = await Event.findById(req.params.eventId);
      if (event && event.collegeId.toString() !== req.user.id) {
        const user = await User.findById(req.user.id);
        const notification = await Notification.create({
          recipient: event.collegeId,
          type: "event_comment",
          message: `New comment on your event "${event.title}" by ${user.name}`,
          eventId: req.params.eventId,
          commentId: comment._id
        });
        
        // Emit real-time notification
        emitNotification(event.collegeId.toString(), notification);
      }
    }
    
    res.json(comment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// =============================
// 📌 Pin/Unpin Comment (Admin Only)
// =============================
router.put("/:eventId/comments/:commentId/pin", authMiddleware, roleMiddleware(["college_admin"]), async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event || event.collegeId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    
    comment.isPinned = !comment.isPinned;
    comment.pinnedBy = comment.isPinned ? req.user.id : null;
    await comment.save();
    
    res.json({ message: comment.isPinned ? "Comment pinned" : "Comment unpinned", comment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =============================
// 📌 Rate Event
// =============================
router.post("/:eventId/rate", authMiddleware, async (req, res) => {
  try {
    const { rating } = req.body;
    
    const existingRating = await Rating.findOneAndUpdate(
      { user: req.user.id, event: req.params.eventId },
      { rating },
      { upsert: true, new: true }
    );
    
    res.json({ message: "Rating submitted successfully", rating: existingRating });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// =============================
// 📌 Get Event Ratings
// =============================
router.get("/:eventId/ratings", async (req, res) => {
  try {
    const { eventId } = req.params;
    console.log(`Fetching ratings for event: ${eventId}`);
    
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ error: "Invalid event ID" });
    }
    
    const ratings = await Rating.find({ event: eventId });
    const avgRating = ratings.length > 0 ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length : 0;
    
    console.log(`Found ${ratings.length} ratings, avg: ${avgRating}`);
    res.json({
      averageRating: Math.round(avgRating * 10) / 10,
      totalRatings: ratings.length,
      ratings
    });
  } catch (err) {
    console.error("❌ Error fetching ratings:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// =============================
// 📌 Get Single Event by ID
// =============================
router.get("/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;
    console.log(`Fetching event with ID: ${eventId}`);
    
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ error: "Invalid event ID" });
    }
    
    const event = await Event.findById(eventId);
    if (!event) {
      console.log(`Event not found: ${eventId}`);
      return res.status(404).json({ error: "Event not found" });
    }
    console.log(`Event found: ${event.title}`);
    res.json(event);
  } catch (err) {
    console.error("❌ Error fetching event:", err.message);
    res.status(500).json({ error: err.message });
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

// =============================
// 📌 Reply to Comment
// =============================
router.post("/:eventId/comments/:commentId/reply", authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    
    const reply = await Comment.create({
      user: req.user.id,
      event: req.params.eventId,
      text,
      parentComment: req.params.commentId
    });
    
    await reply.populate("user", "name role");
    
    // Create notification for original commenter
    const originalComment = await Comment.findById(req.params.commentId).populate("user");
    if (originalComment && originalComment.user._id.toString() !== req.user.id) {
      const user = await User.findById(req.user.id);
      const notification = await Notification.create({
        recipient: originalComment.user._id,
        type: "comment_reply",
        message: `${user.name} replied to your comment`,
        eventId: req.params.eventId,
        commentId: reply._id
      });
      
      // Emit real-time notification
      emitNotification(originalComment.user._id.toString(), notification);
    }
    
    res.json(reply);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;