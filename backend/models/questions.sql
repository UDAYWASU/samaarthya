CREATE TABLE IF NOT EXISTS questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  question_number INTEGER UNIQUE NOT NULL,
  question_text TEXT NOT NULL,
  question_level TEXT NOT NULL,
  question_domain TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('spoken', 'coding')),
  audio_path TEXT                      -- Optional for coding questions
);
