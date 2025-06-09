import React, { useRef, useEffect } from "react";

export default function Showcase() {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleEnded = () => {
        video.muted = true;
      };

      video.addEventListener('ended', handleEnded);
      
      return () => {
        video.removeEventListener('ended', handleEnded);
      };
    }
  }, []);

const scrollToRegister = () => {
  const el = document.getElementById("register-section");
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
};

const scrollToDetails = () => {
  const el = document.getElementById("webinar-details");
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
};

  return (
    <section className="relative w-full min-h-screen overflow-hidden flex flex-col md:flex-row">

      {/* Video Section */}
      <div className="relative w-full md:w-1/2 h-screen overflow-hidden">
        <video
          ref={videoRef}
          className="absolute top-0 left-0 w-full h-full object-cover"
          src="/showcase.mp4"
          autoPlay
          loop
        />
        <div className="absolute top-0 left-0 w-full h-full bg-black/30"></div>
      </div>

      {/* Content Section */}
      <div className="relative w-full md:w-1/2 min-h-screen md:h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="flex flex-col items-center justify-center px-4 sm:px-6 lg:px-12 py-8 md:py-0 text-center max-w-2xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            AI for{" "}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Creators
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-4 sm:mb-6 leading-relaxed">
            Unlock the power of AI in content creation and advertising
          </p>
          <p className="text-sm sm:text-base text-gray-300 mb-6 sm:mb-8 leading-relaxed">
            Join us for an immersive, hands-on webinar designed to help creators,
            marketers, and entrepreneurs elevate their content and ad strategies
            using cutting-edge AI tools. Whether you're a beginner or looking to
            scale your efforts, this session will walk you through practical
            workflows that save time, increase impact, and ignite creativity.
          </p>

          {/* Pricing Section */}
          <div className="mb-6 sm:mb-8 text-center">
            <div className="flex items-center justify-center gap-2 sm:gap-4 mb-4">
              <div className="text-center">
                <span className="text-xl sm:text-2xl text-gray-400 line-through">$200 / ₹16,999</span>
              </div>
              <div className="text-3xl sm:text-4xl text-gray-300">→</div>
              <div className="text-center">
                <span className="text-2xl sm:text-4xl font-bold text-white">$58 / ₹4,999</span>
              </div>
              <div className="bg-red-500 text-white px-2 py-1 sm:px-3 rounded-full text-xs sm:text-sm font-medium">
                71% OFF
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 mt-2">
              Pay in USD (International) or INR (India)
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:gap-4 justify-center items-center w-full">
            <button
              onClick={scrollToRegister}
              className="w-full max-w-xs px-6 sm:px-8 py-3 sm:py-4 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent font-semibold text-base sm:text-lg">
                Register Now
                </span>
            </button>

            <button
              onClick={scrollToDetails}
              className="w-full max-w-xs px-6 sm:px-8 py-3 sm:py-4 bg-transparent border-2 border-white rounded-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent font-semibold text-base sm:text-lg">
                Learn More
                </span>
            </button>

          </div>
      </div>
    </div>
  </section>
);
}