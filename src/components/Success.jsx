import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function Success() {
  const [searchParams] = useSearchParams();
  const [emailStatus, setEmailStatus] = useState('checking');
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const sendConfirmationEmail = async () => {
      if (!sessionId) {
        setEmailStatus('no-session');
        return;
      }

      try {
        console.log('Attempting to send confirmation email for session:', sessionId);
        
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/send-confirmation`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id: sessionId }),
        });

        const result = await response.json();
        
        if (response.ok) {
          console.log('Email sent successfully');
          setEmailStatus('sent');
        } else {
          console.error('Failed to send email:', result.error);
          setEmailStatus('failed');
        }
      } catch (error) {
        console.error('Error sending confirmation email:', error);
        setEmailStatus('failed');
      }
    };

    // Wait 2 seconds to let webhook potentially complete first
    setTimeout(sendConfirmationEmail, 2000);
  }, [sessionId]);

  const getEmailMessage = () => {
    switch (emailStatus) {
      case 'checking':
        return 'Processing your registration...';
      case 'sent':
        return 'Check your email for the webinar link and confirmation details.';
      case 'failed':
        return 'There was an issue sending your confirmation email. Please contact support.';
      case 'no-session':
        return 'Check your email for the webinar link.';
      default:
        return 'Check your email shortly for the webinar link.';
    }
  };

  return (
    <section className="h-screen flex flex-col items-center justify-center px-6 bg-white">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        🎉 Payment Successful!
      </h1>
      <p className="text-lg text-gray-600 mb-6 max-w-md text-center">
        We've received your payment. {getEmailMessage()}
      </p>
      {emailStatus === 'checking' && (
        <div className="flex items-center justify-center mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
      <a
        href="/"
        className="mt-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition"
      >
        Back to Home
      </a>
    </section>
  );
}
