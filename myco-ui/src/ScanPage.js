import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CaptureSection from './CaptureSection';
import EmergencyModal from './EmergencyModal';
import { base64ToBlob, resizeBase64Image } from './utils/imageUtils';
import API_BASE_URL from './config';

const ScanPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const ownerId = new URLSearchParams(location.search).get('ownerId');

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
  const [isUploaded, setIsUploaded] = useState(false);


  useEffect(() => {
    if (otpStarted && resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer, otpStarted]);

  const handleCapture = () => fileInputRef.current?.click();

	const handleUploadClick = async () => {
	  const success = await uploadCapturedImage();
	  if (success) {
		alert("✅ Image uploaded successfully!");
		setIsUploaded(true);
	  } else {
		alert("❌ Failed to upload image.");
	  }
	};


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setCapturedImage(reader.result);
    reader.readAsDataURL(file);
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
    if (value && index < 3) document.getElementById(`otp-${index + 1}`)?.focus();
  };

  const sendOtpToMobile = async () => {
    setIsSendingOtp(true);
    try {
      const res = await fetch(`${API_BASE_URL}/v1/otp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileNumber }),
      });
      const data = await res.json();
      res.ok ? setOtpStarted(true) : alert(`❌ ${data.message}`);
    } catch {
      alert('Error sending OTP.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const verifyOtpWithApi = async () => {
    const code = otp.join('');
    if (code.length < 4 || mobileNumber.length < 10) return alert('Invalid input');
    setIsVerifying(true);
    try {
      const res = await fetch(`${API_BASE_URL}/v1/otp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileNumber, otp: code }),
      });
      if (res.ok) {
		const data = await res.json();
		console.log(`UserId: ${data.id}`);
        await makeCallToOwner(data.id);
        setShowModal(false);
      } else {
        alert('❌ Invalid OTP');
        setOtp(['', '', '', '']);
        document.getElementById('otp-0')?.focus();
      }
    } catch {
      alert('Verification error');
    } finally {
      setIsVerifying(false);
    }
  };

  const makeCallToOwner = async (userId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/v1/call`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: ownerId, mobileNumber, capturedImage }),
      });
      if (res.ok && (await uploadCapturedImage())) {
		  const data = await res.json();
        setShowSuccessDialog(true);
        //setTimeout(() => (window.location.href = '/home'), 3000);
		navigate("/thank-you", { state: { userId, mobileNumber } });
      } else {
        const data = await res.json();
        alert(`❌ ${data.message}`);
      }
    } catch {
      alert('Call failed.');
    }
  };

  const uploadCapturedImage = async () => {
    if (!capturedImage) return false;
    const resized = await resizeBase64Image(capturedImage);
    const imageBlob = base64ToBlob(resized);
    const formData = new FormData();
    formData.append('file', imageBlob, 'captured.jpg');

    const res = await fetch(`${API_BASE_URL}/v1/files/upload`, {
      method: 'POST',
      body: formData,
    });
    return res.ok;
  };

  return (
    <div className="container min-vh-100 bg-light">
      <div className="py-3 d-flex justify-content-between align-items-center border-bottom">
        <h1 className="mb-0">myco</h1>
        <CaptureSection {...{ handleCapture, fileInputRef, handleImageChange }} />
      </div>

      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <div className="card shadow p-4" style={{ maxWidth: '400px', width: '100%' }}>
          <h6 className="text-success text-center mb-4">Capture Photo</h6>
          {capturedImage && (
            <div className="mb-3 text-center">
              <img src={capturedImage} alt="Captured" className="img-fluid rounded" />
            </div>
          )}
          <div className="d-grid gap-3">
		  
			  {capturedImage && !isUploaded && (
				  <button className="btn btn-primary" onClick={handleUploadClick}>
					⬆️ Upload Photo
				  </button>
				)}


		  
            {isUploaded && (
				<button className="btn btn-danger" onClick={handleButtonClick}>
				  📞 Emergency Call
				</button>
			  )}
          </div>
        </div>
      </div>

      <EmergencyModal
        {...{
          showModal,
          setShowModal,
          otpStarted,
          mobileNumber,
          setMobileNumber,
          sendOtpToMobile,
          otp,
          handleOtpChange,
          verifyOtpWithApi,
          isSendingOtp,
          isVerifying,
          resendTimer,
        }}
      />
    </div>
  );
};

export default ScanPage;
