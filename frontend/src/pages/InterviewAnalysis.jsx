import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function InterviewAnalysis() {
  const [interviews, setInterviews] = useState([]);
  const [filterDomain, setFilterDomain] = useState("All");
  const [sortKey, setSortKey] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.userId) return;
    fetch(`http://localhost:4000/api/interviews/user/${user.userId}`)
      .then(res => res.json())
      .then(data => setInterviews(data))
      .catch(console.error);
  }, [user]);

  const calculateAverage = (metric) => {
    const validValues = interviews.map(i => i[metric]).filter(Number.isFinite);
    const avg = validValues.reduce((a, b) => a + b, 0) / validValues.length || 0;
    return Math.round(avg);
  };

  const renderScore = (label, value) => (
  <div className="flex flex-col items-center gap-3 p-4 rounded-xl bg-white/40 dark:bg-gray-800/40 backdrop-blur-md border border-white/20 dark:border-gray-600 shadow-md hover:shadow-lg transition">
    <div className="w-24 h-24">
      <CircularProgressbar
        value={value}
        text={`${value}%`}
        styles={{
          path: {
            stroke: value >= 75 ? "#16a34a" : value >= 50 ? "#facc15" : "#ef4444",
            strokeLinecap: "round",
            transition: "stroke-dashoffset 0.5s ease 0s"
          },
          trail: { stroke: "#e4e4e7", strokeLinecap: "round" },
          text: {
            fill: "#1f2937",
            fontSize: "16px",
            fontWeight: "bold"
          },
        }}
      />
    </div>
    <span className="text-gray-800 dark:text-gray-200 font-semibold text-sm uppercase tracking-wide">
      {label}
    </span>
  </div>
);


  const handleCardClick = (interviewId) => {
    navigate(`/interview/${interviewId}/insights`);
  };

  const domains = ["All", ...new Set(interviews.map(i => i.domain))];
  const filtered = filterDomain === "All"
    ? interviews
    : interviews.filter(i => i.domain === filterDomain);

  const sorted = [...filtered].sort((a, b) => {
    if (sortKey === "date") {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    } else if (sortKey === "fluency") {
      return sortOrder === "asc"
        ? (a.fluency ?? 0) - (b.fluency ?? 0)
        : (b.fluency ?? 0) - (a.fluency ?? 0);
    }
    return 0;
  });

  return (
    
  <div
  className="min-h-screen bg-cover bg-fixed bg-center p-6 md:p-12 transition-colors duration-300"
  style={{ backgroundImage: "url('/images/analysis-bg.jpg')" }} // Adjust path as needed
>

  <div className="max-w-7xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 text-gray-900 dark:text-white drop-shadow-md tracking-tight">
  Interview Performance Overview
</h1>


      <section className="mb-16">
  <div className="backdrop-blur-lg bg-white/60 dark:bg-gray-800/50 border border-white/30 dark:border-gray-600 rounded-2xl shadow-2xl p-8 transition duration-300">
    <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white mb-6 tracking-tight drop-shadow-sm">
      Your Average Performance
    </h2>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
      {renderScore("Fluency", calculateAverage("fluency"))}
      {renderScore("Confidence", calculateAverage("confidence"))}
      {renderScore("Lexical", calculateAverage("lexical"))}
      {renderScore("Grammar", calculateAverage("grammar_language"))}
      {renderScore("Subject", calculateAverage("subject_knowledge"))}
    </div>
  </div>
</section>



      {/* Filters */}
      <section className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
  {/* Domain Filter */}
  <div className="flex items-center gap-3 bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg border border-white/20 dark:border-gray-700 px-4 py-2 rounded-xl shadow-md">
    <label className="text-gray-800 dark:text-gray-200 font-medium whitespace-nowrap">
      Domain:
    </label>
    <select
      className="bg-transparent text-gray-900 dark:text-white font-medium outline-none px-2 py-1 rounded-md hover:bg-white/50 dark:hover:bg-gray-700/50 transition"
      value={filterDomain}
      onChange={(e) => setFilterDomain(e.target.value)}
    >
      {domains.map(domain => (
        <option key={domain} value={domain}>{domain}</option>
      ))}
    </select>
  </div>

  {/* Sort Options */}
  <div className="flex items-center gap-4 bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg border border-white/20 dark:border-gray-700 px-4 py-2 rounded-xl shadow-md">
    <label className="text-gray-800 dark:text-gray-200 font-medium whitespace-nowrap">
      Sort by:
    </label>
    <select
      className="bg-transparent text-gray-900 dark:text-white font-medium outline-none px-2 py-1 rounded-md hover:bg-white/50 dark:hover:bg-gray-700/50 transition"
      value={sortKey}
      onChange={(e) => setSortKey(e.target.value)}
    >
      <option value="date">Date</option>
      <option value="fluency">Fluency</option>
    </select>
    <select
      className="bg-transparent text-gray-900 dark:text-white font-medium outline-none px-2 py-1 rounded-md hover:bg-white/50 dark:hover:bg-gray-700/50 transition"
      value={sortOrder}
      onChange={(e) => setSortOrder(e.target.value)}
    >
      <option value="desc">⬇ Desc</option>
      <option value="asc">⬆ Asc</option>
    </select>
  </div>
</section>


      {/* Interview History */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">Interview History</h2>
        {sorted.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center">No interviews match the selected filters.</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((interview) => (
                    <div
        key={interview.id}
        className="backdrop-blur-xl bg-white/50 dark:bg-gray-800/50 border border-white/30 dark:border-gray-600 p-6 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-[1.03] transition-all duration-300 cursor-pointer hover:border-indigo-500 dark:hover:border-indigo-400"
      onClick={() => handleCardClick(interview.id)}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {interview.domain}
          </h3>
          <span className="text-xs bg-indigo-100 dark:bg-indigo-700 text-indigo-700 dark:text-white px-2 py-0.5 rounded-full font-medium">
            {interview.level}
          </span>
        </div>
                  
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {new Date(interview.created_at).toLocaleString()}
        </p>
                  
        <div className="space-y-1 text-sm text-gray-800 dark:text-gray-200">
          <p>
            <strong>Fluency:</strong>{" "}
            {interview.fluency ?? (
              <span className="text-gray-400">Not released</span>
            )}
          </p>
          <p>
            <strong>Confidence:</strong>{" "}
            {interview.confidence ?? (
              <span className="text-gray-400">Not released</span>
            )}
          </p>
        </div>
      </div>
      
            ))}
          </div>
        )}
      </section>
    </div>
  </div>


  );
}
