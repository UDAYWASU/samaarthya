const express = require("express");
const router = express.Router();
const db = require("../db");
const path = require("path");
const { spawn } = require("child_process");
const fs = require("fs");

// 1️⃣ Create Interview
router.post("/start", async (req, res) => {
  const { user_id, domain, level } = req.body;

  if (!user_id || !domain || !level) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const result = await db.query(
      `INSERT INTO interviews (user_id, domain, level) VALUES ($1, $2, $3) RETURNING id`,
      [user_id, domain, level]
    );

    res.json({ interview_id: result.rows[0].id });
  } catch (err) {
    console.error("Insert error:", err.message);
    res.status(500).json({ error: "Insert failed" });
  }
});

// 2️⃣ Record Answer
router.post("/question", async (req, res) => {
  const {
    interview_id,
    question_number,
    question_text,
    question_type,
    video_path,
    code_answer,
  } = req.body;

  try {
    await db.query(
      `INSERT INTO interview_questions (
        interview_id, question_number, question_text, question_type, video_path, code_answer
      ) VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        interview_id,
        question_number,
        question_text,
        question_type,
        video_path || null,
        code_answer || null,
      ]
    );
    res.json({ status: "saved" });
  } catch (err) {
    console.error("Save question failed:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 3️⃣ Get all interviews for a user
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await db.query(
      `SELECT id, domain, level, created_at, fluency, confidence, lexical, grammar_language, subject_knowledge
       FROM interviews
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Failed to fetch interviews:", err.message);
    res.status(500).json({ error: "Failed to fetch interviews" });
  }
});

// 4️⃣ Get all questions for an interview
router.get("/:interviewId/questions", async (req, res) => {
  const { interviewId } = req.params;

  try {
    const result = await db.query(
      `SELECT * FROM interview_questions WHERE interview_id = $1`,
      [interviewId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Failed to fetch questions:", err.message);
    res.status(500).json({ error: "Failed to fetch questions" });
  }
});

// 5️⃣ Get interview + all questions
router.get("/insights/:id", async (req, res) => {
  const interviewId = req.params.id;

  try {
    const interviewResult = await db.query(
      `SELECT * FROM interviews WHERE id = $1`,
      [interviewId]
    );

    if (interviewResult.rows.length === 0) {
      return res.status(404).json({ error: "Interview not found" });
    }

    const questionsResult = await db.query(
      `SELECT * FROM interview_questions WHERE interview_id = $1`,
      [interviewId]
    );

    res.json({
      interview: interviewResult.rows[0],
      questions: questionsResult.rows,
    });
  } catch (err) {
    console.error("Error fetching insights:", err.message);
    res.status(500).json({ error: "Failed to fetch insights" });
  }
});

// 6️⃣ Generate + download PDF report
router.get("/download-report/:id", (req, res) => {
  const interviewId = req.params.id;
  const pythonScriptPath = path.join(__dirname, "../scripts/generate_report.py");
  const outputPath = path.join(__dirname, `../tmp/interview_${interviewId}.pdf`);

  const py = spawn("python", [pythonScriptPath, interviewId, outputPath]);

  py.stdout.on("data", (data) => {
    console.log(`Python: ${data}`);
  });

  py.stderr.on("data", (err) => {
    console.error(`Python Error: ${err}`);
  });

  py.on("close", (code) => {
    if (code === 0 && fs.existsSync(outputPath)) {
      res.download(outputPath, `Interview_Report_${interviewId}.pdf`, (err) => {
        if (!err) fs.unlinkSync(outputPath); // Clean up
      });
    } else {
      res.status(500).send("Failed to generate report.");
    }
  });
});

module.exports = router;
