import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useTheme from "../hooks/useTheme"; // Adjust if needed
import ParticlesBackground from "../components/ParticlesBackground"; // adjust path
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";



export default function Dashboard() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const user = JSON.parse(localStorage.getItem("user"));
  const [isAnimating, setIsAnimating] = useState(false);

  const handleStartClick = () => {
    setIsAnimating(true);
    setTimeout(() => {
      navigate("/interview/config");
    }, 800); // match animation duration
  };


  useEffect(() => {
    if (!user || !user.name || !user.email) {
      navigate("/login");
    }
  }, [navigate, user]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
       {/* 👇 Background Animation */}
       <div className="absolute inset-0 z-0 pointer-events-none">
    <ParticlesBackground />
  </div>
      {/* Header */} 
      <header className="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <h2 className="text-2xl font-bold tracking-tight text-indigo-700 dark:text-indigo-400">
            🎓 Know Your POTEntial
          </h2>
          <div className="flex items-center gap-6 text-sm font-medium">
            <nav className="space-x-6 hidden md:flex">
              <a
                href="/dashboard"
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 border-b-2 border-transparent hover:border-indigo-500"
              >
                Dashboard
              </a>
              <a
                href="/analysis"
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 border-b-2 border-transparent hover:border-indigo-500"
              >
                Analysis
              </a>
              <a
                href="/contact"
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 border-b-2 border-transparent hover:border-indigo-500"
              >
                Contact Us
              </a>
            </nav>
            <button
              onClick={toggleTheme}
              className="text-xs bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              title={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`}
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center px-4 py-20">
        <div
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-10 w-full max-w-2xl text-center transition duration-300 animate-fade-in"
        >
          <h1 className="text-4xl font-extrabold mb-6 text-gray-800 dark:text-white">
            Welcome back, <span className="text-indigo-600 dark:text-indigo-400">{user?.name}</span> 👋
          </h1>
          <p className="text-md text-gray-700 dark:text-gray-300 mb-8">
            Ready to sharpen your interview skills? Kick off your next mock session with confidence.
          </p>
          <button
            onClick={() => navigate("/interview/config")}
            className="mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3 rounded-full shadow-md transform hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out animate-pulse"
          >
            Start Interview
          </button>
        </div>
      </main>
     
    </div>
  );
}
