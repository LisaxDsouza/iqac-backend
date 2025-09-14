// backend/routes/coordinator.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

// Import models
const Plan = require("../models/Plan");
const Marks = require("../models/Marks");
const Assignment = require("../models/Assignment");
const Schedule = require("../models/Schedule");

/* ------------------ FETCH ALL ------------------ */
router.get("/plans", auth, async (req, res) => {
  try {
    const plans = await Plan.find();
    res.json(Array.isArray(plans) ? plans : []);
  } catch (err) {
    console.error("Error fetching plans:", err);
    res.status(500).json([]);
  }
});

router.get("/marks", auth, async (req, res) => {
  try {
    const marks = await Marks.find();
    res.json(Array.isArray(marks) ? marks : []);
  } catch (err) {
    console.error("Error fetching marks:", err);
    res.status(500).json([]);
  }
});

router.get("/assignments", auth, async (req, res) => {
  try {
    const assignments = await Assignment.find();
    res.json(Array.isArray(assignments) ? assignments : []);
  } catch (err) {
    console.error("Error fetching assignments:", err);
    res.status(500).json([]);
  }
});

router.get("/schedules", auth, async (req, res) => {
  try {
    const schedules = await Schedule.find();
    res.json(Array.isArray(schedules) ? schedules : []);
  } catch (err) {
    console.error("Error fetching schedules:", err);
    res.status(500).json([]);
  }
});

/* ------------------ REVIEW (Approve/Reject + Feedback) ------------------ */
router.put("/review/:type/:id", auth, async (req, res) => {
  const { type, id } = req.params;
  const { status, feedback } = req.body;

  try {
    let model;

    if (type === "plan") model = Plan;
    if (type === "marks") model = Marks;
    if (type === "assignment") model = Assignment;
    if (type === "schedule") model = Schedule;

    if (!model) return res.status(400).json({ msg: "Invalid type" });

    const item = await model.findByIdAndUpdate(
      id,
      { status, feedback },
      { new: true } // ✅ return updated doc
    );

    if (!item) return res.status(404).json({ msg: "Item not found" });

    res.json(item);
  } catch (err) {
    console.error("Review error:", err);
    res.status(500).json({ msg: "Server error reviewing item" });
  }
});

module.exports = router;
