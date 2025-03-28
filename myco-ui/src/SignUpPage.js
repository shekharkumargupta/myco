// SignUpPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';

const SignUpPage = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); // To handle navigation

  const handleSignUp = () => {
    if (!mobileNumber) {
      setErrorMessage('Please enter a valid mobile number');
      return;
    }

    // API call to validate mobile number
    axios.post('http://localhost:8081/v1/users', { mobileNumber })
      .then((response) => {
        if (response.status == 200) {
          console.log(response.data);
          // Navigate to OTP page if API call is successful
          //history.push('/otp', { mobileNumber });
          navigate('/otp', { mobileNumber });
        } else {
          setErrorMessage('Error: Unable to proceed');
        }
      })
      .catch((error) => {
        setErrorMessage('Network error, please try again later.');
        console.error(error);
      });
  };

  return (
    <div>
      <h2>Sign Up with Mobile Number</h2>
      <input
        type="text"
        placeholder="Enter your mobile number"
        value={mobileNumber}
        onChange={(e) => setMobileNumber(e.target.value)}
      />
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <button onClick={handleSignUp}>Submit</button>
    </div>
  );
};

export default SignUpPage;
