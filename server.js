require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const coordinatorRoutes = require("./routes/coordinator");
const authRoutes = require("./routes/auth");
const facultyRoutes = require("./routes/faculty");
const adminRoutes = require("./routes/admin");

const app = express();

/* ----------------- CORS ----------------- */
app.use(cors({
  origin: [
    "http://localhost:3000",   // local React dev
    "http://localhost:3001",   // alternate local port
    "https://iqac-frontend-production.up.railway.app" // 🚀 deployed frontend
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// ✅ Express v5 safe way for preflight requests
app.options(/.*/, cors());

/* ----------------- Middleware ----------------- */
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ----------------- API Routes ----------------- */
app.use("/api/auth", authRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/coordinator", coordinatorRoutes);
app.use("/api/admin", adminRoutes);

/* ----------------- Serve React build (optional) ----------------- */
// 👉 Only if frontend + backend are in one service.
// If frontend is on its own Railway/Vercel, you can remove this.
if (process.env.NODE_ENV === "production") {
  const clientBuildPath = path.join(__dirname, "client", "build");
  app.use(express.static(clientBuildPath));

  // Catch-all → React index.html
  app.get("/*", (req, res) => {
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
