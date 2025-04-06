import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const QrCodePage = () => {
  const [qrImage, setQrImage] = useState(null);
  const navigate = useNavigate();
  const userId = "3172b0e7-a538-4085-8cf8-fe7fae1b07ce"; // replace with real user ID (from login context, token, etc.)


  useEffect(() => {
    const fetchQrCode = async () => {
      try {
        const response = await fetch(`http://localhost:8081/v1/qr/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch QR code");
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setQrImage(imageUrl);
      } catch (err) {
        console.error(err);
        alert("Error fetching QR code");
      }
    };

    fetchQrCode();
  }, [userId]);

  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      {/* Header with Home Button */}
      <header className="bg-primary text-white py-3 shadow-sm sticky-top">
        <div className="container d-flex justify-content-between align-items-center">
          <h4 className="mb-0">My QR Code</h4>
          <button
            className="btn btn-outline-light rounded-circle p-2 d-flex align-items-center justify-content-center"
            onClick={() => navigate("/home")}
			style={{ width: "40px", height: "40px" }}
            aria-label="Home"
          >
			  <i className="bi bi-house-door-fill fs-4"></i>
		  </button>
        </div>
      </header>

      {/* QR Code Display */}
      <div className="p-4 bg-light rounded shadow-sm">
		  {qrImage ? (
			<img src={qrImage} alt="User QR Code" className="img-fluid" style={{ maxWidth: "300px" }} />
		  ) : (
			<p>Loading QR code...</p>
		  )}
	  </div>
    </div>
  );
};

export default QrCodePage;
