import React, { useState } from 'react';

const Form = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.country) {
      setMessage('Please fill in all fields.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Send registration data to your backend
      const response = await fetch('https://your-backend-url.com/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          country: formData.country
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setMessage('Registration successful! Redirecting to payment...');
        
        // Store data in memory for payment page (since sessionStorage isn't available)
        window.registrationData = formData;
        
        // Redirect to payment after a short delay
        setTimeout(() => {
          // window.location.href = '/payment-selection';
          setMessage('Payment redirect would happen here');
        }, 2000);
      } else {
        setMessage(result.error || 'Registration failed. Please try again.');
      }
      
    } catch (error) {
      console.error('Registration error:', error);
      setMessage('Network error. Please check your connection and try again.');
    }
    
    setIsSubmitting(false);
  };

  const sendEmail = async () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.country) {
      setMessage('Please fill in all fields before sending email.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Send registration data to your backend
      const response = await fetch('https://cahnstudios.com/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          country: formData.country
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setMessage('Registration successful! Confirmation emails sent.');
        // Optionally clear the form
        // setFormData({ name: '', email: '', phone: '', country: '' });
      } else {
        setMessage(result.error || 'Registration failed. Please try again.');
      }
      
    } catch (error) {
      console.error('Registration error:', error);
      setMessage('Network error. Please check your connection and try again.');
    }
    
    setIsSubmitting(false);
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
        
        {message && (
          <div className={`mb-4 p-3 rounded-md text-center ${
            message.includes('Error') || message.includes('fill in') 
              ? 'bg-red-100 text-red-700' 
              : 'bg-green-100 text-green-700'
          }`}>
            {message}
          </div>
        )}
        
        <div className="space-y-6">
          
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

          <div className="space-y-3">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full py-3 text-lg font-semibold transition rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 text-white hover:from-purple-500 hover:via-pink-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Processing...' : 'Continue to Payment'}
            </button>
            
            <button
              onClick={sendEmail}
              disabled={isSubmitting}
              className="w-full py-3 text-lg font-semibold transition rounded-full bg-gradient-to-r from-green-400 to-blue-500 text-white hover:from-green-500 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Processing...' : 'Send Registration Email'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Form;