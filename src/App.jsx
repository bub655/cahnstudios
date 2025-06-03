import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Showcase from "./components/Showcase";
import WebinarDetails from "./components/WebinarDetails";
import Form from "./components/Form";
import Success from "./components/Success";
import Cancel from "./components/Cancel";

export default function App() {
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
