import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import CustomHeader from "../components/headerprpcem";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";

export default function LandingPage() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, []);

  return (
    <div
      className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-white transition-colors duration-300 relative"
      style={{
        backgroundImage: "url('/images/landing-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      {/* Fallback Overlay */}
      <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-0"></div>

      <div className="relative z-10">
        <CustomHeader />

        {/* Tagline + Theme Toggle */}
        <div className="flex justify-between items-center px-6 py-4 border-b dark:border-gray-700">
          <h2 className="text-3xl font-bold tracking-tight">
            Know Your <span className="text-indigo-600 dark:text-yellow-400 font-extrabold">POTE</span>ntial
          </h2>
          <button
            onClick={toggleTheme}
            className="p-2 bg-white dark:bg-gray-800 shadow-lg rounded-full hover:rotate-45 transform transition-all duration-300"
          >
            {theme === "light" ? (
              <MoonIcon className="h-6 w-6 text-gray-900" />
            ) : (
              <SunIcon className="h-6 w-6 text-yellow-300" />
            )}
          </button>
        </div>

        {/* Hero Section */}
        <section className="flex flex-col-reverse lg:flex-row items-center justify-between px-6 py-10 max-w-7xl mx-auto gap-10">
          <motion.div
            className="text-center lg:text-left max-w-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl p-8 rounded-xl shadow-2xl"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-extrabold leading-tight mb-6 text-gray-900 dark:text-white">
              Prepare. <br /> Practice. <br /> Perform.
            </h1>
            <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
              Analyze your interview skills with AI-powered insights and build your future.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-md text-lg font-semibold shadow"
            >
              Get Started
            </button>
          </motion.div>

          <motion.div
            className="max-w-md w-full"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <img
              src="/images/hero-illustration.png"
              alt="Interview Illustration"
              className="w-full object-contain"
            />
          </motion.div>
        </section>

        {/* Features Section */}
        <section id="features" className="px-6 py-16">
          <h3 className="text-3xl font-bold text-center mb-12">Why Choose Us</h3>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 max-w-6xl mx-auto">
            {[
              {
                title: "Realistic Mock Interviews",
                desc: "Simulate industry-level interview scenarios with tailored questions.",
              },
              {
                title: "AI-Powered Feedback",
                desc: "Receive detailed analysis on fluency, confidence, grammar, and more.",
              },
              {
                title: "Track Your Progress",
                desc: "Visualize improvements with historical metrics and insights.",
              },
              {
                title: "Expert-Level Coding Questions",
                desc: "Tackle coding rounds with our smart coding environment.",
              },
            ].map((f, idx) => (
              <motion.div
                key={idx}
                className="bg-white/60 dark:bg-gray-900/60 p-6 rounded-xl shadow-xl backdrop-blur-md border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition"
                whileHover={{ scale: 1.03 }}
              >
                <h4 className="text-xl font-semibold mb-2 text-indigo-600 dark:text-yellow-300">{f.title}</h4>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="px-6 py-20">
          <h3 className="text-3xl font-bold text-center mb-12">What Our Users Say</h3>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Princess Gangwani",
                quote: "This platform helped me boost my confidence and nail technical interviews.",
                role: "Second Year Student",
              },
              {
                name: "Shripad Ingole",
                quote: "The feedback system is brilliant. It's like having a personal coach!",
                role: "Second Year Student",
              },
            ].map((t, i) => (
              <motion.div
                key={i}
                className="bg-white/60 dark:bg-gray-800/60 p-6 rounded-lg shadow-md backdrop-blur-md border border-gray-300 dark:border-gray-700"
                whileHover={{ scale: 1.02 }}
              >
                <p className="text-lg italic text-gray-800 dark:text-gray-300 mb-3">"{t.quote}"</p>
                <p className="font-bold text-gray-900 dark:text-white">{t.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t.role}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="px-6 py-16 text-center backdrop-blur-sm bg-white/60 dark:bg-gray-800/60 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-3xl font-bold mb-4">Get in Touch</h3>
          <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg">
            Have questions? We're here to help. Contact us to know more about how we can support you.
          </p>
          <button
            onClick={() => navigate("/contact")}
            className="bg-indigo-600 text-white px-8 py-3 text-lg rounded hover:bg-indigo-700"
          >
            Contact Us
          </button>
        </section>

        {/* Footer */}
        <footer className="text-center py-6 text-gray-600 text-sm border-t dark:border-gray-700">
          &copy; {new Date().getFullYear()} Mock Interview Platform. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
