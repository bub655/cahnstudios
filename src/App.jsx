import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Webinar from "./components/Webinar";
import Success from "./components/Success";
import Footer from "./components/Footer";
import PaymentSelection from './components/PaymentSelection';
import Contact from './components/Contact';
import TermsOfService from './components/TermsOfService';
import Course from './components/Course';
import CourseTermsOfService from './components/CourseTermsOfService';
import CoursePaymentSelection from './components/CoursePaymentSelection';

export default function App() {
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        console.log('Backend URL:', backendUrl);
        console.log('Full health check URL:', `${backendUrl}/api/health`);
        
        const res = await fetch(`${backendUrl}/api/health`);
        console.log('Response status:', res.status);
        console.log('Response ok:', res.ok);
        
        if (res.ok) {
          const data = await res.json();
          console.log(`✅ Backend running (${data.status})`);
        } else {
          console.log("❌ Backend not responding, status:", res.status);
        }
      } catch (err) {
        console.log("❌ Backend not reachable, error:", err.message);
      }
    };
    checkBackend();
  }, []);

  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* New home page with company sections */}
        <Route path="/" element={<Home />} />
        
        {/* Webinar registration page (moved from home) */}
        {/* <Route path="/webinar" element={<Webinar />} /> */}

        {/* After successful payment, Stripe redirects here */}
        <Route path="/success" element={<Success />} />

        {/* Other pages */}
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/payment-selection" element={<PaymentSelection />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/course" element={<Course />} />
        <Route path="/course-terms-of-service" element={<CourseTermsOfService />} />
        <Route path="/course-payment-selection" element={<CoursePaymentSelection />} />
      </Routes>
      
      <Footer />
    </BrowserRouter>
  );
}
