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
    "http://localhost:3000", // React dev server
    "http://localhost:3001", // if you run frontend on another port
    "https://iqac-frontend-production.up.railway.app" // 🚀 deployed React frontend
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

/* ----------------- Middleware ----------------- */
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ----------------- API Routes ----------------- */
app.use("/api/auth", authRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/coordinator", coordinatorRoutes);
app.use("/api/admin", adminRoutes);

/* ----------------- Serve React build (production) ----------------- */
// 👉 Only if you're deploying frontend + backend together in one Railway service
if (process.env.NODE_ENV === "production") {
  const clientBuildPath = path.join(__dirname, "client", "build");
  app.use(express.static(clientBuildPath));

  // All other routes → React index.html
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
  .catch((err) => console.error("MongoDB connection failed:", err));
