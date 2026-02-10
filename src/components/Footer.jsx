import React, { useState } from "react";
import {FaXTwitter, FaEnvelope} from 'react-icons/fa6';
import { FaInstagram} from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export default function Footer() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState(null); // 'success' | 'error' | null

  return (
    <footer className="bg-zinc-950">
      {/* Consultation Form Section */}
      <div id="contact" className="py-16 px-6 border-t border-white/10">
        <div className="max-w-3xl mx-auto">
          <span className="text-[#e64726] text-sm font-medium tracking-wider uppercase mb-6 block">
            WORK WITH US
          </span>
          <h2 className="text-3xl md:text-4xl font-serif mb-6 text-white">
            1:1 AI and Strategy Building Guidance and Consultancy
          </h2>

          <form 
            onSubmit={async (e) => {
              e.preventDefault();
              setSubmitting(true);
              const formData = new FormData(e.target);
              const data = {
                name: formData.get('consultation-name'),
                email: formData.get('consultation-email'),
                country: formData.get('consultation-country'),
                reason: formData.get('consultation-reason'),
                subject: '1:1 Consultation Request'
              };
              
              try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
                const response = await fetch(`${backendUrl}/api/consultation`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(data)
                });
                if (response.ok) {
                  setFormStatus('success');
                  e.target.reset();
                } else {
                  setFormStatus('error');
                }
              } catch (error) {
                setFormStatus('error');
              }
              setSubmitting(false);
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Name <span className="text-[#e64726]">*</span>
                </label>
                <input
                  type="text"
                  name="consultation-name"
                  required
                  placeholder="Your full name"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-sm text-white placeholder-white/40 focus:outline-none focus:border-white/30"
                />
              </div>
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Email <span className="text-[#e64726]">*</span>
                </label>
                <input
                  type="email"
                  name="consultation-email"
                  required
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-sm text-white placeholder-white/40 focus:outline-none focus:border-white/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Country <span className="text-[#e64726]">*</span>
              </label>
              <input
                type="text"
                name="consultation-country"
                required
                placeholder="Your country"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-sm text-white placeholder-white/40 focus:outline-none focus:border-white/30"
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Reason for Booking <span className="text-[#e64726]">*</span>
              </label>
              <textarea
                name="consultation-reason"
                required
                rows={4}
                placeholder="Tell us what you'd like to discuss..."
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-sm text-white placeholder-white/40 focus:outline-none focus:border-white/30 resize-none"
              />
            </div>

            {formStatus === 'success' && (
              <p className="text-[#31af9c] text-sm">Thank you! We'll be in touch soon.</p>
            )}
            {formStatus === 'error' && (
              <p className="text-[#e64726] text-sm">Something went wrong. Please try again.</p>
            )}

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button 
                type="submit"
                disabled={submitting}
                className="flex-1 px-6 py-3 bg-[#e64726] text-white rounded-sm font-medium hover:bg-[#e64726]/90 transition-colors disabled:opacity-50"
              >
                {submitting ? 'Sending...' : 'Send Message'}
              </button>
              <a
                href="https://calendly.com/create-cahnstudios/new-meeting"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-6 py-3 bg-transparent border border-[#3957a7] text-[#3957a7] rounded-sm font-medium hover:bg-[#3957a7]/10 transition-colors text-center"
              >
                Book a Call
              </a>
            </div>
          </form>
        </div>
      </div>

      {/* Newsletter CTA Section */}
      <div className="py-16 px-6 border-t border-white/10">
        <div className="max-w-3xl mx-auto">
          <span className="text-[#e64726] text-sm font-medium tracking-wider uppercase mb-6 block">
            CAHN PULSE
          </span>
          <h2 className="text-4xl md:text-5xl font-serif mb-4 text-white">
            Join the Weekly Pulse
          </h2>
          <p className="text-white/60 text-lg mb-8">
            Weekly insights from the intersection of AI, creativity, and real studio work. No hype, just signal.
          </p>

          {/* Email Form */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              window.open('https://cahns-newsletter.beehiiv.com/subscribe', '_blank');
            }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <input
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-sm text-white placeholder-white/40 focus:outline-none focus:border-white/30"
            />
            <button 
              type="submit"
              className="px-6 py-3 bg-[#e64726] text-white rounded-sm font-medium hover:bg-[#e64726]/90 transition-colors whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-12 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
            {/* Logo */}
            <div>
              <img src="/CAHN_Logo_Black_RGB.png" alt="Cahn Logo" className="h-8 filter invert brightness-0" />
              <p className="text-white/50 text-sm mt-2">AI-powered creative & strategy studio</p>
              {/* Social media icons */}
              <div className="flex space-x-4 mt-4 text-gray-400">
                {/* Instagram */}
                <a href="https://www.instagram.com/ai.cahn/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-white transition-colors duration-200">
                  <FaInstagram size={24} />
                </a>

                {/* X (Twitter) */}
                <a href="https://x.com/CahnStudios" target="_blank" rel="noopener noreferrer" aria-label="X" className="hover:text-white transition-colors duration-200">
                <FaXTwitter size={24} />
                </a>

                {/* Email */}
                <a href="mailto:create@cahnstudios.com" aria-label="Email" className="hover:text-white transition-colors duration-200">
                <FaEnvelope size={24} />
                </a>
              </div>
            </div>

            {/* Nav Links */}
            <nav className="flex flex-wrap gap-8 text-sm text-white/60 self-end md:self-auto md:mt-6">
              <a href="/#services" className="hover:text-white transition-colors">Services</a>
              <a href="/#pulse" className="hover:text-white transition-colors">Cahn Pulse</a>
              <a href="/#work" className="hover:text-white transition-colors">Work</a>
              <a href="/#learning" className="hover:text-white transition-colors">Learning</a>
            </nav>

            {/* Email */}
            <a href="mailto:create@cahnstudios.com" className="text-white/60 hover:text-white transition-colors text-sm self-end md:self-auto md:mt-8">
              create@cahnstudios.com
            </a>
          </div>

          {/* Copyright */}
          <div className="pt-8 border-t border-white/10">
            <p className="text-white/40 text-sm">
              © {new Date().getFullYear()} Cahn Studios. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
