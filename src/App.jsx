import React from "react";

function Navbar() {
  return (
    <nav className="w-full h-16 flex justify-between items-center px-6 bg-white shadow-lg fixed top-0 left-0 z-50 border-b border-gray-100">
      <div className="text-2xl font-bold text-gray-800">
        <a href="/">
        <img src="/public/CAHN_Logo_Black_RGB.png" alt="Cahn Logo" className="h-8" />
        </a>
      </div>
      <ul className="flex space-x-8 text-gray-700 font-medium list-none">
        <li>
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
        </li>
      </ul>
    </nav>
  );
}

function Showcase() {
  return (
    <section className="relative w-full min-h-screen pt-16 overflow-hidden">
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        src="./public/showcase.mp4"
        autoPlay
        loop
        muted
      />
    
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-300 rounded-full filter blur-3xl"></div>
      </div>
      
      <div className="text-center px-6 relative z-10 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-800 mb-6 leading-tight">
          AI for <span className="text-blue-600">Creatives</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          Master AI tools, train custom models, and monetize your creativity in the digital age
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-full shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            Register Now
          </button>
          <button className="px-8 py-4 bg-transparent border-2 border-blue-600 text-blue-600 text-lg font-semibold rounded-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            Learn More
          </button>
        </div>
        
        {/* Stats or features section */}
      
      </div>
    </section>
  );
}

export default function App() {
  return (
    <div className="min-h-screen w-full font-sans">
      <Navbar />
      <Showcase />
    </div>
  );
}