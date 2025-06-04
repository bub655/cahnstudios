import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Showcase from "./components/Showcase";
import WebinarDetails from "./components/WebinarDetails";
import Form from "./components/Form";
import Success from "./components/Success";
import Cancel from "./components/Cancel";
import Footer from "./components/Footer";
import PaymentSelection from './components/PaymentSelection';

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
        <Route
          path="/"
          element={
            <>
              <Showcase />
              <WebinarDetails />
              <Form />
            </>
          }
        />

        {/* After successful payment, Stripe redirects here */}
        <Route
          path="/success"
          element={<Success />}
        />
        {/* If payment is canceled, Stripe redirects here */}
        <Route
          path="/cancel"
          element={<Cancel />}
        />
        <Route path="/" element={<Form />} />
        <Route path="/payment-selection" element={<PaymentSelection />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
