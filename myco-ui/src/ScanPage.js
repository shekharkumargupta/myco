import React, { useRef, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import API_BASE_URL from "./config";

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
      const response = await fetch('${API_BASE_URL}/v1/otp/send', {
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
    const response = await fetch('${API_BASE_URL}/v1/otp', {
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
    const response = await fetch('${API_BASE_URL}/v1/otp/makeCall', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        mobileNumber,
        capturedImage, // still sending base64 if needed
      }),
    });

    if (response.ok) {
      // ✅ Step 2: Upload the image file
      const uploadSuccess = await uploadCapturedImage();
      
      if (uploadSuccess) {
        // ✅ Now show success dialog and redirect
        setShowSuccessDialog(true);
        setTimeout(() => {
          window.location.href = '/home';
        }, 3000);
      }
    } else {
      const data = await response.json();
      alert(`⚠️ Call failed: ${data.message || 'Unknown error'}`);
    }
  } catch (err) {
    console.error('Error making call:', err);
    alert('❌ Failed to initiate call. Please try again.');
  }
};


const uploadCapturedImage = async () => {
  try {
    if (!capturedImage) {
      console.warn('No image to upload.');
      return false;
    }

    // ✅ Resize before uploading
    const resizedBase64 = await resizeBase64Image(capturedImage);
    const imageBlob = base64ToBlob(resizedBase64);

    const formData = new FormData();
    formData.append('file', imageBlob, 'captured-photo.jpg');

    const response = await fetch('${API_BASE_URL}/v1/files/upload', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      console.log('✅ Image uploaded successfully');
      return true;
    } else {
      const data = await response.json();
      alert(`⚠️ Image upload failed: ${data.message || 'Unknown error'}`);
      return false;
    }
  } catch (err) {
    console.error('Upload error:', err);
    alert('🚨 Error uploading image.');
    return false;
  }
};



const base64ToBlob = (base64) => {
  const parts = base64.split(';base64,');
  const contentType = parts[0].split(':')[1];
  const byteCharacters = atob(parts[1]);
  const byteArrays = [];

  for (let i = 0; i < byteCharacters.length; i += 512) {
    const slice = byteCharacters.slice(i, i + 512);
    const byteNumbers = new Array(slice.length).fill().map((_, j) => slice.charCodeAt(j));
    byteArrays.push(new Uint8Array(byteNumbers));
  }

  return new Blob(byteArrays, { type: contentType });
};

const resizeBase64Image = (base64, maxWidth = 800, maxHeight = 800) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      // Scale proportionally
      if (width > maxWidth || height > maxHeight) {
        const scale = Math.min(maxWidth / width, maxHeight / height);
        width = width * scale;
        height = height * scale;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      const resizedBase64 = canvas.toDataURL('image/jpeg', 0.7); // 0.7 compression
      resolve(resizedBase64);
    };
    img.src = base64;
  });
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
          <h8 className="text-success text-center mb-4">User ID from Query: {userId}</h8>
          {capturedImage && (
            <div className="mb-3 text-center">
              <img src={capturedImage} alt="Captured" className="img-fluid rounded" />
            </div>
          )}
          <div className="d-grid gap-3">
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
