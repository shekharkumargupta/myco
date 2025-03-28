import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUpPage from './SignUpPage';
import OtpPage from './OtpPage';


const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          
          <Route path="/otp" element={<OtpPage />} />
          <Route path="/" element={<SignUpPage />} />
        </Routes>
      </div>
    </Router>
  );
};



export default App;
