const express = require("express");
const mongoose = require("mongoose");
const ImportLog = require("./models/importLog.model");
require("dotenv").config();
const app = express();

const cors = require("cors");
app.use(cors());

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// API Route to get import logs
app.get("/api/import-logs", async (req, res) => {
  const logs = await ImportLog.find().sort({ timestamp: -1 }).limit(50);
  res.json(logs);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
