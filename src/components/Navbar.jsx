import React, { useState, useEffect, useRef } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <nav ref={menuRef} className="w-full h-16 flex justify-between items-center px-4 sm:px-6 bg-black shadow-lg fixed top-0 left-0 z-50 border-b border-gray-100">
      <div className="text-2xl font-bold text-gray-800">
        <a href="/">
          <img src="/CAHN_Logo_Black_RGB.png" alt="Cahn Logo" className="h-8 filter invert brightness-0" />
        </a>
      </div>

      {/* Desktop Menu */}
      <ul className="hidden md:flex space-x-6 lg:space-x-8 text-gray-700 font-medium list-none">
        <li>
          <a href="/webinar" className="text-white transition-colors duration-200 py-2 px-1 border-b-2 border-transparent hover:border-white">
            Webinars
          </a>
        </li>
        <li>
          <a href="/#services" className="text-white transition-colors duration-200 py-2 px-1 border-b-2 border-transparent hover:border-white">
            Services
          </a>
        </li>
        <li>
          <a href="/#about" className="text-white transition-colors duration-200 py-2 px-1 border-b-2 border-transparent hover:border-white">
            About
          </a>
        </li>
        <li>
          <a href="/course" className="text-white transition-colors duration-200 py-2 px-1 border-b-2 border-transparent hover:border-white">
            Course
          </a>
        </li>
        <li>
          <a href="/contact" className="px-3 py-2 bg-gray-800/50 text-white rounded-lg hover:border-2 hover:border-white transition-all duration-75">
            Prompt Us
          </a>
        </li>
      </ul>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-white focus:outline-none p-2 -mr-2 touch-manipulation"
        onClick={toggleMenu}
        aria-label="Toggle menu"
        aria-expanded={isMenuOpen}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-black border-t border-gray-700 md:hidden z-50 shadow-lg">
          <ul className="flex flex-col space-y-1 p-4 text-gray-700 font-medium list-none">
            <li>
              <a 
                href="/webinar" 
                className="block text-white py-3 px-4 rounded-lg hover:bg-gray-800 active:bg-gray-700 transition-colors duration-200 touch-manipulation"
                onClick={closeMenu}
              >
                Webinars
              </a>
            </li>
            <li>
              <a 
                href="/#services" 
                className="block text-white py-3 px-4 rounded-lg hover:bg-gray-800 active:bg-gray-700 transition-colors duration-200 touch-manipulation"
                onClick={closeMenu}
              >
                Services
              </a>
            </li>
            <li>
              <a 
                href="/#about" 
                className="block text-white py-3 px-4 rounded-lg hover:bg-gray-800 active:bg-gray-700 transition-colors duration-200 touch-manipulation"
                onClick={closeMenu}
              >
                About
              </a>
            </li>
            <li>
              <a 
                href="/contact" 
                className="block text-white py-3 px-4 bg-gray-800/50 rounded-lg hover:bg-gray-700 active:bg-gray-600 transition-colors duration-200 touch-manipulation"
                onClick={closeMenu}
              >
                Prompt Us
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}