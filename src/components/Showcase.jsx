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

  return (
    <section className="relative w-full h-screen overflow-hidden flex">

      <div className="relative w-1/2 h-full overflow-hidden">
        <video
          ref={videoRef}
          className="absolute top-0 left-0 w-full h-full object-cover"
          src="./public/showcase.mp4"
          autoPlay
          loop
        />
        <div className="absolute top-0 left-0 w-full h-full bg-black/30"></div>
      </div>

      <div className="relative w-1/2 h-full flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="flex flex-col items-center justify-center px-8 lg:px-12 text-center max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            AI for{" "}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Creators
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-6 leading-relaxed">
            Unlock the power of AI in content creation and advertising
          </p>
          <p className="text-base text-gray-300 mb-8 leading-relaxed">
            Join us for an immersive, hands-on webinar designed to help creators,
            marketers, and entrepreneurs elevate their content and ad strategies
            using cutting-edge AI tools. Whether you're a beginner or looking to
            scale your efforts, this session will walk you through practical
            workflows that save time, increase impact, and ignite creativity.
          </p>
          <div className="flex flex-col gap-4 justify-center items-center w-full">
            <button
              onClick={scrollToRegister}
              className="w-full max-w-xs px-8 py-4 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent font-semibold text-lg">
                Register Now
              </span>
            </button>
            <button className="w-full max-w-xs px-8 py-4 bg-transparent border-2 border-white rounded-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent font-semibold text-lg">
                Learn More
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}