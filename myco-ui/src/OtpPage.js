// OtpPage.js
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const OtpPage = () => {
  const location = useLocation();
  const history = useNavigate();
  const { mobileNumber } = location.state || {}; // Get mobile number passed from SignUpPage
  const [otp, setOtp] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleOtpSubmit = () => {
    if (!otp) {
      setErrorMessage('Please enter the OTP');
      return;
    }

    // Simulate OTP verification (you should replace this with your actual verification API)
    if (otp === '123456') {
      alert('OTP Verified!');
      // You can redirect or handle post-OTP success logic here
    } else {
      setErrorMessage('Invalid OTP');
    }
  };

  return (
    <div>
      <h2>Enter OTP</h2>
      <p>A code has been sent to {mobileNumber}</p>
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <button onClick={handleOtpSubmit}>Submit OTP</button>
    </div>
  );
};

export default OtpPage;
