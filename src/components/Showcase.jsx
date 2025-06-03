import React from "react";

export default function Showcase() {
  const scrollToRegister = () => {
    const el = document.getElementById("register-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full h-screen overflow-hidden flex items-center justify-center">
      {/* Video Background */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        src="./public/showcase.mp4"
        autoPlay
        loop
      />

      {/* Semi-transparent overlay to improve text contrast */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/40"></div>

      <div className="relative z-10 flex flex-col items-center justify-center px-6 text-center max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
          AI for{" "}
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Creators
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
          Unlock the power of AI in content creation and advertising
        </p>
        <p className="text-lg text-gray-300 mb-12 max-w-4xl mx-auto">
          Join us for an immersive, hands-on webinar designed to help creators,
          marketers, and entrepreneurs elevate their content and ad strategies
          using cutting-edge AI tools. Whether you’re a beginner or looking to
          scale your efforts, this session will walk you through practical
          workflows that save time, increase impact, and ignite creativity.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={scrollToRegister}
            className="px-8 py-4 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent font-semibold text-lg">
              Register Now
            </span>
          </button>
          <button className="px-8 py-4 bg-transparent border-2 border-white rounded-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent font-semibold text-lg">
              Learn More
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
