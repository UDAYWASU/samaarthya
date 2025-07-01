const express = require("express");
const router = express.Router();
const db = require("../db"); // This should be the pg Pool instance

// Get all users
router.get("/all", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new user
router.post("/create", async (req, res) => {
  const {
    name, email, phone_number, education,
    gender, password, user_type, branch,
    stream, linkedin_url, resume_url
  } = req.body;

  try {
    const result = await db.query(`
      INSERT INTO users (
        name, email, phone_number, education,
        gender, password_hash, user_type, branch,
        stream, linkedin_url, resume_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING id
    `, [
      name, email, phone_number, education,
      gender, password, user_type, branch,
      stream, linkedin_url, resume_url
    ]);
    res.status(201).json({ id: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a user
router.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const {
    name, email, phone_number, education,
    gender, password, user_type, branch,
    stream, linkedin_url, resume_url
  } = req.body;

  try {
    const result = await db.query(`
      UPDATE users SET
        name = $1, email = $2, phone_number = $3, education = $4,
        gender = $5, password_hash = $6, user_type = $7, branch = $8,
        stream = $9, linkedin_url = $10, resume_url = $11
      WHERE id = $12
    `, [
      name, email, phone_number, education,
      gender, password, user_type, branch,
      stream, linkedin_url, resume_url, id
    ]);
    res.json({ updated: result.rowCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a user
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query("DELETE FROM users WHERE id = $1", [id]);
    res.json({ deleted: result.rowCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
