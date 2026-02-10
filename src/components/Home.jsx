import React, { useState, useEffect } from 'react';

const Home = () => {
  const [newsletter, setNewsletter] = useState(null);
  const [loadingNewsletter, setLoadingNewsletter] = useState(true);

  // Fetch latest newsletter on mount
  useEffect(() => {
    const fetchNewsletter = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
        const response = await fetch(`${backendUrl}/api/newsletter/latest`);
        if (response.ok) {
          const data = await response.json();
          if (data.hasNewsletter) {
            setNewsletter(data);
          }
        }
      } catch (error) {
        console.log('Newsletter fetch error:', error);
      } finally {
        setLoadingNewsletter(false);
      }
    };
    fetchNewsletter();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 1. Sticky Newsletter Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-white/10 py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold">Cahn Pulse</span>
            <span className="text-white/50">—</span>
            <span className="text-white/50 hidden sm:inline">Weekly AI × Creativity insights from the studio floor</span>
          </div>
          <a 
            href="https://cahns-newsletter.beehiiv.com/subscribe"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-[#e64726] text-white rounded-sm font-medium text-sm hover:bg-[#e64726]/90 transition-colors"
          >
            Join the Pulse
          </a>
        </div>
      </div>

      {/* Spacer for fixed header */}
      <div className="h-16"></div>

      {/* 2. Hero Section */}
      <section className="min-h-[90vh] flex flex-col justify-center px-6 py-20 max-w-7xl mx-auto">
        {/* Logo */}
        <div className="mb-8">
          <img src="/CAHN_Logo_Black_RGB.png" alt="Cahn Logo" className="h-20 filter invert brightness-0" />
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif leading-[1.1] mb-8">
          We Build AI-Powered<br />
          Stories,<br />
          <em className="italic">Systems, and Learning</em><br />
          for the Creative Age
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-white/60 max-w-2xl mb-10">
          Cahn Studios helps brands, creators, and teams use AI to create films, scale content, and learn modern workflows — without the noise.
        </p>

        {/* CTAs - Newsletter CTA in Hero */}
        <div className="flex flex-wrap gap-4">
          <a 
            href="https://cahns-newsletter.beehiiv.com/subscribe"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-[#e64726] text-white rounded-sm font-medium hover:bg-[#e64726]/90 transition-colors"
          >
            Join the Weekly Pulse
          </a>
          <a 
            href="#contact"
            className="px-6 py-3 text-white/70 font-medium hover:text-white transition-colors underline underline-offset-4"
          >
            Work with Us
          </a>
        </div>
      </section>

      {/* 3. Services Section */}
      <section id="services" className="py-24 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <span className="text-white/50 text-sm font-medium tracking-wider uppercase mb-6 block">
            SERVICES
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-4">
            What We Build at Cahn
          </h2>
          <p className="text-lg text-white/60 mb-16">
            AI is the medium. <span className="text-white">Outcomes are the point.</span>
          </p>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 border border-white/10 rounded-lg overflow-hidden">
            {/* AI Films & Visual Stories */}
            <div className="p-8 border-b md:border-b md:border-r border-white/10">
              <h3 className="text-xl font-semibold mb-4">AI Films & Visual Stories</h3>
              <p className="text-white/60 mb-4">
                We craft cinematic AI-powered films and visual narratives that communicate ideas clearly, emotionally, and at scale — without traditional production overhead.
              </p>
              <p className="text-white/40 italic text-sm mb-6">
                For brands, founders, and storytellers who need impact, not noise.
              </p>
              <a href="#work" className="text-[#e64726] font-medium inline-flex items-center gap-2 hover:gap-3 transition-all">
                Explore Films <span>→</span>
              </a>
            </div>

            {/* AI Content & Strategy Systems */}
            <div className="p-8 border-b border-white/10">
              <h3 className="text-xl font-semibold mb-4">AI Content & Strategy Systems</h3>
              <p className="text-white/60 mb-4">
                We design repeatable AI-driven content pipelines — from ideas to distribution — so your brand shows up consistently, intelligently, and without burning teams out.
              </p>
              <p className="text-white/40 italic text-sm mb-6">
                For teams that want clarity, consistency, and leverage.
              </p>
              <a href="#work" className="text-[#e64726] font-medium inline-flex items-center gap-2 hover:gap-3 transition-all">
                See How It Works <span>→</span>
              </a>
            </div>

            {/* AI Learning */}
            <div className="p-8 md:border-r border-white/10">
              <h3 className="text-xl font-semibold mb-4">AI Learning (By Doing, Not Watching)</h3>
              <p className="text-white/60 mb-4">
                A hands-on, game-based learning platform where new AI learners build real workflows, level up through practice, and gain confidence by shipping — not memorizing.
              </p>
              <p className="text-white/40 italic text-sm mb-6">
                For creators, professionals, and curious beginners.
              </p>
              <a href="#learning" className="text-[#e64726] font-medium inline-flex items-center gap-2 hover:gap-3 transition-all">
                Join the Beta <span>→</span>
              </a>
            </div>

            {/* Research, Pulse & Experiments */}
            <div className="p-8">
              <h3 className="text-xl font-semibold mb-4">Research, Pulse & Experiments</h3>
              <p className="text-white/60 mb-4">
                We continuously test tools, workflows, and ideas inside the studio — documenting what works, what breaks, and what's worth paying attention to.
              </p>
              <p className="text-white/40 italic text-sm mb-6">
                For builders who value signal over hype.
              </p>
              <a href="#pulse" className="text-[#e64726] font-medium inline-flex items-center gap-2 hover:gap-3 transition-all">
                Read the Pulse <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Newsletter / Pulse Section */}
      <section id="pulse" className="py-24 px-6 bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left Column */}
            <div>
              <span className="text-[#e64726] text-sm font-medium tracking-wider uppercase mb-6 block">
                CAHN PULSE
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-[1.1] mb-6">
                A weekly dispatch<br />
                from the<br />
                intersection<br />
                <em className="italic">of AI, creativity, and<br />
                real studio work.</em>
              </h2>

              {/* Trust indicators */}
              <div className="flex items-center gap-2 text-sm mb-8 flex-wrap">
                <span className="w-1 h-6 bg-[#e64726]"></span>
                <span>Trusted by</span>
                <span className="text-[#e64726]">500+ creators & founders</span>
                <span className="text-white/50">·</span>
                <span>36% average open rate</span>
              </div>

              <p className="text-white/60 text-lg mb-4 max-w-lg">
                Every week, we test tools, break workflows, and document what actually works — across AI films, content systems, and learning experiments.
              </p>

              <p className="text-white font-medium mb-8">
                No hype. No recycled threads. Just signal.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4 mb-6">
                <a 
                  href="https://cahns-newsletter.beehiiv.com/subscribe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-[#e64726] text-white rounded-sm font-medium hover:bg-[#e64726]/90 transition-colors inline-flex items-center gap-2"
                >
                  Join the Weekly Pulse
                  <span>→</span>
                </a>
                <a 
                  href="mailto:create@cahnstudios.com?subject=Contribute to The Pulse"
                  className="px-6 py-3 bg-white/10 text-white rounded-sm font-medium hover:bg-white/20 transition-colors"
                >
                  Get Featured
                </a>
              </div>

              <p className="text-white/40 text-sm">
                For builders, creators, and educators working with AI.
              </p>
            </div>

            {/* Right Column - Latest Issue Card (Dynamic) */}
            <div className="bg-zinc-900/50 border border-white/10 rounded-sm p-8">
              <span className="text-white/50 text-xs font-medium tracking-wider uppercase mb-4 block">
                LATEST ISSUE
              </span>
              
              {loadingNewsletter ? (
                <div className="animate-pulse">
                  <div className="h-8 bg-white/10 rounded w-3/4 mb-8"></div>
                  <div className="space-y-4">
                    <div className="h-4 bg-white/10 rounded w-full"></div>
                    <div className="h-4 bg-white/10 rounded w-5/6"></div>
                    <div className="h-4 bg-white/10 rounded w-4/6"></div>
                  </div>
                </div>
              ) : newsletter ? (
                <div className="flex flex-col h-full">
                  <h3 className="text-2xl md:text-3xl font-serif mb-4">
                    {newsletter.title}
                  </h3>

                  {/* Scrollable content area */}
                  {newsletter.contentPreview && newsletter.contentPreview.length > 0 && (
                    <div className="flex-1 overflow-y-auto max-h-80 pr-2 mb-6 scrollbar-thin">
                      <div className="space-y-4">
                        {newsletter.contentPreview.map((paragraph, index) => (
                          <p key={index} className="text-white/70 leading-relaxed">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                      {/* Fade out gradient at bottom */}
                      <div className="sticky bottom-0 h-8 bg-gradient-to-t from-zinc-900/90 to-transparent pointer-events-none"></div>
                    </div>
                  )}

                  <a 
                    href={newsletter.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#e64726] text-white rounded-sm font-medium hover:bg-[#e64726]/90 transition-colors w-full sm:w-auto"
                  >
                    Read full newsletter here <span>→</span>
                  </a>
                </div>
              ) : (
                <>
                  <h3 className="text-2xl md:text-3xl font-serif mb-8">
                    The Tools That Actually Ship
                  </h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <span className="text-[#e64726] mt-1">→</span>
                      <span className="text-white/70">Why most AI tools fail creative teams</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#e64726] mt-1">→</span>
                      <span className="text-white/70">Our Sora workflow, documented</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#e64726] mt-1">→</span>
                      <span className="text-white/70">3 prompts that changed our output</span>
                    </li>
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Selected Work / Experiments Section */}
      <section id="work" className="py-24 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <span className="text-white/50 text-sm font-medium tracking-wider uppercase mb-6 block">
            SELECTED WORK
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-16">
            Experiments & <em className="italic text-[#e64726]">Outcomes</em>
          </h2>

          {/* Featured Image */}
          <div className="aspect-[16/9] bg-gradient-to-br from-teal-900/50 to-teal-800/30 rounded-sm mb-8 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-900 to-cyan-900 opacity-50"></div>
          </div>

          {/* Work Items */}
          <div className="space-y-0">
            {/* Item 1 */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 py-8 border-t border-white/10 items-start md:items-center">
              <div className="md:col-span-2">
                <span className="text-white/50 text-xs font-medium tracking-wider uppercase">AI FILM</span>
              </div>
              <div className="md:col-span-4">
                <h3 className="text-2xl md:text-3xl font-serif text-[#e64726]">Echoes of Tomorrow</h3>
              </div>
              <div className="md:col-span-6">
                <p className="text-white/60">A short film exploring memory and AI consciousness. Created entirely with generative tools.</p>
              </div>
            </div>

            {/* Item 2 */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 py-8 border-t border-white/10 items-start md:items-center">
              <div className="md:col-span-2">
                <span className="text-white/50 text-xs font-medium tracking-wider uppercase">CONTENT STRATEGY</span>
              </div>
              <div className="md:col-span-4">
                <h3 className="text-2xl md:text-3xl font-serif">Brand Voice Engine</h3>
              </div>
              <div className="md:col-span-6">
                <p className="text-white/60">Scalable content system for a D2C brand. 10x output without losing authenticity.</p>
              </div>
            </div>

            {/* Item 3 */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 py-8 border-t border-b border-white/10 items-start md:items-center">
              <div className="md:col-span-2">
                <span className="text-white/50 text-xs font-medium tracking-wider uppercase">RESEARCH</span>
              </div>
              <div className="md:col-span-4">
                <h3 className="text-2xl md:text-3xl font-serif text-[#e64726]">The Learning Loop</h3>
              </div>
              <div className="md:col-span-6">
                <p className="text-white/60">How creative teams actually adopt AI. 50 interviews, one framework.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Education / Game Teaser Section */}
      <section id="learning" className="py-24 px-6 bg-zinc-950">
        <div className="max-w-4xl mx-auto text-center">
          {/* Icon */}
          <div className="w-16 h-16 bg-[#31af9c] rounded-2xl flex items-center justify-center mx-auto mb-8">
            <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
            </svg>
          </div>

          <span className="text-[#31af9c] text-sm font-medium tracking-wider uppercase mb-4 block">
            COMING SOON
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-6">
            Learn AI the <em className="italic">playful</em> way
          </h2>
          <p className="text-white/60 text-lg mb-10 max-w-2xl mx-auto">
            A gamified learning platform that makes AI accessible. Short challenges. Real outcomes. Built for creative minds who want to ship, not study.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <a 
              href="/course"
              className="px-8 py-4 bg-[#31af9c] text-white rounded-sm font-medium hover:bg-[#31af9c]/90 transition-colors"
            >
              Join the Beta
            </a>
            <a 
              href="#"
              className="px-8 py-4 bg-white/10 text-white rounded-sm font-medium hover:bg-white/20 transition-colors"
            >
              Explore Learning
            </a>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-12 md:gap-16 pt-8 border-t border-white/10">
            <div className="text-center">
              <div className="text-3xl font-serif mb-1">12</div>
              <div className="text-white/50 text-sm">learning tracks</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-serif mb-1">50+</div>
              <div className="text-white/50 text-sm">challenges</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-serif mb-1">Beta</div>
              <div className="text-white/50 text-sm">Q1 2025</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
