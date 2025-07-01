app.post("/api/teacher/questions", async (req, res) => {
  const { question_text, question_level, question_domain, question_type } = req.body;

  if (!question_text || !question_level || !question_domain || !question_type) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const result = await db.run(
      `INSERT INTO questions (question_number, question_text, question_level, question_domain, question_type)
       VALUES ((SELECT COALESCE(MAX(question_number), 0) + 1 FROM questions), ?, ?, ?, ?)`,
      [question_text, question_level, question_domain, question_type]
    );

    res.status(201).json({
      message: "Question added successfully.",
      question_number: result.lastID // Optional: if using sqlite3
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error.", error: err.message });
  }
});
