import React from "react";

export default function Footer() {
  return (
    <footer className="bg-[#122739] text-white py-10 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Main footer content */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          {/* Left side - Company info */}
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-2">Cahn Studios</h3>
            <p className="text-gray-400 text-sm">
              Empowering creators with AI tools and insights.
            </p>
          </div>

          {/* Center - Navigation links */}
          <div className="flex gap-8 flex-wrap justify-center md:justify-start">
            <a 
              href="/#about" 
              className="group text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center gap-1"
            >
              About
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 transform group-hover:translate-x-1 group-hover:-translate-y-1">
                ↗
              </span>
            </a>
            <a 
              href="https://www.linkedin.com/company/cahn-studios/" 
              className="group text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center gap-1"
            >
              Community
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 transform group-hover:translate-x-1 group-hover:-translate-y-1">
                ↗
              </span>
            </a>
            <a 
              href="https://cahns-newsletter.beehiiv.com/subscribe" 
              className="group text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center gap-1"
            >
              Newsletter
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 transform group-hover:translate-x-1 group-hover:-translate-y-1">
                ↗
              </span>
            </a>
          </div>

          {/* Right side - Prompt Us button */}
          <div className="flex-shrink-0">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 font-medium">
              Prompt Us
            </button>
          </div>
        </div>

        {/* Bottom section - All rights reserved */}
        <div className="border-t border-gray-600 mt-8 pt-6">
          <div className="text-sm text-gray-500 text-center">
            © {new Date().getFullYear()} Cahn Studios. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}