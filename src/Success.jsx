import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

function Success() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
        <div className="text-green-500 text-6xl mb-4">✓</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Registration Successful!
        </h1>
        <p className="text-gray-600 mb-6">
          Thank you for registering for AI for Creatives! 
          You'll receive a confirmation email shortly with webinar details.
        </p>
        <button 
          onClick={() => window.location.href = '/'}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
        >
          Return Home
        </button>
      </div>
    </div>
  );
}

export default Success;