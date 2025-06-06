import React, { useState } from 'react';

const Form = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: ''
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerStatus, setRegisterStatus] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsRegistering(true);
    
    try {
      // Store form data in sessionStorage
      sessionStorage.setItem('registrationData', JSON.stringify(formData));
      
      // Track initial engagement
      console.log('Tracking initial engagement...');
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/track-engagement`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      console.log('✅ Engagement tracked successfully');
      
      // Redirect to terms of service page
      window.location.href = '/terms-of-service';
    } catch (error) {
      console.error('❌ Error tracking engagement:', error);
      // Still redirect even if tracking fails
      window.location.href = '/terms-of-service';
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <section
      id="register-section"
      className="py-16 bg-white flex justify-center"
    >
      <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Register Now
        </h2>

        {/* Pricing Section */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-8 text-center border border-green-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            🎯 Exclusive Early Bird Pricing
          </h3>
          <div className="flex items-center justify-center gap-4 mb-3">
            <div className="text-center">
              <span className="text-sm text-gray-500 block">Was</span>
              <span className="text-2xl text-gray-500 line-through font-bold">$200</span>
            </div>
            <div className="text-center">
              <span className="text-sm text-green-600 block">Now Only</span>
              <span className="text-4xl text-green-600 font-bold">$58</span>
            </div>
          </div>
          <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium inline-block">
            71% OFF Limited Time Only
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col">
            <label htmlFor="name" className="text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Your full name"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="email" className="text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="you@example.com"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="phone" className="text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="country" className="text-gray-700 mb-1">
              Country
            </label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="e.g. USA, India, Canada, etc."
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isRegistering}
              className={`w-full py-3 text-lg font-semibold transition rounded-full ${
                isRegistering
                  ? 'bg-gray-400 cursor-not-allowed text-gray-200'
                  : 'bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 text-white hover:from-purple-500 hover:via-pink-500 hover:to-blue-500'
              }`}
            >
              {isRegistering ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                'Continue to Payment'
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Form;
