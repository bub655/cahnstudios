import React from "react";
import {FaXTwitter, FaEnvelope} from 'react-icons/fa6';
import { FaInstagram} from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export default function Footer() {
  return (
    <footer className="bg-[#122739] text-white py-10 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Main footer content */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Left side - Company info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <img src="/CAHN_Logo.png" alt="Cahn Studios Logo" className="h-7 w-auto inline-block" />
              <h3 className="text-xl font-semibold inline-block">Cahn Studios</h3>
            </div>
            <p className="text-gray-400 text-sm">
              Empowering creators with AI tools and insights.
            </p>
            {/* Social media icons */}
            <div className="flex space-x-4 mt-4 text-gray-400">
              {/* Instagram */}
              <a href="https://www.instagram.com/cahn_studios/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-white transition-colors duration-200">
                <FaInstagram size={24} />
              </a>

              {/* X (Twitter) */}
              <a href="https://x.com/CahnStudios" target="_blank" rel="noopener noreferrer" aria-label="X" className="hover:text-white transition-colors duration-200">
              <FaXTwitter size={24} />
              </a>

              {/* Email */}
              <a href="mailto:create@cahnstudios.com" aria-label="Email" className="hover:text-white transition-colors duration-200">
              <FaEnvelope size={24} />
              </a>
            </div>
          </div>

          {/* Center - Navigation links */}
          <div className="flex items-center gap-6 md:gap-8">
            {/* About */}
            <a href="/#about" className="text-2xl md:text-xl lg:text-xl font-medium leading-tight text-gray-300 hover:text-blue-400 flex items-center group transition-colors duration-300">
              <div className="flex items-center gap-0 group-hover:gap-2 md:group-hover:gap-[8px] xl:group-hover:gap-[10px] transition-all duration-300">
                <svg aria-hidden="true" className="w-0 group-hover:w-4 md:group-hover:w-4 xl:group-hover:w-3 transition-all duration-300 text-blue-400" viewBox="0 0 26 26" fill="none">
                  <path d="M2.1 25.7L0 23.6L20.6 3H1.7V0H25.7V24H22.7V5.1L2.1 25.7Z" fill="currentColor"/>
                </svg>
                <span>About</span>
              </div>
            </a>

            {/* Divider */}
            <div className="h-5 border-l border-gray-600"></div>

            {/* Community */}
            <a href="https://www.linkedin.com/company/cahn-studios/" target="_blank" className="text-2xl md:text-xl lg:text-xl font-medium leading-tight text-gray-300 hover:text-blue-400 flex items-center group transition-colors duration-300">
              <div className="flex items-center gap-0 group-hover:gap-2 md:group-hover:gap-[8px] xl:group-hover:gap-[10px] transition-all duration-300">
                <svg aria-hidden="true" className="w-0 group-hover:w-4 md:group-hover:w-4 xl:group-hover:w-3 transition-all duration-300 text-blue-400" viewBox="0 0 26 26" fill="none">
                  <path d="M2.1 25.7L0 23.6L20.6 3H1.7V0H25.7V24H22.7V5.1L2.1 25.7Z" fill="currentColor"/>
                </svg>
                <span>Community</span>
              </div>
            </a>

            {/* Divider */}
            <div className="h-5 border-l border-gray-600"></div>

            {/* Newsletter */}
            <a href="https://cahns-newsletter.beehiiv.com/subscribe" target="_blank" className="text-2xl md:text-xl lg:text-xl font-medium leading-tight text-gray-300 hover:text-blue-400 flex items-center group transition-colors duration-300">
              <div className="flex items-center gap-0 group-hover:gap-2 md:group-hover:gap-[8px] xl:group-hover:gap-[10px] transition-all duration-300">
                <svg aria-hidden="true" className="w-0 group-hover:w-4 md:group-hover:w-4 xl:group-hover:w-3 transition-all duration-300 text-blue-400" viewBox="0 0 26 26" fill="none">
                  <path d="M2.1 25.7L0 23.6L20.6 3H1.7V0H25.7V24H22.7V5.1L2.1 25.7Z" fill="currentColor"/>
                </svg>
                <span>Newsletter</span>
              </div>
            </a>
          </div>

          {/* Right side - Prompt Us button */}
          <div className="flex-shrink-0 flex flex-col justify-start">
            <a href="/contact" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors duration-200 font-medium text-large">Prompt Us</a>
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

