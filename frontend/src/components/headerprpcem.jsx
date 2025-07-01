import React from "react";

export default function CustomHeader() {
  return (
    <div className="bg-white dark:bg-gray-900 py-2 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between flex-wrap">
          {/* Left logo */}
          <div className="w-1/3 flex items-center">
            <a href="/">
              <img
                src="/images/prplogo.png"
                alt="PRP Logo"
                className="w-28 object-contain"
              />
            </a>
          </div>

          {/* Center banner */}
          <div className="w-1/3 flex justify-center">
            <img
              src="/images/prpheader.png"
              alt="Header Banner"
              className="h-20 object-contain"
            />
          </div>

          {/* Right logo */}
          <div className="w-1/3 flex justify-end items-center">
            <img
              src="/images/naac_logo.png"
              alt="NAAC Logo"
              className="w-40 object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
