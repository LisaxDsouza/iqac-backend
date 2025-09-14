const mongoose = require("mongoose");

const AssignmentSchema = new mongoose.Schema({
  facultyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  deadline: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  feedback: { type: String, default: "" },
});

module.exports = mongoose.model("Assignment", AssignmentSchema);
