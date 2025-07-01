const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/questions?level=Beginner&domain=Web Development
router.get('/', async (req, res) => {
  const { level, domain } = req.query;

  if (!level || !domain) {
    return res.status(400).json({ error: "Level and domain are required." });
  }

  const query = `
    SELECT * FROM questions
    WHERE question_level = $1 AND question_domain = $2
    ORDER BY RANDOM()
    LIMIT 10
  `;

  try {
    const result = await db.query(query, [level, domain]);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching questions:", err);
    res.status(500).json({ error: "Failed to fetch questions." });
  }
});

module.exports = router;
