import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import InterviewConfig from "./pages/InterviewConfig";
import Questions from "./pages/Questions";
import InterviewAnalysis from "./pages/InterviewAnalysis";
import InterviewInsights from "./pages/InterviewInsights";
import ContactUs from "./pages/ContactUs";
import LandingPage from "./pages/LandingPage";
import InstructionsPage from "./pages/Instructions";

// Inside <Routes>



//admin related routes
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminQuestions from "./pages/admin/AdminQuestions";
import AdminInterviews from "./pages/admin/AdminInterviews";
import AdminInterviewDetails from "./pages/admin/AdminInterviewDetails";

//teachers ralted routes
// Teacher Pages
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import TeacherQuestions from "./pages/teacher/TeacherQuestions";
import TeacherAnalysis from "./pages/teacher/TeacherAnalysis";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/interview/config" element={<InterviewConfig />} />
        <Route path="/interview/questions" element={<Questions />} />
        <Route path="/analysis" element={<InterviewAnalysis />} />
        <Route path="/interview/:interviewId/insights" element={<InterviewInsights />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/interview/instructions" element={<InstructionsPage />} />
        <Route path="/interview/questions" element={<Questions />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/questions" element={<AdminQuestions />} />
        <Route path="/admin/interviews" element={<AdminInterviews />} />
        <Route path="/admin/interview/:id" element={<AdminInterviewDetails />} />

        {/* Teacher Routes */}
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/teacher/questions" element={<TeacherQuestions />} />
        <Route path="/teacher/analysis" element={<TeacherAnalysis />} />


      </Routes>
    </Router>
  );
}
<div className="text-2xl text-blue-600 font-bold p-4">
  Tailwind is working!
</div>

export default App;
