import React, { useState, useEffect } from 'react';

const PaymentSelection = () => {
  const [formData, setFormData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMethod, setProcessingMethod] = useState('');

  useEffect(() => {
    // Retrieve form data from sessionStorage
    const storedData = sessionStorage.getItem('registrationData');
    if (storedData) {
      setFormData(JSON.parse(storedData));
    } else {
      // If no form data, redirect back to registration
      window.location.href = '/';
    }
  }, []);

  const handleStripePayment = async () => {
    setIsProcessing(true);
    setProcessingMethod('stripe');

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, paymentMethod: 'stripe' }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Failed to start Stripe payment. Please try again.');
        setIsProcessing(false);
        setProcessingMethod('');
      }
    } catch (error) {
      console.error('Stripe payment error:', error);
      alert('Payment failed. Please try again.');
      setIsProcessing(false);
      setProcessingMethod('');
    }
  };

  const handleRazorpayPayment = () => {
    setIsProcessing(true);
    setProcessingMethod('razorpay');
    // Directly redirect to the external link
    window.location.href = 'https://rzp.io/rzp/5I2Axrj'; //RazorPay Link by Vishnu
  };

  const goBack = () => {
    window.history.back();
  };

  if (!formData) {
    return (
      <div className="py-16 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gray-50 min-h-screen flex justify-center">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Choose Your Payment Method
        </h2>
        
        {/* Registration Summary */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Registration Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">Name:</span>
              <p className="text-gray-800">{formData.name}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Email:</span>
              <p className="text-gray-800">{formData.email}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Phone:</span>
              <p className="text-gray-800">{formData.phone}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Country:</span>
              <p className="text-gray-800">{formData.country}</p>
            </div>
          </div>
        </div>

        {/* Payment Options */}
        <div className="space-y-4 mb-8">
          <h3 className="text-xl font-semibold text-gray-700 text-center mb-6">
            Select Payment Method
          </h3>
          
          {/* Stripe Button */}
          <button
            onClick={handleStripePayment}
            disabled={isProcessing}
            className={`w-full p-6 border-2 rounded-lg transition-all duration-200 ${
              isProcessing && processingMethod === 'stripe'
                ? 'bg-blue-100 border-blue-300 cursor-not-allowed'
                : 'bg-white border-blue-200 hover:border-blue-400 hover:bg-blue-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">S</span>
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-gray-800">Pay with Stripe</h4>
                  <p className="text-sm text-gray-600">Credit/Debit Cards, Digital Wallets</p>
                </div>
              </div>
              {isProcessing && processingMethod === 'stripe' ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              ) : (
                <span className="text-blue-600 font-medium">Choose →</span>
              )}
            </div>
          </button>

          {/* Razorpay Button */}
          <button
            onClick={handleRazorpayPayment}
            disabled={isProcessing}
            className={`w-full p-6 border-2 rounded-lg transition-all duration-200 ${
              isProcessing && processingMethod === 'razorpay'
                ? 'bg-indigo-100 border-indigo-300 cursor-not-allowed'
                : 'bg-white border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">R</span>
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-gray-800">Pay with Razorpay</h4>
                  <p className="text-sm text-gray-600">UPI, Cards, Net Banking, Wallets</p>
                </div>
              </div>
              {isProcessing && processingMethod === 'razorpay' ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
              ) : (
                <span className="text-indigo-600 font-medium">Choose →</span>
              )}
            </div>
          </button>
        </div>

        {/* Back Button */}
        <button
          onClick={goBack}
          disabled={isProcessing}
          className="w-full py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Go Back to Registration
        </button>
      </div>
    </section>
  );
};

export default PaymentSelection;
