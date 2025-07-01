const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();


const VIDEO_DIR = path.resolve(__dirname, "../../storage/video");

// Ensure the directory exists
fs.mkdirSync(VIDEO_DIR, { recursive: true });

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, VIDEO_DIR);
  },
  filename: (req, file, cb) => {
    // Create a unique filename by appending timestamp
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    const safeName = baseName.replace(/\s+/g, "_"); // Replace spaces with underscores
    cb(null, `${safeName}${ext}`);
  },
});

const upload = multer({ storage });

// Route to upload a video
router.post("/upload", upload.single("video"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const fileUrl = `${req.file.filename}`;

  res.status(200).json({
    message: "Video uploaded successfully!",
    filename: req.file.filename,
    url: fileUrl,
  });
});

module.exports = router;
