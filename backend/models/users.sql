CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  phone_number TEXT,
  education TEXT,
  gender TEXT,
  user_type TEXT NOT NULL,           -- 'student', 'professional', 'expert', 'admin'
  branch TEXT,
  stream TEXT,
  approval_status TEXT DEFAULT 'pending',  -- 'approved', 'rejected', 'pending'
  is_active BOOLEAN DEFAULT 1,             -- soft delete toggle
  linkedin_url TEXT,                 -- optional LinkedIn profile
  resume_url TEXT,                   -- optional resume link (PDF, drive link, etc.)
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
