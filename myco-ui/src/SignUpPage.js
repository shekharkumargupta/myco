import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "./config";


const SignUpPage = () => {
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

	const handleSubmit = async (e) => {
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
		  headers: {
			"Content-Type": "application/json"
		  },
		  body: JSON.stringify({ mobileNumber: mobile })
		});

		if (!response.ok) {
		  const data = await response.json();
		  throw new Error(data.message || "Something went wrong!");
		}

		const data = await response.json();
		const userId = data.id; // 👈 Make sure the backend returns this

		// ✅ Redirect with ID
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

        {submitted ? (
          <div className="alert alert-success text-center">
            Successfully signed up with <strong>{mobile}</strong>!
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="mobile" className="form-label">
                Mobile Number
              </label>
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

            <button type="submit" className="btn btn-primary w-100">
              Sign Up
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignUpPage;
