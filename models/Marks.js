const mongoose = require("mongoose");

const MarksSchema = new mongoose.Schema({
  facultyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  studentId: { type: String },
  course: { type: String },
  score: { type: Number },
  fileUrl: { type: String }, // if uploaded via Excel
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  feedback: { type: String, default: "" },
});

module.exports = mongoose.model("Marks", MarksSchema);
