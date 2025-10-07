// backend/server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

// Import routes
import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import registrationRoutes from "./routes/registrationRoutes.js";
import adminRoutes from "./routes/admin.js";

dotenv.config();
const app = express();
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // frontend URL
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/admin", adminRoutes);

// Health check
app.get("/", (req, res) => res.send("✅ Campus Event Hub Backend running!"));

// Socket.IO connections
io.on("connection", (socket) => {
  console.log("⚡ Client connected:", socket.id);

  socket.on("joinStudent", (studentId) => {
    socket.join(studentId);
    console.log(`📢 Student ${studentId} joined notifications`);
  });

  socket.on("disconnect", () => console.log("❌ Client disconnected:", socket.id));
});

// Example: Admin approves registration
app.post("/api/registration/:id/approve", async (req, res) => {
  const registrationId = req.params.id;
  const { studentId, eventTitle } = req.body;

  // TODO: Update registration status in DB
  // e.g., Registration.findByIdAndUpdate(registrationId, { status: "approved" });

  const message = `✅ Your registration for "${eventTitle}" has been approved.`;

  // Emit to specific student room
  if (studentId) {
    io.to(studentId).emit("registrationStatusChanged", { message });
    console.log(`📢 Notification sent to student ${studentId}`);
  }

  res.json({ success: true, message });
});

// MongoDB connection + server start
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error("❌ MongoDB connection error:", err));

export { io };
