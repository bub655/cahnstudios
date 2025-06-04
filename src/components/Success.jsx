import React from "react";
import { useSearchParams } from "react-router-dom";

export default function Success() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  return (
    <section className="h-screen flex flex-col items-center justify-center px-6 bg-white">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        🎉 Payment Successful!
      </h1>
      <p className="text-lg text-gray-600 mb-6 max-w-md text-center">
        Thank you for your payment! You should receive a confirmation email with your webinar details shortly.
      </p>
      <div className="text-sm text-gray-500 mb-4">
        <p>Payment ID: {sessionId || 'Processing...'}</p>
      </div>
      <a
        href="/"
        className="mt-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition"
      >
        Back to Home
      </a>
    </section>
  );
} 
