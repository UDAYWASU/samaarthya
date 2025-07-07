# 🎤 Mock Interview Platform

A full-stack platform designed to simulate and analyze mock interviews. It enables users (students) to take interviews, records their responses, analyzes performance using audio/NLP techniques, and provides detailed feedback. Teachers and admins can manage content and view student performance.

---

## 📦 Features

### ✅ Student Side
- Login/Signup authentication
- Select domain & difficulty for interview
- Answer questions via audio/video or code input
- Real-time video recording
- Automatic speech and content analysis
- Detailed per-question & overall feedback
- PDF report generation of performance

### 🎓 Teacher/Admin Side
- Teacher dashboard to manage and add questions
- Admin dashboard to view all users, interviews, and analysis
- Filter/sort interviews by domain, level, date, or user
- Access to performance reports and metrics

---

## 🛠 Tech Stack

### Frontend
- **React.js**
- **Tailwind CSS**
- **React Router DOM**
- **Video.js** (for video playback)

### Backend
- **Node.js** + **Express.js**
- **Multer** for file uploads (video/audio)
- **FFmpeg** for audio extraction
- **Python** for audio/text analysis
  - OpenAI/Gemini (via OpenRouter) for NLP-based insights
  - Speech analysis for fluency, confidence, clarity, etc.

### Database
- **PostgreSQL** (previously SQLite)
- Tables:
  - `users`, `questions`, `interviews`, `interview_questions`
