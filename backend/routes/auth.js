const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../db");

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  const {
    name,
    email,
    phone_number,
    education,
    gender,
    password,
    user_type,
    branch,
    stream,
    linkedin_url,
    resume_url
  } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    // Check if user already exists
    const existing = await db.query("SELECT * FROM users WHERE email = $1", [email]);

    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO users (
        name, email, phone_number, education, gender,
        user_type, branch, stream, linkedin_url, resume_url,
        password_hash
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING id
    `;

    const values = [
      name,
      email,
      phone_number,
      education,
      gender,
      user_type || 'student',
      branch,
      stream,
      linkedin_url,
      resume_url,
      hashedPassword
    ];

    const result = await db.query(query, values);

    res.status(201).json({
      message: "User registered",
      userId: result.rows[0].id
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ error: "Email and password are required" });

  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];

    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    res.json({
      message: "Login successful",
      userId: user.id,
      name: user.name,
      email: user.email
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET USER TYPE BY EMAIL
router.get("/user-type/:email", async (req, res) => {
  const email = req.params.email;

  try {
    const result = await db.query("SELECT user_type FROM users WHERE email = $1", [email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const userType = result.rows[0].user_type;
    console.log(`Fetched user_type for ${email}:`, userType);
    res.json({ user_type: userType });
  } catch (err) {
    console.error("DB Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;