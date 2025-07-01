import React from "react";
import { useNavigate } from "react-router-dom";
import { UsersIcon, ClipboardDocumentListIcon, QuestionMarkCircleIcon, ChartBarIcon } from "@heroicons/react/24/outline";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Users",
      icon: <UsersIcon className="h-8 w-8 text-indigo-600" />, 
      description: "Manage registered users, approvals, roles, and details.",
      link: "/admin/users",
    },
    {
      title: "Questions",
      icon: <QuestionMarkCircleIcon className="h-8 w-8 text-indigo-600" />, 
      description: "Add, edit, or remove questions by domain and level.",
      link: "/admin/questions",
    },
    {
      title: "Interviews",
      icon: <ClipboardDocumentListIcon className="h-8 w-8 text-indigo-600" />, 
      description: "View all interviews and analyze responses.",
      link: "/admin/interviews",
    },
    {
      title: "Analytics",
      icon: <ChartBarIcon className="h-8 w-8 text-indigo-600" />, 
      description: "Monitor usage statistics and performance trends.",
      link: "/admin/analytics",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {cards.map((card, index) => (
          <div
            key={index}
            onClick={() => navigate(card.link)}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition cursor-pointer p-6 border dark:border-gray-700 hover:-translate-y-1 hover:scale-105 duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">{card.title}</h3>
              {card.icon}
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{card.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}