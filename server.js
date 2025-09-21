require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

// Routes
const coordinatorRoutes = require("./routes/coordinator");
const authRoutes = require("./routes/auth");
const facultyRoutes = require("./routes/faculty");
const adminRoutes = require("./routes/admin");

const app = express();

/* ----------------- CORS ----------------- */
app.use(
  cors({
    origin: [
      "http://localhost:3000", // React dev server
      "http://localhost:3001", // alt dev port
      "https://iqac-frontend-production.up.railway.app", // 🚀 deployed frontend
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

/* ----------------- Middleware ----------------- */
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ----------------- API Routes ----------------- */
app.use("/api/auth", authRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/coordinator", coordinatorRoutes);
app.use("/api/admin", adminRoutes);

/* ----------------- Serve React build (production) ----------------- */
// 👉 only used if you deploy frontend + backend together on Railway
if (process.env.NODE_ENV === "production") {
  const clientBuildPath = path.join(__dirname, "client", "build");
  app.use(express.static(clientBuildPath));

  // ✅ Express v5-safe catch-all using regex
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });
}

/* ----------------- MongoDB connection ----------------- */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected...");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ MongoDB connection failed:", err));
