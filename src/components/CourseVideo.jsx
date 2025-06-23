import React from 'react';

const CourseVideo = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Section: Trust */}
      <section className="bg-gray-950 text-center py-3">
        <p className="text-sm md:text-base text-gray-300 max-w-6xl mx-auto px-4">
          Trusted by Gemini, Adobe, Upgrad, Blackbox, Dora, Lindy & many more.
        </p>
      </section></div>
      );
}