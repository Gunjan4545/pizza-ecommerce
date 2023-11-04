import React, { useEffect, useState } from 'react';
import axios from 'axios';

function EmailVerification() {
  const [verificationStatus, setVerificationStatus] = useState('Verifying...');

  useEffect(() => {
    // Get the token from the URL (you can use React Router)
    const token = new URLSearchParams(window.location.search).get('token');

    // Make an API request to verify the email
    axios
      .get(`http://localhost:5000/api/verify?token=${token}`) // Adjust the URL to your server's endpoint
      .then((response) => {
        setVerificationStatus(response.data.message);
      })
      .catch((error) => {
        setVerificationStatus(error.response.data.message);
      });
  }, []);

  return (
    <div className="email-verification">
      <h2>Email Verification</h2>
      <p>{verificationStatus}</p>
    </div>
  );
}

export default EmailVerification;
