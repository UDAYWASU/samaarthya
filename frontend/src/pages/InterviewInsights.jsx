import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import useTheme from "../hooks/useTheme";

export default function InterviewInsights() {
  const { interviewId } = useParams();
  const { theme } = useTheme();
  const [interview, setInterview] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showDetailed, setShowDetailed] = useState({});

  useEffect(() => {
    fetch(`http://localhost:4000/api/interviews/insights/${interviewId}`)
      .then((res) => res.json())
      .then((data) => {
        setInterview(data.interview);
        setQuestions(Array.isArray(data.questions) ? data.questions : Object.values(data.questions));
      })
      .catch(console.error);
  }, [interviewId]);

  const handleDownload = async () => {
    window.open(`http://localhost:4000/api/interviews/download-report/${interviewId}`, "_blank");
  };




  const renderMetric = (label, value, color) => (
    <div className="flex flex-col items-center gap-2">
      <div className="w-24 h-24">
        <CircularProgressbar
          value={value || 0}
          text={`${value || 0}%`}
          styles={buildStyles({
            textColor: theme === "dark" ? "#fff" : "#333",
            pathColor: color,
            trailColor: theme === "dark" ? "#374151" : "#e5e7eb",
          })}
        />
      </div>
      <span className="mt-1 text-sm font-medium text-gray-800 dark:text-gray-200">{label}</span>
    </div>
  );

  const metricDefinitions = {
    speech_rate_wpm: ["120–160 wpm", "Words spoken per minute; fluency indicator."],
    pause_ratio: ["0.1 – 0.3", "Ratio of silence to total time; reflects hesitation."],
    tempo_variation: ["< 0.5", "Consistency of speaking segments."],
    avg_pitch: ["85–180 Hz (m), 165–255 Hz (f)", "Average vocal pitch; indicates vocal tone."],
    pitch_variation: ["20–60 Hz", "Variation in pitch; shows expressiveness."],
    prosody_slope: ["~ 0", "Change in pitch over time; vocal modulation."],
    jitter: ["< 0.03", "Pitch stability; lower is better."],
    shimmer: ["< 0.05", "Loudness stability."],
    loudness: ["0.02 – 0.08", "Speech volume."],
    energy_variability: ["0.01 – 0.05", "Dynamism in speech energy."],
    formant_f1: ["200 – 1000 Hz", "Vowel height clarity."],
    formant_f2: ["800 – 2500 Hz", "Vowel frontness clarity."],
    type_token_ratio: ["> 0.5", "Lexical diversity."],
    advanced_vocab_words: ["Contextual", "List of advanced vocabulary used."],
    advanced_vocab_usage: ["> 0.1", "Proportion of advanced words."],
    redundant_words: ["Low", "Unnecessary or repeated words."],
    keyword_matches: ["Contextual", "Relevant keywords present."],
    keyword_density: ["> 0.02", "Keyword frequency per word."],
    pronoun_usage_count: ["Balanced", "Number of pronouns used."],
    pronoun_density: ["< 0.1", "Proportion of pronouns."],
    function_word_density: ["~0.4 – 0.6", "Grammar flow via helper words."],
    lexical_sophistication_index: ["> 0.6", "Complexity of vocabulary."],
    grammar_issues: ["0", "Grammar mistakes."],
    readability_score: ["60–80", "Ease of understanding."],
    syllables_per_word: ["1.5 – 1.8", "Vocabulary complexity."],
    tense_consistency: ["1.0", "Consistency in verb tenses."],
    answer_accuracy: ["~100", "How correct the answer was."],
    answer_completeness: ["~100", "How fully the question was answered."],
    depth_of_knowledge: ["~100", "Understanding and depth in answer."]
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-gray-900 dark:to-black py-12 px-6 text-gray-900 dark:text-gray-100 font-sans">
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-extrabold mb-12 text-center tracking-tight">
        Interview Insights
      </h1>

      {interview && (
        <section className="mb-14">
          <h2 className="text-3xl font-semibold mb-8 border-b border-gray-300 dark:border-gray-700 pb-3">
            Overall Performance
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 p-8 rounded-xl bg-white dark:bg-gray-800 shadow-lg">
            {renderMetric("Fluency", interview.fluency, "#3b82f6")}
            {renderMetric("Confidence", interview.confidence, "#22c55e")}
            {renderMetric("Lexical", interview.lexical, "#eab308")}
            {renderMetric("Grammar", interview.grammar_language, "#ef4444")}
            {renderMetric("Subject", interview.subject_knowledge, "#8b5cf6")}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-3xl font-semibold mb-8 border-b border-gray-300 dark:border-gray-700 pb-3">
          Question Analysis
        </h2>

        {questions.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400 italic">
            No questions found for this interview.
          </p>
        ) : (
          <div className="space-y-8">
            {questions.map((q, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg transition hover:shadow-xl"
              >
                <h3 className="text-xl font-bold text-indigo-700 dark:text-indigo-400 mb-5">
                  Q{q.question_number}: {q.question_text}
                </h3>

                {q.video_path && (
                  <div className="mb-6 relative w-64 aspect-video rounded-lg overflow-hidden shadow-md cursor-pointer group" onClick={() => setSelectedVideo(`http://localhost:4000/videos/${q.video_path}`)}>
                    <video
                      className="object-cover w-full h-full rounded-lg brightness-90 group-hover:brightness-110 transition"
                      src={`http://localhost:4000/videos/${q.video_path}`}
                      muted
                      preload="metadata"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      <svg className="w-12 h-12 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 select-none pointer-events-none">
                      Click to enlarge and play
                    </p>
                  </div>
                )}

                {q.improvised_answer && (
                  <div className="bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-600 p-5 mb-6 rounded-md">
                    <h4 className="font-semibold mb-2">Suggested Answer</h4>
                    <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line text-sm">{q.improvised_answer}</p>
                  </div>
                )}

                <div className="grid sm:grid-cols-3 gap-6 mb-6">
                  {renderMetric("Accuracy", q.answer_accuracy, "#16a34a")}
                  {renderMetric("Completeness", q.answer_completeness, "#f59e0b")}
                  {renderMetric("Depth", q.depth_of_knowledge, "#6366f1")}
                </div>

                <button
                  onClick={() => setShowDetailed((prev) => ({ ...prev, [idx]: !prev[idx] }))}
                  className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
                  aria-expanded={!!showDetailed[idx]}
                  aria-controls={`analysis-table-${idx}`}
                >
                  {showDetailed[idx] ? "Hide Analysis Details" : "View Full Analysis"}
                </button>

                {showDetailed[idx] && (
                  <div
                    id={`analysis-table-${idx}`}
                    className="overflow-x-auto mt-6 border rounded-lg shadow-sm"
                  >
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                        <tr>
                          <th className="p-3 font-semibold">Metric</th>
                          <th className="p-3 font-semibold">Value</th>
                          <th className="p-3 font-semibold">Ideal</th>
                          <th className="p-3 font-semibold">Definition</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(q).map(([key, value]) => {
                          if (
                            ["question_text", "question_number", "video_path", "interview_id", "id", "improvised_answer"].includes(key) ||
                            value === null
                          )
                            return null;

                          const [ideal, description] = metricDefinitions[key] || ["-", "-"];

                          return (
                            <tr
                              key={key}
                              className="even:bg-gray-50 dark:even:bg-gray-800 border-t border-gray-200 dark:border-gray-700"
                            >
                              <td className="p-3 capitalize text-gray-900 dark:text-gray-100">
                                {key.replaceAll("_", " ")}
                              </td>
                              <td className="p-3">{typeof value === "number" ? value.toFixed(2) : value}</td>
                              <td className="p-3 text-gray-600 dark:text-gray-400">{ideal}</td>
                              <td className="p-3 text-gray-500 dark:text-gray-400">{description}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedVideo(null)}
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
        >
          <div
            className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-2xl max-w-4xl w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <video controls autoPlay className="w-full rounded-lg">
              <source src={selectedVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <button
              className="absolute top-3 right-4 text-gray-700 dark:text-gray-300 hover:text-red-600 text-3xl font-bold leading-none focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
              onClick={() => setSelectedVideo(null)}
              aria-label="Close video modal"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
    {/* Floating Download Button */}
<button
  onClick={handleDownload}
  className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center shadow-lg hover:bg-indigo-700 dark:hover:bg-indigo-400 transition-colors"
  title="Download Report"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    className="w-7 h-7"
  >
    <path
      opacity="0.5"
      d="M3 15C3 17.8284 3 19.2426 3.87868 20.1213C4.75736 21 6.17157 21 9 21H15C17.8284 21 19.2426 21 20.1213 20.1213C21 19.2426 21 17.8284 21 15"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 3V16M12 16L16 11.625M12 16L8 11.625"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
</button>


  </div>
);

}