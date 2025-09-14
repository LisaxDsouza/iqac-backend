const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

// Models
const User = require("../models/User");
const Plan = require("../models/Plan");
const Marks = require("../models/Marks");
const Assignment = require("../models/Assignment");
const Schedule = require("../models/Schedule");

/* ---------------- USERS ---------------- */
router.get("/users", auth, async (req, res) => {
  try {
    const users = await User.find();
    res.json(Array.isArray(users) ? users : []); // ✅ always array
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json([]);
  }
});

/* ---------------- SUBMISSIONS ---------------- */
router.get("/submissions", auth, async (req, res) => {
  try {
    const [plans, marks, assignments, schedules] = await Promise.all([
      Plan.find().populate("facultyId", "name email"),
      Marks.find().populate("facultyId", "name email"),
      Assignment.find().populate("facultyId", "name email"),
      Schedule.find().populate("facultyId", "name email"),
    ]);

    // ✅ merge all into single array
    const submissions = [
      ...(Array.isArray(plans) ? plans.map((p) => ({ ...p.toObject(), type: "plan" })) : []),
      ...(Array.isArray(marks) ? marks.map((m) => ({ ...m.toObject(), type: "marks" })) : []),
      ...(Array.isArray(assignments) ? assignments.map((a) => ({ ...a.toObject(), type: "assignment" })) : []),
      ...(Array.isArray(schedules) ? schedules.map((s) => ({ ...s.toObject(), type: "schedule" })) : []),
    ];

    res.json(submissions);
  } catch (err) {
    console.error("Error fetching submissions:", err);
    res.status(500).json([]);
  }
});

/* ---------------- REPORTS ---------------- */
// For now let's make sample/dummy reports
router.get("/reports", auth, async (req, res) => {
  try {
    const reports = [
      { title: "Monthly Submission Summary", content: "20 submissions were received this month." },
      { title: "Approval Rate", content: "80% of submissions were approved by coordinators." },
    ];

    res.json(Array.isArray(reports) ? reports : []); // ✅ safe
  } catch (err) {
    console.error("Error fetching reports:", err);
    res.status(500).json([]);
  }
});

module.exports = router;
