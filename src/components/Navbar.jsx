import React from "react";


export default function Navbar() {
  return (
    <nav className="w-full h-16 flex justify-between items-center px-6 bg-white shadow-lg fixed top-0 left-0 z-50 border-b border-gray-100">
      <div className="text-2xl font-bold text-gray-800">
        <a href="/">
        <img src="/CAHN_Logo_Black_RGB.png" alt="Cahn Logo" className="h-8" />
        </a>
      </div>
      <ul className="flex space-x-8 text-gray-700 font-medium list-none">
        {/* <li>
          <a href="/" className="hover:text-black-600 transition-colors duration-200 py-2 px-1 border-b-2 border-transparent hover:border-blue-600">
            Home
          </a>
        </li>
        <li>
          <a href="/about" className="hover:text-black-600 transition-colors duration-200 py-2 px-1 border-b-2 border-transparent hover:border-blue-600">
            About
          </a>
        </li>
        <li>
          <a href="/services" className="hover:text-black-600 transition-colors duration-200 py-2 px-1 border-b-2 border-transparent hover:border-blue-600">
            Services
          </a>
        </li>
        <li>
          <a href="/webinars" className="hover:text-black-600 transition-colors duration-200 py-2 px-1 border-b-2 border-transparent hover:border-blue-600">
            Webinars
          </a>
        </li> */}
        <li>
          <a href="/contact" className="hover:text-black-600 transition-colors duration-200 py-2 px-1 border-b-2 border-transparent hover:border-blue-600">
            Contact Us
          </a>
        </li>
      </ul>
    </nav>
  );
}