CREATE TABLE IF NOT EXISTS interview_questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  interview_id INTEGER,
  question_number INTEGER,
  question_text TEXT,
  question_type TEXT NOT NULL CHECK (question_type IN ('spoken', 'coding')),
  video_path TEXT,                     -- For spoken questions
  code_answer TEXT,                    -- For coding questions

  -- 🔍 Fluency metrics (spoken only)
  speech_rate_wpm REAL,
  pause_ratio REAL,
  tempo_variation REAL,

  -- 🔊 Confidence metrics
  avg_pitch REAL,
  pitch_variation REAL,
  prosody_slope REAL,
  jitter REAL,
  shimmer REAL,

  -- 🧼 Clarity metrics
  loudness REAL,
  energy_variability REAL,
  formant_f1 REAL,
  formant_f2 REAL,

  -- 🧠 Lexical features
  type_token_ratio REAL,
  advanced_vocab_words TEXT,          -- JSON string
  advanced_vocab_usage REAL,
  redundant_words TEXT,               -- JSON string
  keyword_matches TEXT,               -- JSON string
  keyword_density REAL,
  pronoun_usage_count INTEGER,
  pronoun_density REAL,
  function_word_density REAL,
  lexical_sophistication_index REAL,

  -- ✍️ Grammar and Language
  grammar_issues INTEGER,
  readability_score REAL,
  syllables_per_word REAL,
  tense_consistency REAL,

  -- 📝 Answer Evaluation
  improvised_answer TEXT,
  answer_accuracy REAL,
  answer_completeness REAL,
  depth_of_knowledge REAL,

  FOREIGN KEY (interview_id) REFERENCES interviews(id)
);
