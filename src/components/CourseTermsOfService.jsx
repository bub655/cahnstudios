import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CourseTermsOfService = () => {
  const [accepted, setAccepted] = useState(false);
  const [registrationData, setRegistrationData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const data = sessionStorage.getItem('registrationData');
    if (data) {
      setRegistrationData(JSON.parse(data));
    }
  }, []);

  const handleAccept = () => {
    if (!accepted) return;

    sessionStorage.setItem('termsAccepted', 'true');
    navigate('/course-payment-selection');
  };

  const handleBack = () => navigate('/');

  return (
    <section className="mt-12 py-16 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Course Terms of Service
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Please read and accept these terms before purchasing access to the webinar recordings.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-6 bg-gray-50 mb-6">
            <div className="space-y-6 text-gray-700 leading-relaxed">

              {/* Terms Content */}
              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-3">1. Agreement to Terms</h2>
                <p>
                  By purchasing the AI for Creators recordings (the "Course") from Cahn Studios ("we", "us", "our"),
                  you agree to these Course Terms of Service. If you do not agree, do not continue with your purchase.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-3">2. Course Description</h2>
                <p>
                  The Course contains high definition recordings of our live AI for Creators webinar sessions, related
                  handouts, and future updates we choose to release. The material is for educational use only.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-3">3. Payment and Access</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Full payment is required at checkout. All sales are final and non‑refundable.</li>
                  <li>After payment you will receive a private link to view the recordings.</li>
                  <li>Prices may change at any time, but confirmed purchases are locked at the price paid.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-3">4. Usage Rules</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>No distribution. You may not resell, share, gift, or publicly post any part of the Course.</li>
                  <li>No screen recording, screen shots, or live streaming of the videos.</li>
                  <li>No uploading the content to any cloud drive, social network, or learning platform.</li>
                  <li>The materials are licensed to a single purchaser for personal use only.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-3">5. Intellectual Property</h2>
                <p>
                  All videos, slides, prompts, and handouts are the intellectual property of Cahn Studios. Any
                  unauthorised copying or distribution is a breach of copyright and may lead to legal action.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-3">6. Technical Requirements</h2>
                <p>
                  You need a stable internet connection and a modern browser to view the recordings. Technical issues on
                  your end do not qualify for refunds.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-3">7. Privacy</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>We store the personal data you provide at checkout to deliver the Course and related updates.</li>
                  <li>We do not sell or rent your personal data.</li>
                  <li>You may unsubscribe from non‑essential emails at any time.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-3">8. Limitation of Liability</h2>
                <p>
                  Cahn Studios is not liable for indirect or consequential losses. Our total liability is limited to the
                  amount you paid for the Course.
                </p>
              </section>

              <section className="border-t pt-4">
                <p className="text-sm text-gray-600">
                  <strong>Last Updated:</strong> {new Date().toLocaleDateString()}<br />
                  <strong>Effective Date:</strong> {new Date().toLocaleDateString()}
                </p>
              </section>
            </div>
          </div>

          {/* Acceptance Checkbox */}
          <div className="border-t pt-6">
            <div className="flex items-start space-x-3 mb-6">
              <input
                type="checkbox"
                id="acceptTerms"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 mt-1"
              />
              <label htmlFor="acceptTerms" className="text-gray-700 leading-relaxed">
                <span className="font-medium">I have read and agree to the Course Terms of Service</span>
              </label>
            </div>

            {/* Registration Summary */}
            {registrationData && (
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-800 mb-2">Registration Summary</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Name:</strong> {registrationData.name}</p>
                  <p><strong>Email:</strong> {registrationData.email}</p>
                  <p><strong>Phone:</strong> {registrationData.phone}</p>
                  <p><strong>Country:</strong> {registrationData.country}</p>
                </div>
              </div>
            )}

            <div className="flex space-x-4">
              <button
                onClick={handleBack}
                className="flex-1 py-3 text-lg font-semibold rounded-lg border-2 border-gray-300 text-gray-600 hover:bg-gray-50 transition-all duration-200"
              >
                Back to Registration
              </button>
              <button
                onClick={handleAccept}
                disabled={!accepted}
                className={`flex-1 py-3 text-lg font-semibold rounded-lg transition-all duration-200 ${
                  accepted
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transform hover:scale-[1.02] active:scale-[0.98]'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Accept & Continue to Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CourseTermsOfService;
