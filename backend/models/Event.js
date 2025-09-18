import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // which admin created it
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      enum: ["Sports", "Hackathon", "Cultural", "Workshop"],
      required: true,
    },
    location: {
      type: String,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    onlineLink: {
      type: String, // for hybrid/online events
      trim: true,
    },

    // ✅ Auto-set when created
    createdAt: {
      type: Date,
      default: Date.now,
    },

    // ✅ Registrations (students who registered)
    registrations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true } // adds createdAt & updatedAt automatically
);

export default mongoose.model("Event", eventSchema);
