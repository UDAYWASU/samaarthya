// backend/server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./db");
const path = require('path');




dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
const questionRoutes = require('./routes/questions');
app.use("/api/questions", questionRoutes);
const uploadRoute = require('./routes/upload');
app.use("/api", uploadRoute);
const interviewRoutes = require("./routes/interviews");
app.use("/api/interviews", interviewRoutes);
// Serve static videos
app.use(
  '/videos',
  express.static('C:\\Users\\LOQ\\Documents\\code\\NLPIP\\web\\storage\\video')
);


const adminUserRoutes = require("./routes/adminusers");
app.use("/api/admin/users", adminUserRoutes);



//app.use("/api/interviews", require("./routes/interviews"));

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
