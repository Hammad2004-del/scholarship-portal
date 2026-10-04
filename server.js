require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth");
const applicationRoutes = require("./routes/applications");
const adminRoutes = require("./routes/admin");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the frontend files you already built (Scholarship.html, portal.css, etc.)
// Place them in a folder named "public" next to this file.
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", authRoutes);
app.use("/api", applicationRoutes);
app.use("/api", adminRoutes);

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
