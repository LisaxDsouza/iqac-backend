const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const auth = require("../middleware/authMiddleware");

const Schedule = require("../models/Schedule");
const Plan = require("../models/Plan");
const Marks = require("../models/Marks");
const Assignment = require("../models/Assignment");

// Multer setup for Excel uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

/* ------------------ TIMETABLE ------------------ */
router.post("/upload-schedule", auth, upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ msg: "No file uploaded" });

  const fileUrl = `http://localhost:3000/uploads/${req.file.filename}`;
  const schedule = new Schedule({
    facultyId: req.user.id,
    fileUrl,
    status: "pending"  // ✅ ensure pending
  });
  await schedule.save();

  res.json({ msg: "Timetable uploaded", fileUrl });
});

router.get("/schedules", auth, async (req, res) => {
  const schedules = await Schedule.find({ facultyId: req.user.id });
  res.json(schedules);
});

/* ------------------ COURSE PLANS ------------------ */
router.post("/plans", auth, async (req, res) => {
  try {
    const plan = new Plan({
      facultyId: req.user.id,
      ...req.body,
      status: "pending"  // ✅ ensure pending
    });
    await plan.save();
    res.json(plan);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/plans", auth, async (req, res) => {
  const plans = await Plan.find({ facultyId: req.user.id });
  res.json(plans);
});

/* ------------------ MARKS ------------------ */
// Manual entry
router.post("/marks", auth, async (req, res) => {
  try {
    const marks = new Marks({
      facultyId: req.user.id,
      ...req.body,
      status: "pending"  // ✅ ensure pending
    });
    await marks.save();
    res.json(marks);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/marks", auth, async (req, res) => {
  const marks = await Marks.find({ facultyId: req.user.id });
  res.json(marks);
});

// Excel upload
router.post("/upload-marks", auth, upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ msg: "No file uploaded" });

  const fileUrl = `http://localhost:3000/uploads/${req.file.filename}`;
  const marks = new Marks({
    facultyId: req.user.id,
    fileUrl,
    status: "pending"  // ✅ ensure pending
  });
  await marks.save();

  res.json({ msg: "Marks sheet uploaded", fileUrl });
});

/* ------------------ ASSIGNMENTS ------------------ */
router.post("/assignments", auth, async (req, res) => {
  try {
    const assignment = new Assignment({
      facultyId: req.user.id,
      ...req.body,
      status: "pending"  // ✅ ensure pending
    });
    await assignment.save();
    res.json(assignment);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/assignments", auth, async (req, res) => {
  const assignments = await Assignment.find({ facultyId: req.user.id });
  res.json(assignments);
});

/* ------------------ DELETE (optional) ------------------ */
router.delete("/plans/:id", auth, async (req, res) => {
  await Plan.findByIdAndDelete(req.params.id);
  res.json({ msg: "Plan deleted" });
});

router.delete("/marks/:id", auth, async (req, res) => {
  await Marks.findByIdAndDelete(req.params.id);
  res.json({ msg: "Marks deleted" });
});

router.delete("/assignments/:id", auth, async (req, res) => {
  await Assignment.findByIdAndDelete(req.params.id);
  res.json({ msg: "Assignment deleted" });
});

module.exports = router;
