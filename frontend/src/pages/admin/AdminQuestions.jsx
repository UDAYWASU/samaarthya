import React, { useState } from "react";

export default function TeacherQuestions() {
  const [form, setForm] = useState({
    question_text: "",
    question_level: "",
    question_domain: "",
    question_type: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.question_text ||
      !form.question_level ||
      !form.question_domain ||
      !form.question_type
    ) {
      setMessage("Please fill all the fields.");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/api/teacher/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Question added successfully!");
        setForm({
          question_text: "",
          question_level: "",
          question_domain: "",
          question_type: "",
        });
      } else {
        setMessage(data.message || "Failed to add question.");
      }
    } catch (err) {
      console.error("Error submitting question", err);
      setMessage("Server error.");
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Add a New Question</h2>

      {message && (
        <div className="mb-4 text-sm text-red-600 font-medium">{message}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Question Text</label>
          <textarea
            name="question_text"
            value={form.question_text}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            rows={4}
            placeholder="Enter the question..."
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Question Level</label>
          <select
            name="question_level"
            value={form.question_level}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select level</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Question Domain</label>
          <select
            name="question_domain"
            value={form.question_domain}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select domain</option>
            <option value="Web">Web</option>
            <option value="AI">AI</option>
            <option value="DBMS">DBMS</option>
            <option value="DSA">DSA</option>
            <option value="OS">OS</option>
            {/* Add more as needed */}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Question Type</label>
          <select
            name="question_type"
            value={form.question_type}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select type</option>
            <option value="spoken">Spoken</option>
            <option value="coding">Coding</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow"
        >
          Submit Question
        </button>
      </form>
    </div>
  );
}
