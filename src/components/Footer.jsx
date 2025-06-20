import React from "react";

export default function Footer() {
  return (
    <footer className="bg-[#122739] text-white py-10 px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
        <div>
          <h3 className="text-xl font-semibold">Cahn Studios</h3>
          <p className="text-gray-400 text-sm mt-1">
            Empowering creators with AI tools and insights.
          </p>
        </div>

        {/* <div className="flex gap-6 flex-wrap justify-center">
          <a href="#webinar-details" className="text-gray-300 hover:text-white transition">
            Webinar
          </a>
          <a href="#register-section" className="text-gray-300 hover:text-white transition">
            Register
          </a>
          <a href="/about" className="text-gray-300 hover:text-white transition">
            About
          </a>
          <a href="/contact" className="text-gray-300 hover:text-white transition">
            Contact
          </a>
        </div> */}

        <div className="text-sm text-gray-500 mt-4 md:mt-0">
          © {new Date().getFullYear()} Cahn Studios. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
