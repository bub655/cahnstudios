import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Footer from "./components/Footer";
import Success from "./components/Success";
import PaymentSelection from './components/PaymentSelection';
import Contact from './components/Contact';
import TermsOfService from './components/TermsOfService';
import Course from './components/Course';
import CourseTermsOfService from './components/CourseTermsOfService';
import CoursePaymentSelection from './components/CoursePaymentSelection';

// Simple header for non-home pages
function SimpleHeader() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-white/10 py-4 px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
          <a href="/" className="hover:opacity-80 transition-opacity">
            <img src="/CAHN_Logo_Black_RGB.png" alt="Cahn Logo" className="h-4 filter invert brightness-0" />
          </a>
          <span className="text-white/30 hidden sm:inline">|</span>
          <span className="text-white/50 text-sm hidden sm:inline">AI-powered creative & strategy studio</span>
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
  );
}

// Wrapper for non-home pages
function PageWrapper({ children }) {
  return (
    <div className="min-h-screen bg-black text-white">
      <SimpleHeader />
      <div className="pt-16">
        {children}
      </div>
      <Footer />
    </div>
  );
}

// Home page wrapper (Home has its own header built-in)
function HomeWrapper() {
  return (
    <>
      <Home />
      <Footer />
    </>
  );
}

export default function App() {
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        if (backendUrl) {
          const res = await fetch(`${backendUrl}/api/health`);
          if (res.ok) {
            const data = await res.json();
            console.log(`✅ Backend running (${data.status})`);
          }
        }
      } catch (err) {
        // Silent fail
      }
    };
    checkBackend();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Home page */}
        <Route path="/" element={<HomeWrapper />} />
        
        {/* Other pages */}
        <Route path="/success" element={<PageWrapper><Success /></PageWrapper>} />
        <Route path="/terms-of-service" element={<PageWrapper><TermsOfService /></PageWrapper>} />
        <Route path="/payment-selection" element={<PageWrapper><PaymentSelection /></PageWrapper>} />
        <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
        <Route path="/course" element={<PageWrapper><Course /></PageWrapper>} />
        <Route path="/course-terms-of-service" element={<PageWrapper><CourseTermsOfService /></PageWrapper>} />
        <Route path="/course-payment-selection" element={<PageWrapper><CoursePaymentSelection /></PageWrapper>} />
      </Routes>
    </BrowserRouter>
  );
}
