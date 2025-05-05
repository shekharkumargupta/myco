import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "./config";

const SignUpPage = () => {
  const [username, setUsername] = useState("");
  const [mobile, setMobile] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ✅ Redirect if userId exists in sessionStorage
  useEffect(() => {
    const existingUserId = sessionStorage.getItem("userId");
    if (existingUserId) {
      navigate("/home");
    }
  }, [navigate]);

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError("Please enter your name.");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleMobileSubmit = async (e) => {
    e.preventDefault();

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(mobile)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/v1/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: username, mobileNumber: mobile }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Something went wrong!");
      }

      const data = await response.json();
      const userId = data.id;

      // ✅ Store userId in sessionStorage
      sessionStorage.setItem("userId", userId);

      // ✅ Navigate to OTP screen
      navigate("/otp", { state: { userId, mobile } });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-lg p-4" style={{ width: "100%", maxWidth: "400px", borderRadius: "1rem" }}>
        <h3 className="text-center mb-4">Sign Up</h3>

        {step === 1 && (
          <form onSubmit={handleUsernameSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Name</label>
              <input
                type="text"
                id="username"
                className={`form-control ${error ? "is-invalid" : ""}`}
                placeholder="Enter your name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              {error && <div className="invalid-feedback">{error}</div>}
            </div>
            <button type="submit" className="btn btn-primary w-100">Continue</button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleMobileSubmit}>
            <div className="mb-3">
              <label htmlFor="mobile" className="form-label">Mobile Number</label>
              <input
                type="tel"
                id="mobile"
                className={`form-control ${error ? "is-invalid" : ""}`}
                placeholder="Enter 10-digit mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
              {error && <div className="invalid-feedback">{error}</div>}
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignUpPage;
