import express from "express";
import Registration from "../models/Registration.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET all registrations for admin
router.get("/registrations", authMiddleware, async (req, res) => {
  if (req.user.role !== "college_admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  try {
    const registrations = await Registration.find()
      .populate("student", "name email")
      .populate("event", "title category startDate endDate");

    res.json(registrations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT update registration status (approve/reject)
router.put("/registrations/:id", authMiddleware, async (req, res) => {
  if (req.user.role !== "college_admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const { status } = req.body; // "approved" or "rejected"
  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) return res.status(404).json({ message: "Registration not found" });

    registration.status = status;
    await registration.save();

    res.json({ message: `Registration ${status}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
