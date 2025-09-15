import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Student Dashboard (only students can access)
router.get("/student", authMiddleware, roleMiddleware(["student"]), (req, res) => {
  res.json({ message: "Welcome to the Student Dashboard 🎓", user: req.user });
});

// Admin Dashboard (only admins can access)
router.get("/admin", authMiddleware, roleMiddleware(["admin"]), (req, res) => {
  res.json({ message: "Welcome to the Admin Dashboard 🛠️", user: req.user });
});

export default router;
