import React from 'react';

const Home = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Section: Trust */}
      <section id="services" className="py-2 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xl text-gray-300 max-w-4xl mx-auto">
              Trusted by Gemini, Adobe, Upgrad, Blackbox, Dora, Lindy & many more.
            </p>
          </div>
        </div>
      </section>

      {/* Section 1: Landing Page */}
      <section id="home" className="relative h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            AI-Powered&nbsp;
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Creativity &&nbsp;
            </span>
            Technology
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Empowering creators and businesses with cutting-edge AI solutions for content creation, automation, and growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => scrollToSection('services')}
              className="px-8 py-4 border-2 border-blue-500 text-blue-400 rounded-full font-semibold text-lg hover:bg-blue-500 hover:text-white transition-all duration-300 transform hover:-translate-y-1"
            >
              Get Started
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="px-8 py-4 border-2 border-gray-400 text-gray-300 rounded-full font-semibold text-lg hover:border-white hover:text-white transition-all duration-300"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Section 2: What We Do */}
      <section id="services" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">What We Do</h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto">
              We operate across three powerful pillars, delivering AI-powered solutions that spark imagination and deliver measurable impact.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* AI Content Creation */}
            <div className="border-2 border-gray-700 rounded-lg p-8 hover:border-blue-500 transition-all duration-300 bg-gray-800/50">
              <div className="w-16 h-16 border-2 border-blue-500 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4">AI Content Creation</h3>
              <p className="text-gray-300 mb-6">
                High-impact social videos, immersive commercials, and custom AI avatars crafted to elevate your brand voice.
              </p>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <span className="w-2 h-2 border border-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Video production: social clips, commercials</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 border border-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>AI avatars and virtual hosts</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 border border-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Automated editing and motion graphics</span>
                </li>
              </ul>
            </div>

            {/* LLM Deployment & Automation */}
            <div className="border-2 border-gray-700 rounded-lg p-8 hover:border-blue-500 transition-all duration-300 bg-gray-800/50">
              <div className="w-16 h-16 border-2 border-blue-500 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4">LLM Deployment & Automation</h3>
              <p className="text-gray-300 mb-6">
                Tailored LLMs, AI agents, and custom automations integrated into your website, apps, and workflows for efficiency at scale.
              </p>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <span className="w-2 h-2 border border-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Custom chatbot & knowledge-base development</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 border border-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Recommendation engines and personalization</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 border border-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Workflow automation & AI agents</span>
                </li>
              </ul>
            </div>

            {/* Distribution & Collaboration */}
            <div className="border-2 border-gray-700 rounded-lg p-8 hover:border-blue-500 transition-all duration-300 bg-gray-800/50">
              <div className="w-16 h-16 border-2 border-blue-500 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Distribution & Collaboration</h3>
              <p className="text-gray-300 mb-6">
                Leveraging our 100K+ AI-enthusiast network to amplify partner brands through content syndication, co-branded events, and affiliate channels.
              </p>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <span className="w-2 h-2 border border-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Content syndication across 101K+ followers</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 border border-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Co-branded webinars & workshops</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 border border-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Affiliate marketing & revenue share programs</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Feedo */}
      <section id="feedo" className="py-20 bg-gray-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Introducing
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"> Feedo</span>
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Our flagship AI platform that revolutionizes content creation and distribution across multiple channels.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <div className="w-6 h-6 border-2 border-blue-400 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-3 h-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Multi-platform content generation</span>
                </li>
                <li className="flex items-center">
                  <div className="w-6 h-6 border-2 border-blue-400 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-3 h-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Real-time performance analytics</span>
                </li>
                <li className="flex items-center">
                  <div className="w-6 h-6 border-2 border-blue-400 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-3 h-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Automated scheduling and posting</span>
                </li>
              </ul>
              <a 
                href="https://feedopro.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block px-8 py-4 border-2 border-blue-500 text-blue-400 rounded-full font-semibold text-lg hover:bg-blue-500 hover:text-white transition-all duration-300"
              >
                Try Feedo Now
              </a>
            </div>
            <div className="lg:w-1/2">
              <div className="border-2 border-gray-700 rounded-lg p-8 bg-gray-800/50">
                <div className="aspect-video border-2 border-gray-600 rounded-lg flex items-center justify-center">
                  <svg className="w-16 h-16 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Webinars & Events */}
      <section id="webinars" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Webinars & Events</h2>
            <p className="text-xl text-gray-300">
              Join our educational sessions and learn from industry experts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border-2 border-gray-700 rounded-lg p-8 bg-gray-800/50">
              <div className="mb-6">
                <span className="border border-red-500 text-red-400 px-3 py-1 rounded-full text-sm font-medium">Live Now</span>
              </div>
              <h3 className="text-2xl font-semibold mb-4">AI for Creators Webinar</h3>
              <p className="text-gray-300 mb-6">
                Learn how to leverage AI tools for content creation, marketing, and business growth.
              </p>
              <div className="flex flex-col gap-2 mb-6">
                <span className="text-sm text-gray-400">📅 June 21-22, 2025</span>
                <span className="text-sm text-gray-400">🕒 7:30 PM - 9:30 PM IST</span>
              </div>
              <a 
                href="/webinar" 
                className="inline-block px-6 py-3 border-2 border-blue-500 text-blue-400 rounded-lg font-semibold hover:bg-blue-500 hover:text-white transition-all duration-300"
              >
                Register Now
              </a>
            </div>

            <div className="border-2 border-gray-700 rounded-lg p-8 bg-gray-800/50">
              <div className="mb-6">
                <span className="border border-blue-500 text-blue-400 px-3 py-1 rounded-full text-sm font-medium">Coming Soon</span>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Advanced AI Automation</h3>
              <p className="text-gray-300 mb-6">
                Deep dive into automation strategies that can transform your business operations.
              </p>
              <div className="flex flex-col gap-2 mb-6">
                <span className="text-sm text-gray-400">📅 TBA</span>
                <span className="text-sm text-gray-400">🕒 TBA</span>
              </div>
              <button className="px-6 py-3 border-2 border-gray-600 text-gray-400 rounded-lg font-semibold hover:border-gray-500 hover:text-gray-300 transition-colors">
                Get Notified
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: About Us */}
      <section id="about" className="py-20 bg-gray-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">About Us</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We are a team of passionate creators, technologists, and innovators dedicated to democratizing AI for everyone.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-semibold mb-6">Our Mission</h3>
              <p className="text-lg text-gray-300 mb-6">
                To empower creators and businesses with accessible AI tools that enhance creativity, productivity, and growth. 
                We believe that AI should amplify human potential, not replace it.
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center border border-gray-700 rounded-lg p-4">
                  <div className="text-3xl font-bold text-blue-400 mb-2">500+</div>
                  <div className="text-gray-300">Creators Empowered</div>
                </div>
                <div className="text-center border border-gray-700 rounded-lg p-4">
                  <div className="text-3xl font-bold text-blue-400 mb-2">50+</div>
                  <div className="text-gray-300">AI Tools Mastered</div>
                </div>
              </div>
            </div>
            <div>
              <div className="border-2 border-gray-700 rounded-lg p-8 bg-gray-800/50">
                <div className="grid grid-cols-2 gap-4">
                  <div className="aspect-square border-2 border-gray-600 rounded-lg flex items-center justify-center">
                    <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <div className="aspect-square border-2 border-gray-600 rounded-lg flex items-center justify-center">
                    <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div className="aspect-square border-2 border-gray-600 rounded-lg flex items-center justify-center">
                    <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="aspect-square border-2 border-gray-600 rounded-lg flex items-center justify-center">
                    <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Why We Do It */}
      <section id="why" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Why We Do It</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our passion drives us to bridge the gap between complex AI technology and practical creative applications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center border-2 border-gray-700 rounded-lg p-8 bg-gray-800/50 hover:border-blue-500 transition-colors duration-300">
              <div className="w-24 h-24 border-2 border-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Empower Creators</h3>
              <p className="text-gray-300">
                We believe every creator deserves access to powerful tools that amplify their unique voice and vision.
              </p>
            </div>

            <div className="text-center border-2 border-gray-700 rounded-lg p-8 bg-gray-800/50 hover:border-blue-500 transition-colors duration-300">
              <div className="w-24 h-24 border-2 border-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Democratize AI</h3>
              <p className="text-gray-300">
                Making advanced AI technology accessible and understandable for creators of all skill levels.
              </p>
            </div>

            <div className="text-center border-2 border-gray-700 rounded-lg p-8 bg-gray-800/50 hover:border-blue-500 transition-colors duration-300">
              <div className="w-24 h-24 border-2 border-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Foster Innovation</h3>
              <p className="text-gray-300">
                Encouraging creative experimentation and pushing the boundaries of what's possible with AI.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 7: How We Do It */}
      <section id="how" className="py-20 bg-gray-950">
        <div className="max-w-8xl mx-auto px-12">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">How We Do It</h2>
            <p className="text-xl text-gray-300 max-w-8xl mx-auto">
              In an era where AI raises as many questions as it answers, our approach centers on building trust through transparency, expertise, and human-centered design.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="border-2 border-gray-700 rounded-lg p-8">
              <div className="mb-6">
                <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5-6v6a7 7 0 11-14 0V6a7 7 0 1114 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Trust & Safety by Design</h3>
              <p className="text-gray-300">
                Every solution we build integrates ethical guardrails and safety protocols from inception, not as afterthoughts. Your data, brand voice, and audiences are protected at every step.
              </p>
            </div>

            <div className="border-2 border-gray-700 rounded-lg p-8">
              <div className="mb-6">
                <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Responsible AI Development</h3>
              <p className="text-gray-300">
                Our neuroscience background informs our ethical approach to AI—we rigorously test against biases, ensure data privacy, and maintain human oversight where it matters most.
              </p>
            </div>

            <div className="border-2 border-gray-700 rounded-lg p-8">
              <div className="mb-6">
                <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Transparent Partnership</h3>
              <p className="text-gray-300">
                We demystify AI by involving you in every stage—explaining our processes, providing education, and ensuring you maintain control and ownership of your creative vision.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 8: Get In Touch */}
      <section id="contact" className="py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Get In Touch</h2>
          <p className="text-xl text-gray-300 mb-12">
            Ready to transform your creative process with AI? Let's start the conversation.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center border-2 border-gray-700 rounded-lg p-6 bg-gray-800/50">
              <div className="w-16 h-16 border-2 border-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Email Us</h3>
              <p className="text-gray-300">hello@cahnstudios.com</p>
            </div>

            <div className="text-center border-2 border-gray-700 rounded-lg p-6 bg-gray-800/50">
              <div className="w-16 h-16 border-2 border-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Chat With Us</h3>
              <p className="text-gray-300">Live support available</p>
            </div>

            <div className="text-center border-2 border-gray-700 rounded-lg p-6 bg-gray-800/50">
              <div className="w-16 h-16 border-2 border-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2M7 4h10l-1 16H8L7 4zM10 7v8m4-8v8" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Follow Us</h3>
              <p className="text-gray-300">@cahnstudios</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/contact" 
              className="px-8 py-4 border-2 border-blue-500 text-blue-400 rounded-full font-semibold text-lg hover:bg-blue-500 hover:text-white transition-all duration-300"
            >
              Prompt Us
            </a>
            <a 
              href="/webinar" 
              className="px-8 py-4 border-2 border-gray-400 text-gray-300 rounded-full font-semibold text-lg hover:border-white hover:text-white transition-all duration-300"
            >
              Join Our Webinar
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 