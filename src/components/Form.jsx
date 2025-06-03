import React, { useState } from 'react';

const Form = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('');

    try {
      const response = await fetch('http://localhost:3001/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('We will send out the registration details shortly!');
        setFormData({ name: '', email: '', phone: '' });
      } else {
        setSubmitStatus('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setSubmitStatus('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="register-section"
      className="py-16 bg-gray-50 flex justify-center"
    >
      <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-8">
        <h2 className="text-4xl md:text-4xl font-bold text-gray-800 mb-8 text-center">
          Register Now
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
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

          {/* Email */}
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

          {/* Phone */}
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

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 text-lg font-semibold transition rounded-full ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed text-gray-200'
                : 'bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 text-white hover:from-purple-500 hover:via-pink-500 hover:to-blue-500'
            }`}
          >
            {isSubmitting ? 'Registering...' : 'Register for Webinar'}
          </button>

          {submitStatus && (
            <p
              className={`mt-4 text-center ${
                submitStatus.includes('Registration failed')
                  ? 'text-red-600'
                  : 'text-green-600'
              }`}
            >
              {submitStatus}
            </p>
          )}
        </form>
      </div>
    </section>
  );
};

export default Form;
