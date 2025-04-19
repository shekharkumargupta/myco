import React from 'react';

const CaptureSection = ({ handleCapture, fileInputRef, handleImageChange }) => (
  <>
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
  </>
);

export default CaptureSection;
