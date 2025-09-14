const mongoose = require("mongoose");

const ScheduleSchema = new mongoose.Schema({
  facultyId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  fileUrl: String,
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  feedback: { type: String }
});

module.exports = mongoose.model("Schedule", ScheduleSchema);
