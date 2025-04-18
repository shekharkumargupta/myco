import React, { useRef, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScanPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get('userId');

  const fileInputRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [otpStarted, setOtpStarted] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [resendTimer, setResendTimer] = useState(60);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  useEffect(() => {
    let timer;
    if (otpStarted && resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer, otpStarted]);

  const handleCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleButtonClick = () => {
    setShowModal(true);
    setMobileNumber('');
    setOtpStarted(false);
    setOtp(['', '', '', '']);
    setResendTimer(60);
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      const next = document.getElementById(`otp-${index + 1}`);
      next && next.focus();
    }
  };

  const sendOtpToMobile = async () => {
    setIsSendingOtp(true);
    try {
      const response = await fetch('http://localhost:8081/v1/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileNumber }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('📲 OTP sent successfully!');
        setOtpStarted(true);
        setResendTimer(60);
      } else {
        alert(`❌ Failed to send OTP: ${data.message || 'Unknown error'}`);
      }
    } catch (err) {
      alert('🚨 Network error while sending OTP.');
    } finally {
      setIsSendingOtp(false);
    }
  };

const verifyOtpWithApi = async () => {
  const otpCode = otp.join('');
  if (otpCode.length !== 4 || mobileNumber.length < 10) {
    alert('Please enter a valid OTP and mobile number.');
    return;
  }

  setIsVerifying(true);
  try {
    const response = await fetch('http://localhost:8081/v1/otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobileNumber, otp: otpCode }),
    });

    if (response.status === 200) {
      alert('✅ OTP Verified!');
      setShowModal(false);

      // 🔔 Make the call after OTP verification
      await makeCallToOwner();
    } else {
      //const data = await response.json();
	  //alert(`❌ Verification Failed: ${data.message || 'Invalid OTP'}`);
	  alert('Invalid OTP');
	  setOtp(['', '', '', '']); // 👈 Clear the OTP fields
	  document.getElementById('otp-0')?.focus(); // 👈 Focus back to the first box
    }
  } catch (err) {
    alert('🚨 Error verifying OTP. Please try again.');
    console.error(err);
  } finally {
    setIsVerifying(false);
  }
};


const makeCallToOwner = async () => {
  try {
    const response = await fetch('http://localhost:8081/v1/otp/makeCall', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        mobileNumber,
      }),
    });

    if (response.ok) {
      setShowSuccessDialog(true);

      // Redirect to /home after 3 seconds
      setTimeout(() => {
        window.location.href = '/home';
      }, 3000);
    } else {
      const data = await response.json();
      alert(`⚠️ Call failed: ${data.message || 'Unknown error'}`);
    }
  } catch (err) {
    console.error('Error making call:', err);
    alert('❌ Failed to initiate call. Please try again.');
  }
};




  return (
    <div className="container min-vh-100 bg-light">
      <div className="py-3 d-flex justify-content-between align-items-center border-bottom">
        <h1 className="mb-0">myco</h1>
        <button className="btn btn-outline-secondary" onClick={handleCapture}>
          📷 Capture Photo
        </button>
        <input
          type="file"
          accept="image/*"
          capture="environment"
          ref={fileInputRef}
          onChange={handleImageChange}
          style={{ display: 'none' }}
        />
      </div>

      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <div className="card shadow p-4" style={{ maxWidth: '400px', width: '100%' }}>
          <h2 className="text-success text-center mb-4">User ID from Query: {userId}</h2>
          {capturedImage && (
            <div className="mb-3 text-center">
              <img src={capturedImage} alt="Captured" className="img-fluid rounded" />
            </div>
          )}
          <div className="d-grid gap-3">
            <button className="btn btn-success" onClick={handleButtonClick}>📞 Inform to Owner</button>
            <button className="btn btn-danger" onClick={handleButtonClick}>📞 Emergency Call</button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-3 animate__animated animate__fadeInDown">
              <div className="modal-header">
                <h5 className="modal-title">Verify Mobile Number</h5>
                <button className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                {!otpStarted ? (
                  <>
                    <input
                      type="tel"
                      className="form-control mb-3"
                      placeholder="Enter mobile number"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                    />
                    <button
                      className="btn btn-primary w-100"
                      onClick={sendOtpToMobile}
                      disabled={isSendingOtp || mobileNumber.length < 10}
                    >
                      {isSendingOtp ? 'Sending...' : 'Send OTP'}
                    </button>
                  </>
                ) : (
                  <>
                    <div className="text-center mb-3">
                      <label className="form-label">Enter 4-digit OTP</label>
                      <div className="d-flex justify-content-center gap-2">
                        {otp.map((digit, index) => (
                          <input
                            key={index}
                            id={`otp-${index}`}
                            type="text"
                            className="form-control text-center"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            style={{ width: '50px', fontSize: '1.5rem' }}
                          />
                        ))}
                      </div>
                    </div>
                    <button
                      className="btn btn-success w-100 mb-2"
                      onClick={verifyOtpWithApi}
                      disabled={isVerifying}
                    >
                      {isVerifying ? 'Verifying...' : 'Verify OTP'}
                    </button>
                    <button
                      className="btn btn-link text-decoration-none"
                      disabled={resendTimer > 0}
                      onClick={sendOtpToMobile}
                    >
                      {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : '🔄 Resend OTP'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScanPage;
