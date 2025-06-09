import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TermsOfService = () => {
  const [accepted, setAccepted] = useState(false);
  const [registrationData, setRegistrationData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get registration data from sessionStorage if it exists
    const data = sessionStorage.getItem('registrationData');
    if (data) {
      setRegistrationData(JSON.parse(data));
    }
    // No redirect if no registration data - allow access to terms page
  }, []);

  const handleAccept = () => {
    if (!accepted) {
      return;
    }
    
    // Store terms acceptance in sessionStorage
    sessionStorage.setItem('termsAccepted', 'true');
    
    // Proceed to payment selection
    navigate('/payment-selection');
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <section className="mt-12 py-16 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Terms of Service
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Please read and accept the following terms and conditions before proceeding with your registration for the AI for Creators Webinar.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-6 bg-gray-50 mb-6">
            <div className="space-y-6 text-gray-700 leading-relaxed">
              
              {/* Terms Content */}
              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-3">1. Agreement to Terms</h2>
                <p>
                  By registering for the AI for Creators Webinar ("the Event") provided by Cahn Studios ("we," "us," or "our"), 
                  you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not proceed 
                  with your registration.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-3">2. Event Description</h2>
                <p>
                  The AI for Creators Webinar is an educational online event designed to provide insights, strategies, and 
                  practical knowledge about artificial intelligence tools and applications for content creators. The webinar 
                  includes live instruction, Q&A sessions, and supplementary materials.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-3">3. Registration and Payment</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Registration requires full payment at the time of booking</li>
                  <li>All fees are non-refundable once payment is processed</li>
                  <li>Prices are subject to change without notice</li>
                  <li>Payment confirms your agreement to these terms</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-3">4. Access and Participation</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access details will be provided via email after successful registration</li>
                  <li>You are responsible for ensuring stable internet connection</li>
                  <li>Recording of the session may be provided for registered participants</li>
                  <li>Participation in Q&A and interactive elements is voluntary</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-3">5. Intellectual Property</h2>
                <p>
                  All content, materials, and information provided during the webinar are the intellectual property of 
                  Cahn Studios. Participants may not record, reproduce, distribute, or share the content without explicit 
                  written permission.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-3">6. Privacy and Data Use</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>We collect and use personal information as outlined in our Privacy Policy</li>
                  <li>Registration information may be used to send event-related communications</li>
                  <li>We do not sell or share personal information with third parties</li>
                  <li>You may opt out of non-essential communications at any time</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-3">7. Cancellation and Rescheduling</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Cahn Studios reserves the right to cancel or reschedule the event due to unforeseen circumstances</li>
                  <li>In case of cancellation by us, full refunds will be provided</li>
                  <li>Participant cancellations are not eligible for refunds</li>
                  <li>Rescheduled events will be communicated with at least 24 hours notice</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-3">8. Technical Requirements</h2>
                <p>
                  Participants are responsible for ensuring they have the necessary technical requirements to access the webinar, 
                  including but not limited to: stable internet connection, compatible device, and updated web browser. 
                  Technical difficulties on the participant's end do not constitute grounds for refund.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-3">9. Limitation of Liability</h2>
                <p>
                  Cahn Studios shall not be liable for any direct, indirect, incidental, special, or consequential damages 
                  arising from participation in the webinar. Our total liability shall not exceed the amount paid for registration.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-3">10. Code of Conduct</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Participants must conduct themselves professionally and respectfully</li>
                  <li>Disruptive behavior may result in removal from the event</li>
                  <li>Harassment, discrimination, or inappropriate content is prohibited</li>
                  <li>We reserve the right to remove participants who violate these guidelines</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-3">11. Governing Law</h2>
                <p>
                  These Terms of Service are governed by the laws of the jurisdiction in which Cahn Studios operates. 
                  Any disputes shall be resolved through binding arbitration.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-3">12. Contact Information</h2>
                <p>
                  For questions regarding these terms or the webinar, please contact us at create@cahnstudios.com
                </p>
              </section>

              <section className="border-t pt-4">
                <p className="text-sm text-gray-600">
                  <strong>Last Updated:</strong> {new Date().toLocaleDateString()}<br/>
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
                <span className="font-medium">I have read and agree to the Terms of Service</span>
                <br />
                <span className="text-sm text-gray-600">
                  By checking this box, I acknowledge that I have read, understood, and agree to be bound by these Terms of Service. 
                  I understand that payment is non-refundable and that I am responsible for meeting technical requirements for webinar access.
                </span>
              </label>
            </div>

            {/* Registration Summary - only show if registration data exists */}
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

            {/* Warning if no registration data */}
            {!registrationData && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <span className="text-yellow-500 text-xl">⚠️</span>
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-yellow-800">No Registration Data Found</p>
                    <p className="text-sm text-yellow-700">
                      You'll need to complete the registration form before proceeding to payment. 
                      You can still read and accept the terms here.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
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

export default TermsOfService; 