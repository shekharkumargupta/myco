import logo from './logo.svg';
import "bootstrap-icons/font/bootstrap-icons.css";
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUpPage from './SignUpPage';
import OtpPage from './OtpPage';
import HomePage from './HomePage';
import AddContactPage from "./AddContactPage";
import QrCodePage from "./QrCodePage";

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<SignUpPage />} />
		  <Route path="/otp" element={<OtpPage />} />
		  <Route path="/home" element={<HomePage />} />
		  <Route path="/add-contact" element={<AddContactPage />} />
		  <Route path="/qr" element={<QrCodePage />} />
        </Routes>
      </div>
    </Router>
  );
};



export default App;
