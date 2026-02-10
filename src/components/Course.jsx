import React, { useState, useRef } from "react";
import SellCourseForm from "./SellCourseForm";

const Course = () => {
  const [openFAQ, setOpenFAQ] = useState(null);
  const faqRefs = useRef([]);

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
      copy: "Steal proven prompt frameworks that unlock jaw‑dropping results — even if you're new to generative AI.",
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
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section
        id="home"
        className="relative min-h-screen flex items-center justify-center bg-black"
      >
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6 py-20">
          {/* Icon */}
          <div className="w-16 h-16 bg-[#31af9c] rounded-2xl flex items-center justify-center mx-auto mb-8">
            <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
            </svg>
          </div>

          <span className="text-[#31af9c] text-sm font-medium tracking-wider uppercase mb-4 block">
            AI CONTENT COURSE
          </span>

          <h1 className="text-5xl md:text-7xl font-serif mb-6 leading-tight">
            AI‑Powered{' '}
            <em className="italic">Content Creation</em>{' '}
            Course
          </h1>

          <p className="text-xl md:text-2xl text-white/60 mb-10 max-w-2xl mx-auto">
            Get the <span className="text-white">full recordings</span> of our sold‑out webinars and learn proven AI workflows to level‑up your content and business growth.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => scrollToSection('learn')}
              className="px-8 py-4 bg-white/10 text-white rounded-sm font-medium hover:bg-white/20 transition-colors"
            >
              What You'll Learn
            </button>
            <button
              onClick={() => scrollToSection('buy')}
              className="px-8 py-4 bg-[#e64726] text-white rounded-sm font-medium hover:bg-[#e64726]/90 transition-colors"
            >
              Buy Recordings
            </button>
          </div>
        </div>
      </section>

      {/* What You'll Learn Section */}
      <section id="learn" className="bg-zinc-950 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <span className="text-white/50 text-sm font-medium tracking-wider uppercase mb-6 block">
            CURRICULUM
          </span>
          <h2 className="text-4xl md:text-5xl font-serif mb-16">
            What You'll Learn
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            {features.map((f, i) => (
              <div
                key={i}
                className="p-8 bg-white/5 border border-white/10 rounded-sm hover:border-white/20 transition-all"
              >
                <h3 className="text-xl font-semibold mb-4">
                  {f.title}
                </h3>
                <p className="text-white/60 leading-relaxed">
                  {f.copy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Buy Section */}
      <section id="buy" className="bg-black py-24 px-6 border-t border-white/10">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="text-[#e64726] text-sm font-medium tracking-wider uppercase mb-6 block">
            GET STARTED
          </span>
          <h2 className="text-4xl md:text-5xl font-serif mb-4">
            Get Instant Access
          </h2>
          <p className="text-lg text-white/60">
            One‑time payment • No subscription fees
          </p>
        </div>
        <div className="max-w-xl mx-auto">
          <SellCourseForm />
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="bg-zinc-950 py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <span className="text-white/50 text-sm font-medium tracking-wider uppercase mb-6 block">
            FAQ
          </span>
          <h2 className="text-4xl md:text-5xl font-serif mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {faqs.map((f, idx) => (
              <div 
                key={idx} 
                className="border border-white/10 rounded-sm overflow-hidden"
              >
                <button
                  className="w-full flex justify-between items-center p-6 text-left hover:bg-white/5 transition-colors"
                  onClick={() => toggleFAQ(idx)}
                >
                  <span className="font-medium text-lg">{f.q}</span>
                  <svg
                    className={`w-5 h-5 text-white/50 transform transition-transform ${openFAQ === idx ? 'rotate-180' : ''}`}
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
                  className="overflow-hidden transition-all duration-300"
                >
                  <p className="px-6 pb-6 text-white/60 leading-relaxed">{f.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Course;
