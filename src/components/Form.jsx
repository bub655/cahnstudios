import React, { useState } from 'react';

const Form = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Store form data in sessionStorage to pass to payment selection page
    sessionStorage.setItem('registrationData', JSON.stringify(formData));
    
    // Redirect to payment selection page
    window.location.href = '/payment-selection';
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
              placeholder="e.g. USA, India, Canada"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 text-lg font-semibold transition rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 text-white hover:from-purple-500 hover:via-pink-500 hover:to-blue-500"
          >
            Continue to Payment
          </button>
        </form>
      </div>
    </section>
  );
};

export default Form;