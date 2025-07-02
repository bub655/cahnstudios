import React, { useState, useRef, useEffect } from "react";
import SellCourseForm from "./SellCourseForm";

const Course = () => {
  const [openFAQ, setOpenFAQ] = useState(null);
  const faqRefs = useRef([]);

  /* Make the “Continue to Payment” button inside SellCourseForm dark‑blue gradient */
  useEffect(() => {
    // Slight delay to ensure SellCourseForm has rendered
    const id = setTimeout(() => {
      const btn = document.querySelector("button[type='submit']");
      if (btn) {
        btn.classList.add(
          "bg-gradient-to-r",
          "from-blue-700",
          "to-indigo-800",
          "text-white",
          "hover:from-blue-600",
          "hover:to-indigo-700",
          "border-0"
        );
      }
    }, 100);
    return () => clearTimeout(id);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const toggleFAQ = (idx) => setOpenFAQ(openFAQ === idx ? null : idx);

  const features = [
    {
      title: "Master AI Content Tools",
      copy: "Discover the exact writing, video, design & ad platforms we use daily to produce high‑performing content in minutes, not hours.",
    },
    {
      title: "Prompt Engineering Secrets",
      copy: "Steal proven prompt frameworks that unlock jaw‑dropping results — even if you’re new to generative AI.",
    },
    {
      title: "Scale & Monetize Fast",
      copy: "Plug‑and‑play workflows, case studies, and ethical guardrails so you can grow your audience and revenue confidently.",
    },
  ];

  const faqs = [
    {
      q: "What do I receive after purchase?",
      a: "You get lifetime access to HD recordings and future updates based on Cahn's latest AI workflows.",
    },
    {
      q: "Can I watch on mobile?",
      a: "Yes. Videos are hosted on Vimeo and accessible on any device.",
    },
    {
      q: "Is there a refund policy?",
      a: "No. Due to the digital nature of the content, we do not offer refunds.",
    },
  ];

  return (
    <>
      {/* Showcase – full screen */}
      <section
        id="home"
        className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800"
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-white">
            Course webpage under construction.{/* AI‑Powered{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Creativity &amp; Technology
            </span> */}
          </h1>
          {/* <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Get the <strong>full recordings</strong> of our sold‑out webinars and learn proven AI workflows to level‑up your content and business growth.
          </p> */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* <button
              onClick={() => scrollToSection('learn')}
              className="px-8 py-4 border-2 border-gray-400 text-gray-300 rounded-full font-semibold text-lg hover:border-white hover:text-white transition-all"
            >
              What You'll Learn
            </button>
            <button
              onClick={() => scrollToSection('buy')}
              className="px-8 py-4 border-2 border-blue-500 text-blue-400 rounded-full font-semibold text-lg hover:bg-blue-500 hover:text-white transition-all hover:-translate-y-1"
            >
              Buy Recordings
            </button> */}
          </div>
        </div>
      </section>

      {/* Learn – bigger fancy cards */}
      <section id="learn" className="bg-white min-h-screen flex items-center py-20">
        <div className="max-w-6xl mx-auto px-6 w-full">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-14 text-center">
            What You'll Learn
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {features.map((f, i) => (
              <div
                key={i}
                className="relative p-8 md:p-10 bg-gradient-to-br from-blue-50 to-white rounded-3xl shadow-xl border border-blue-100 hover:shadow-2xl transition-all"
              >
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                  {f.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {f.copy}
                </p>
                <span className="absolute -top-4 -right-4 w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full opacity-20"></span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Buy – price callout */}
      <section id="buy" className="bg-gray-100 py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Get Instant Access
          </h2>
          <p className="text-lg text-gray-600">
            One‑time payment • No subscription fees
          </p>
        </div>
        <SellCourseForm />
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-10 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((f, idx) => (
              <div key={idx} className="border rounded-lg">
                <button
                  className="w-full flex justify-between items-center p-5 text-left"
                  onClick={() => toggleFAQ(idx)}
                >
                  <span className="font-medium text-gray-800 text-lg">{f.q}</span>
                  <svg
                    className={`w-6 h-6 transform transition-transform ${openFAQ === idx ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div
                  ref={(el) => (faqRefs.current[idx] = el)}
                  style={{
                    maxHeight:
                      openFAQ === idx ? faqRefs.current[idx]?.scrollHeight + 'px' : '0px',
                  }}
                  className="overflow-hidden transition-all duration-300 px-5 text-gray-700"
                >
                  <p className="py-5 leading-relaxed">{f.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Course;
