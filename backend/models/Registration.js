import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema(
  {
    student: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    event: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Event", 
      required: true 
    },
    status: { 
      type: String, 
      enum: ["pending", "approved", "rejected"], 
      default: "pending" 
    },
    notification: { 
      type: String, 
      default: "" 
    },
    registeredAt: { 
      type: Date, 
      default: Date.now 
    },
    approvedAt: { 
      type: Date 
    },
    rejectedAt: { 
      type: Date 
    }
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Middleware to keep approvedAt/rejectedAt consistent
registrationSchema.pre("save", function(next) {
  if (this.status === "approved" && !this.approvedAt) {
    this.approvedAt = new Date();
    this.notification = "Your registration has been approved. You can now download your ticket.";
  } else if (this.status === "rejected" && !this.rejectedAt) {
    this.rejectedAt = new Date();
    this.notification = "Sorry, your registration was rejected by admin.";
  }
  next();
});

export default mongoose.model("Registration", registrationSchema);
