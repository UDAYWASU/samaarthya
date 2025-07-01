import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useTheme from "../hooks/useTheme";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";

export default function InstructionsPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { level, domain, interviewId } = state || {};
  const { theme, toggleTheme } = useTheme();

  const handleBeginInterview = () => {
    navigate("/interview/questions", {
      state: { level, domain, interviewId },
    });
  

  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4"
      style={{ backgroundImage: "url('/images/instructions-bg.png')" }}
    >
      {/* Frosted Glass Card */}
      <div className="backdrop-blur-lg bg-white/20 dark:bg-gray-900/30 border border-white/30 dark:border-gray-700 rounded-xl shadow-2xl w-full max-w-4xl p-10 space-y-10 transition relative">

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

        {/* Title */}
        <h2 className="text-center text-4xl font-extrabold text-white dark:text-white drop-shadow">
          📋 Interview Instructions
        </h2>

        {/* Interview Instructions */}
        <ul className="list-disc space-y-5 text-white/90 dark:text-gray-100 text-lg pl-6 leading-relaxed">
          <li>
            <span className="text-red-500 font-semibold">Do not switch tabs</span> or minimize the window at any point during the interview. This will be tracked and may result in disqualification.
          </li>
          <li>
            <span className="text-red-500 font-semibold">Each question includes a mandatory thinking time</span> before you can proceed. You will not be able to skip or fast-forward this time.
          </li>
          <li>
            Recording will begin automatically <span className="text-red-500 font-semibold">as soon as the question becomes visible</span>. Use the initial seconds to gather your thoughts before speaking.
          </li>
          <li>
            You must respond <span className="font-semibold">verbally</span>. For coding questions, you are also required to <span className="font-semibold">type your solution</span> in the editor provided.
          </li>
          <li>
            <span className="font-semibold">Camera and microphone access are mandatory</span>. Ensure both are functional and enabled before starting.
          </li>
          <li>
            <span className="text-red-500 font-semibold">Do not refresh, pause, or exit</span> the interview once it has started. It cannot be restarted or resumed under any circumstances.
          </li>
          <li>
            Clicking "Next Question" will <span className="text-red-500 font-semibold">automatically submit your current response</span>. There is no separate submit button — submission is handled in the background.
          </li>
          <li>
            <span className="font-semibold">Stay attentive and maintain a professional demeanor</span> throughout the session. You are expected to be on camera at all times.
          </li>
          <li>
            All responses are monitored for quality, authenticity, and adherence to instructions. <span className="text-red-500 font-semibold">Any suspicious behavior may lead to rejection</span>.
          </li>
        </ul>

        {/* Start Interview Button */}
        <div className="text-center">
          <button
            onClick={handleBeginInterview}
            className="px-8 py-4 text-lg font-bold rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg transition-all duration-300 animate-pulse"
          >
            Begin Interview 🎥
          </button>
        </div>
      </div>
    </div>
  );
}
