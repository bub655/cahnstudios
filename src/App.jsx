import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Showcase from "./components/Showcase";
import WebinarDetails from "./components/WebinarDetails";
import Form from "./components/Form";
import Success from "./components/Success";
import Cancel from "./components/Cancel";

export default function App() {
  useEffect(() => {
    const checkBackend = async () => {
      try {
        console.log(import.meta.env.VITE_BACKEND_URL);
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/health`);
        if (res.ok) {
          const data = await res.json();
          console.log(`✅ Backend running (${data.status})`);
        } else {
          console.log("❌ Backend not responding");
        }
      } catch (err) {
        console.log("❌ Backend not reachable");
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
      </Routes>
    </BrowserRouter>
  );
}
