import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  status: { 
    type: String, 
    enum: ["pending", "approved", "rejected"], 
    default: "pending" 
  },
  registeredAt: { type: Date, default: Date.now },
  approvedAt: { type: Date },
  rejectedAt: { type: Date }
});

export default mongoose.model("Registration", registrationSchema);