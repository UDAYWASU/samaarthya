CREATE TABLE IF NOT EXISTS interviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  domain TEXT,
  level TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  -- 🔍 Overall Analysis Metrics (can be null initially)
  fluency REAL,
  confidence REAL,
  lexical REAL,
  grammar_language REAL,
  subject_knowledge REAL,

  FOREIGN KEY (user_id) REFERENCES users(id)
);
