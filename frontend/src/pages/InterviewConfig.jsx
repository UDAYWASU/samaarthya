import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useTheme from "../hooks/useTheme";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";

const levels = ["Beginner", "Intermediate", "Advanced"];
const domains = ["Web Development", "Communication", "Python", "OOP"];

export default function InterviewConfig() {
  const navigate = useNavigate();
  const [level, setLevel] = useState("");
  const [domain, setDomain] = useState("");
  const { theme, toggleTheme } = useTheme();

  const handleStart = async () => {
    if (!level || !domain) return;
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (!user?.userId) {
      alert("User not logged in.");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/api/interviews/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.userId, domain, level }),
      });

      if (!res.ok) throw new Error("Interview creation failed");
      const data = await res.json();

      navigate("/interview/instructions", {
        state: { level, domain, interviewId: data.interview_id },
      });
    } catch (err) {
      console.error("Error starting interview:", err);
      alert("Could not start interview.");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4"
      style={{
        backgroundImage: "url('/images/interview-bg.png')",
      }}
    >
      {/* Frosted Glass Card */}
      <div className="backdrop-blur-lg bg-white/30 dark:bg-gray-800/30 border border-white/20 dark:border-gray-700 rounded-xl shadow-2xl w-full max-w-3xl p-10 space-y-10 transition relative">
        {/* Theme Toggle */}
        <div className="absolute top-6 right-6">
          <button
            onClick={toggleTheme}
            className="p-2 bg-white dark:bg-gray-800 shadow-md rounded-full hover:rotate-45 transform transition-all duration-300"
          >
            {theme === "light" ? (
              <MoonIcon className="h-5 w-5 text-gray-900" />
            ) : (
              <SunIcon className="h-5 w-5 text-yellow-300" />
            )}
          </button>
        </div>

        <h2 className="text-center text-4xl font-extrabold text-gray-800 dark:text-white">
          🚀 Ready for an Interview?
        </h2>

        {/* Levels */}
        <div>
          <p className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">Choose Level</p>
          <div className="grid grid-cols-3 gap-4">
            {levels.map((l) => (
              <button
                key={l}
                onClick={() => setLevel(l)}
                className={`rounded-xl py-4 text-center font-medium transition border-2 ${
                  level === l
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white/50 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600"
                } hover:scale-105 backdrop-blur-sm`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Domains */}
        <div>
          <p className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">Select Domain</p>
          <div className="grid grid-cols-3 gap-4">
            {domains.map((d) => (
              <button
                key={d}
                onClick={() => setDomain(d)}
                className={`rounded-xl py-4 text-center font-medium transition border-2 ${
                  domain === d
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white/50 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600"
                } hover:scale-105 backdrop-blur-sm`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <div className="text-center">
          <button
            onClick={handleStart}
            disabled={!level || !domain}
            className={`px-8 py-4 text-lg font-bold rounded-full transition-all duration-300 shadow-lg ${
              level && domain
                ? "bg-indigo-500 hover:bg-indigo-600 text-white animate-pulse"
                : "bg-gray-300 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
            }`}
          >
            Start Interview 🎤
          </button>
        </div>
      </div>
    </div>
  );
}
