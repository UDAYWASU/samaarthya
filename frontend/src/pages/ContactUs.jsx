// ContactUs.jsx

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from "@heroicons/react/24/solid";
import { Player } from "@lottiefiles/react-lottie-player";
import AOS from "aos";
import "aos/dist/aos.css";
import contactAnim from "./lottie-contact.json";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";
import useTheme from "../hooks/useTheme"; // path based on your folder


export default function ContactUs() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { theme, toggleTheme } = useTheme();


  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 2000)); // fake async
    setLoading(false);
    setSubmitted(true);
    reset();
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-tr from-[#e0f2fe] to-[#fefce8] dark:from-[#0f172a] dark:to-[#1e293b] py-20 px-6">
        {/* Theme Toggle Button */}
<div className="absolute top-6 right-6 z-50">
  <button
    onClick={toggleTheme}
    className="p-2 bg-white dark:bg-gray-800 shadow-md rounded-full hover:rotate-45 transform transition-all duration-300"
  >
    {theme === "light" ? (
      <MoonIcon className="h-5 w-5 text-gray-800" />
    ) : (
      <SunIcon className="h-5 w-5 text-yellow-300" />
    )}
  </button>
</div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        
        {/* Left: Animation + Info */}
        <div className="space-y-8" data-aos="fade-right">
          <Player autoplay loop src={contactAnim} style={{ height: "300px", width: "300px" }} />

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            Let's Connect 🤝
          </h2>

          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Have a question about interviews, prep, or mentorship? 
            We’d love to hear from you. Fill out the form or reach us directly!
          </p>

          <div className="space-y-3 text-gray-800 dark:text-white text-md">
            <div className="flex items-center space-x-3 hover:scale-105 transition-all">
              <EnvelopeIcon className="w-6 h-6 text-blue-500" />
              <span>support@mockinterviewhub.com</span>
            </div>
            <div className="flex items-center space-x-3 hover:scale-105 transition-all">
              <PhoneIcon className="w-6 h-6 text-green-500" />
              <span>+91 98765 43210</span>
            </div>
            <div className="flex items-center space-x-3 hover:scale-105 transition-all">
              <MapPinIcon className="w-6 h-6 text-red-500" />
              <span>P. R. Pote College of Engineering, Amravati</span>
            </div>
          </div>
        </div>

        {/* Right: Contact Form */}
        <div className="bg-white dark:bg-gray-900/80 backdrop-blur-lg rounded-3xl shadow-2xl p-10" data-aos="fade-left">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {submitted && (
              <div className="p-4 bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 rounded-md shadow">
                🎉 Thanks! We'll reply shortly.
              </div>
            )}

            {/* Name */}
            <div className="relative">
              <input
                {...register("name", { required: true })}
                placeholder="Full Name"
                className="peer w-full bg-transparent border-b-2 border-gray-300 focus:border-indigo-500 dark:text-white pt-6 pb-2 placeholder-transparent outline-none"
              />
              <label className="absolute left-0 top-2 text-gray-500 dark:text-gray-400 text-sm peer-placeholder-shown:top-6 peer-placeholder-shown:text-base transition-all">
                Full Name
              </label>
              {errors.name && <p className="text-red-500 text-sm mt-1">Name is required</p>}
            </div>

            {/* Email */}
            <div className="relative">
              <input
                {...register("email", { required: true })}
                placeholder="Email Address"
                className="peer w-full bg-transparent border-b-2 border-gray-300 focus:border-indigo-500 dark:text-white pt-6 pb-2 placeholder-transparent outline-none"
              />
              <label className="absolute left-0 top-2 text-gray-500 dark:text-gray-400 text-sm peer-placeholder-shown:top-6 peer-placeholder-shown:text-base transition-all">
                Email Address
              </label>
              {errors.email && <p className="text-red-500 text-sm mt-1">Email is required</p>}
            </div>

            {/* Message */}
            <div className="relative">
              <textarea
                {...register("message", { required: true })}
                placeholder="Your Message"
                rows={4}
                className="peer w-full bg-transparent border-b-2 border-gray-300 focus:border-indigo-500 dark:text-white pt-6 pb-2 placeholder-transparent outline-none"
              />
              <label className="absolute left-0 top-2 text-gray-500 dark:text-gray-400 text-sm peer-placeholder-shown:top-6 peer-placeholder-shown:text-base transition-all">
                Your Message
              </label>
              {errors.message && <p className="text-red-500 text-sm mt-1">Message is required</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-6 rounded-xl font-semibold text-white shadow-md transition-all duration-300 flex justify-center items-center ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white mr-3" viewBox="0 0 24 24" fill="none">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              ) : (
                "Send Message 📬"
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Map */}
      <div className="mt-20 rounded-2xl overflow-hidden shadow-xl" data-aos="fade-up">
        <iframe
          title="College Location"
          className="w-full h-64"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7450.4788207012425!2d77.75186839232781!3d20.98303817261913!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd6a2d15d81f4cd%3A0x703a9debc9500a6b!2sP.%20R.%20Pote%20Patil%20College%20of%20Engineering%20and%20Management!5e0!3m2!1sen!2sin!4v1750351548784!5m2!1sen!2sin"
          allowFullScreen
          loading="lazy"
        />
      </div>
    </section>
  );
}
