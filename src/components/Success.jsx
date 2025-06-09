import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function Success() {
  const [searchParams] = useSearchParams();
  const [emailStatus, setEmailStatus] = useState('checking');
  
  // Get URL parameters
  const sessionId = searchParams.get('session_id'); // Stripe
  const paymentId = searchParams.get('payment_id'); // Razorpay
  const orderId = searchParams.get('order_id'); // Razorpay
  
  const isRazorpayPayment = paymentId && orderId;
  const isStripePayment = sessionId;

  useEffect(() => {
    const handlePaymentConfirmation = async () => {
      console.log('Success component loaded');
      console.log('URL params:', { sessionId, paymentId, orderId });
      console.log('Payment type:', isRazorpayPayment ? 'Razorpay' : isStripePayment ? 'Stripe' : 'Unknown');

      if (isRazorpayPayment) {
        // Handle Razorpay payment confirmation
        console.log('Razorpay payment detected - webhook should handle email sending');
        setEmailStatus('sent');
      } else if (isStripePayment) {
        // For Stripe, the webhook should handle email sending
        // But we can add a fallback here if needed
        console.log('Stripe payment detected - webhook should handle email sending');
        setEmailStatus('sent');
      } else {
        console.log('No payment parameters found');
        setEmailStatus('no-payment');
      }
    };

    // Wait 2 seconds to let any webhooks potentially complete first
    setTimeout(handlePaymentConfirmation, 1000);
  }, [sessionId, paymentId, orderId, isRazorpayPayment, isStripePayment]);

  const getEmailMessage = () => {
    switch (emailStatus) {
      case 'checking':
        return 'Processing your registration...';
      case 'sent':
        return 'Check your email for the webinar details and confirmation.';
      case 'failed':
        return 'There was an issue sending your confirmation email. Please contact support with your payment details.';
      case 'no-payment':
        return 'Payment details not found. Please contact support if you completed a payment.';
      default:
        return 'Check your email shortly for the webinar details.';
    }
  };

  const getPaymentDetails = () => {
    if (isRazorpayPayment) {
      return (
        <div className="text-sm text-gray-500 mb-4">
          <p>Payment Method: Razorpay</p>
          <p>Payment ID: {paymentId}</p>
          <p>Order ID: {orderId}</p>
        </div>
      );
    } else if (isStripePayment) {
      return (
        <div className="text-sm text-gray-500 mb-4">
          <p>Payment Method: Stripe</p>
          <p>Session ID: {sessionId}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <section className="h-screen flex flex-col items-center justify-center px-6 bg-white">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        🎉 Payment Successful!
      </h1>
      <p className="text-lg text-gray-600 mb-6 max-w-md text-center">
        Thank you for your payment! {getEmailMessage()}
      </p>
      
      {getPaymentDetails()}
      
      {emailStatus === 'checking' && (
        <div className="flex items-center justify-center mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
      
      {emailStatus === 'failed' && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 max-w-md">
          <p className="text-sm font-medium">Payment processed successfully, but email confirmation failed.</p>
          <p className="text-sm">Please save your payment details and contact support:</p>
          <p className="text-sm mt-2">
            <strong>Support:</strong> create@cahnstudios.com
          </p>
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
