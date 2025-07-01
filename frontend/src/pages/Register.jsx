import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  LockClosedIcon
} from "@heroicons/react/24/outline";

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    education: "",
    gender: "",
    password: "",
    confirm_password: "",
    user_type: "student",
    branch: "",
    stream: "",
    linkedin_url: "",
    resume_url: ""
  });
  const [errors, setErrors] = useState({});

  const [showPassword, setShowPassword] = useState(false);

  const validateStep1 = () => {
    const errs = {};
    if (!formData.name) errs.name = "Name required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = "Invalid email";
    if (!/^[0-9]{10}$/.test(formData.phone_number)) errs.phone_number = "Must be 10 digits";
    return errs;
  };

  const validateStep2 = () => {
  const errs = {};
  if (formData.password.length < 6) errs.password = "Minimum 6 characters";
  if (formData.password !== formData.confirm_password) {
    errs.confirm_password = "Passwords do not match";
  }
  if (!formData.education) errs.education = "Education required";
  if (!formData.gender) errs.gender = "Gender required";

  return errs;
};


  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone_number" && value && !/^\d+$/.test(value)) return;
    setFormData({ ...formData, [name]: value });
    setErrors((e) => ({ ...e, [name]: "" }));
  };

  const handleNext = () => {
    const errs = validateStep1();
    if (Object.keys(errs).length) return setErrors(errs);
    setStep(2);
  };

  const handleBack = () => setStep(1);

  const handleRegister = async (e) => {
    e.preventDefault();
    const errs = validateStep2();
    if (Object.keys(errs).length) return setErrors(errs);

    try {
      const res = await fetch("http://localhost:4000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) return alert(data.error || "Registration failed");
      localStorage.setItem("user", JSON.stringify(data));
      navigate("/dashboard");
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen  bg-cover bg-center flex items-center justify-center px-4" 
    style={{ backgroundImage: "url('/images/regback.png')" }}>
      <form
        onSubmit={handleRegister}
        className="backdrop-blur-lg bg-white/30 dark:bg-gray-800/30 border border-white/20 dark:border-gray-700 rounded-xl shadow-2xl w-full max-w-md p-8 space-y-6 transition"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100">
          Create Your Account
        </h2>

        <div className="flex justify-center items-center space-x-4">
          <StepIndicator current={step} />
        </div>

        <div className={step === 1 ? "block space-y-4" : "hidden"}>
          <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} icon={<UserIcon />} error={errors.name} />
          <Input label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} icon={<EnvelopeIcon />} error={errors.email} />
          <Input label="Phone Number" name="phone_number" value={formData.phone_number} onChange={handleChange} icon={<PhoneIcon />} error={errors.phone_number} />
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {formData.phone_number && formData.phone_number.length === 10 && "We'll occasionally text you updates!"}
          </div>
        </div>

        <div className={step === 2 ? "block space-y-4" : "hidden"}>
          <Select
            label="Education"
            name="education"
            value={formData.education}
            onChange={handleChange}
            options={["High School", "Diploma", "Bachelor's", "Master's", "PhD", "Other"]}
          />
          <Select
            label="Gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            options={["Male", "Female", "Other"]}
          />
          <Select
            label="User Type"
            name="user_type"
            value={formData.user_type}
            onChange={handleChange}
            options={["student", "professional", "expert", "teacher"]}
          />
          <Select
            label="Branch"
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            options={[
              "Arificial Intellegence & Data Science",
              "Computer Science",
              "Arificial Intellegence & Machine Learning",
              "Information Technology",
              "Electronics and Communication",
              "Electrical",
              "Mechanical",
              "Civil",
              "Chemical",
              "Biomedical",
              "Aerospace",
              "Automobile",
              "Environmental",
              "Industrial",
              "Metallurgy",
              "Instrumentation",
              "Other"
            ]}
          />

          <Input
            label="Stream (e.g., AI, SWE)"
            name="stream"
            value={formData.stream}
            onChange={handleChange}
          />
          <Input
            label="LinkedIn URL"
            name="linkedin_url"
            type="url"
            value={formData.linkedin_url}
            onChange={handleChange}
          />
          <Input
            label="Resume URL"
            name="resume_url"
            type="url"
            value={formData.resume_url}
            onChange={handleChange}
          />

          <Input
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            icon={<LockClosedIcon />}
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
          />

          <Input
            label="Confirm Password"
            name="confirm_password"
            type={showPassword ? "text" : "password"}
            icon={<LockClosedIcon />}
            value={formData.confirm_password}
            onChange={handleChange}
            error={errors.confirm_password}
          />

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="showPassword"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="showPassword" className="text-sm text-gray-700 dark:text-gray-200">
              Show Password
            </label>
          </div>
        </div>


        <div className="flex justify-between">
          {step > 1 && (
            <button type="button" onClick={handleBack} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">
              Back
            </button>
          )}
          {step === 1 ? (
            <button type="button" onClick={handleNext} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
              Next
            </button>
          ) : (
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
              Register
            </button>
          )}
        </div>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <span className="text-indigo-600 hover:underline cursor-pointer" onClick={() => navigate("/Login")}>
            Sign In
          </span>
        </p>
      </form>
    </div>
  );
}

// Input Component
function Input({ label, name, type = "text", value, onChange, icon, error }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">{label}</label>
      <div className="relative">
        {icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center">{React.cloneElement(icon, { className: "h-5 w-5 text-gray-400 dark:text-gray-500" })}</div>}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white/90 dark:bg-gray-700/90 text-gray-800 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${icon ? "pl-10" : ""}`}
        />
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

// Select Component
function Select({ label, name, value, onChange, options }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white/90 dark:bg-gray-700/90 text-gray-800 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="">Select {label}</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

// Step Indicator Component
function StepIndicator({ current }) {
  return (
    <div className="flex items-center space-x-4">
      {[1, 2].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`h-3 w-3 rounded-full ${current >= step ? "bg-indigo-600" : "bg-gray-300 dark:bg-gray-600"}`}></div>
          {step < 2 && <div className="w-8 h-px bg-gray-300 dark:bg-gray-600 mx-2"></div>}
        </div>
      ))}
    </div>
  );
}
