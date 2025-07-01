import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("http://localhost:4000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error || "Login failed");
      return;
    }

    // Fetch user type
    const userTypeRes = await fetch(`http://localhost:4000/api/auth/user-type/${email}`);
    const userTypeData = await userTypeRes.json();

    if (!userTypeRes.ok) {
      alert(userTypeData.error || "Failed to get user type");
      return;
    }

    // Store user and navigate accordingly
    localStorage.setItem("user", JSON.stringify({ ...data, user_type: userTypeData.user_type }));

    if (userTypeData.user_type === "admin") {
      navigate("/admin/dashboard");
    } else if (userTypeData.user_type === "teacher") {
      navigate("/teacher/dashboard");
    } else {
      navigate("/dashboard"); // default for students or unknown types
    }


  } catch (error) {
    console.error("Login error:", error);
    alert("Something went wrong. Please try again.");
  }
};

  return (
    <div
      className="min-h-screen flex flex-col lg:flex-row items-center justify-center px-4 bg-cover bg-center relative"
      style={{ backgroundImage: "url('/images/texture-bg.svg')" }}
    >
      {/* Optional background blur overlay */}
      <div className="absolute inset-0 bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm z-0"></div>

      {/* Left Illustration */}
      <div className="hidden lg:flex lg:w-1/2 justify-center relative z-10">
        <img
          src="/images/login-bg.png"
          alt="Illustration"
          className="max-w-md w-full h-auto"
        />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md backdrop-blur-lg bg-white/30 dark:bg-gray-800/30 border border-white/20 dark:border-gray-700 rounded-xl shadow-2xl p-10 space-y-6">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 dark:text-white">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white/90 dark:bg-gray-700/90 text-gray-800 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white/90 dark:bg-gray-700/90 text-gray-800 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md font-semibold transition duration-300"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{" "}
          <span
            className="text-indigo-500 hover:underline cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>

        <p className="text-center text-xs text-gray-400">
          <a
            href="https://storyset.com/work"
            target="_blank"
            rel="noopener noreferrer"
          >
            Work illustrations by Storyset
          </a>
        </p>
      </div>
    </div>
  );
}
