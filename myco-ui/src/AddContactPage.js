import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const AddContactPage = () => {
  const [contactName, setContactName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [contactType, setContactType] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newContact = {
      name: contactName,
      contactNumber,
      type: contactType,
      userId: "your-user-id" // Replace this with real userId logic
    };

    try {
      const res = await fetch("http://localhost:8081/v1/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newContact)
      });

      if (!res.ok) throw new Error("Failed to add contact");

      alert("Contact added successfully!");
      navigate("/home");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <h2 className="mb-4 text-center">Add New Contact</h2>
      <form onSubmit={handleSubmit} className="border p-4 rounded shadow-sm bg-light">
        <div className="mb-3">
          <label className="form-label">Contact Name</label>
          <input
            type="text"
            className="form-control"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Contact Number</label>
          <input
            type="tel"
            className="form-control"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Contact Type</label>
          <select
            className="form-select"
            value={contactType}
            onChange={(e) => setContactType(e.target.value)}
            required
          >
            <option value="">Select Type</option>
            <option value="Emergency">Emergency</option>
            <option value="Help">Help</option>
          </select>
        </div>

        <div className="d-grid">
          <button type="submit" className="btn btn-primary">
            Save Contact
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddContactPage;
