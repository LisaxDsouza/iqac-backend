require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

/* ----------------- Routes ----------------- */
const coordinatorRoutes = require("./routes/coordinator");
const authRoutes = require("./routes/auth");
const facultyRoutes = require("./routes/faculty");
const adminRoutes = require("./routes/admin");

const app = express();

/* ----------------- CORS ----------------- */
app.use(cors({
  origin: [
    "http://localhost:3000", // React dev server
    "http://localhost:3001", // alternate dev port
    "https://iqac-frontend-production.up.railway.app" // 🚀 deployed frontend
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// Handle preflight requests for all routes
app.options("*", cors());

/* ----------------- Middleware ----------------- */
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ----------------- API Routes ----------------- */
app.use("/api/auth", authRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/coordinator", coordinatorRoutes);
app.use("/api/admin", adminRoutes);

/* ----------------- Serve React build (only if fullstack in same service) ----------------- */
if (process.env.NODE_ENV === "production") {
  const clientBuildPath = path.join(__dirname, "client", "build");
  app.use(express.static(clientBuildPath));

  // ✅ Fix for Express v5: use `(.*)` instead of `"*"`
  app.get(/^(?!\/api).*/, (req, res) => {
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
