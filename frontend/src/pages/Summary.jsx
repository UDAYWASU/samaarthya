import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Summary() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) return <p>No data available.</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Interview Summary</h2>
      <ul className="space-y-4">
        {state.questions.map((q, i) => (
          <li key={q.id} className="bg-white p-4 rounded shadow">
            <p className="font-medium">Q{i + 1}: {q.text}</p>
            <p className="mt-2 text-gray-700">Answer: {state.answers[i]}</p>
          </li>
        ))}
      </ul>
      <button
        onClick={() => navigate("/dashboard")}
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Back to Dashboard
      </button>
    </div>
  );
}
