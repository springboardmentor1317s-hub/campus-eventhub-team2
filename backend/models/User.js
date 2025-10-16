import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  college: { type: String },
  role: { type: String, enum: ["student", "college_admin", "superadmin"] },
  isApproved: { type: Boolean, default: true }, // Auto-approve students and superadmin, require approval for college_admin
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  approvedAt: { type: Date }
}, { timestamps: true });

export default mongoose.model("User", userSchema);


