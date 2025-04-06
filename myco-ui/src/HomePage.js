import React, { useEffect, useState } from "react";

const HomePage = () => {
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [helpContacts, setHelpContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  const userId = "3172b0e7-a538-4085-8cf8-fe7fae1b07ce"; // replace with real user ID (from login context, token, etc.)

	useEffect(() => {
		fetchContacts();
	}, []);
  
    const fetchContacts = async () => {
      try {
        const res = await fetch(`http://localhost:8081/v1/contacts/${userId}`);
        if (!res.ok) throw new Error("Failed to fetch contacts");
        const data = await res.json();
		console.log(data);

        const emergency = data.filter((c) => c.contactType === "EMERGENCY");
        const family = data.filter((c) => c.contactType === "FAMILY");

        setEmergencyContacts(emergency);
        setHelpContacts(family);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

  
    const handleDelete = async (contactId) => {
    const confirmed = window.confirm("Are you sure you want to delete this contact?");
    if (!confirmed) return;

    try {
      const res = await fetch(`http://localhost:8081/v1/contacts/${contactId}`, {
        method: "DELETE"
      });
      if (!res.ok) throw new Error("Failed to delete contact");

      // Remove from local state
      setEmergencyContacts((prev) => prev.filter((c) => c.id !== contactId));
      setHelpContacts((prev) => prev.filter((c) => c.id !== contactId));
	  
	      // Show toast
		const toastEl = document.getElementById("deleteToast");
		const toast = new window.bootstrap.Toast(toastEl);
		toast.show();

    } catch (err) {
      alert(err.message);
    }
  };

  const renderContactCard = (contact) => (
    <div className="card mb-2 shadow-sm" key={contact.id} style={{ borderRadius: "1rem" }}>
      <div className="card-body">
        <h5 className="card-title mb-1">{contact.contactNumber}</h5>
        <p className="card-text text-muted mb-0">{contact.contactName}</p>
		{/* Delete icon */}
		<button
		  className="btn position-absolute top-0 end-0 m-2 text-muted"
		  onClick={() => handleDelete(contact.id)}
		  title="Delete Contact"
		>
		  <i className="bi bi-trash-fill"></i>
		</button>
      </div>
    </div>
  );

  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      {/* Header */}
      <header className="bg-primary text-white py-3 shadow-sm sticky-top">
        <div className="container d-flex justify-content-between align-items-center">
          <h4 className="mb-0">My Contacts</h4>
          <button
            className="btn btn-outline-light rounded-circle p-2 d-flex align-items-center justify-content-center"
            style={{ width: "40px", height: "40px" }}
            aria-label="QR Code"
          >
            <i className="bi bi-qr-code-scan"></i>
          </button>
        </div>
      </header>
	  
	  {/* Floating Add Button */}
		<button
		  className="btn btn-primary rounded-circle position-fixed shadow"
		  style={{
			bottom: "20px",
			right: "20px",
			width: "56px",
			height: "56px",
			zIndex: 1050,
		  }}
		  data-bs-toggle="modal"
		  data-bs-target="#addContactModal"
		  title="Add Contact"
		>
		  <i className="bi bi-plus-lg fs-4"></i>
		</button>

      {/* Main Content */}
      <main className="container py-4 flex-grow-1">

        {loading && <p>Loading contacts...</p>}
        {error && <p className="text-danger">{error}</p>}

        {!loading && !error && (
          <>
            {/* Emergency Contacts */}
            <section className="mb-4">
              <h4 className="text-muted">Emergency</h4>
              {emergencyContacts.length === 0 ? (
                <p className="text-muted">No emergency contacts found.</p>
              ) : (
                emergencyContacts.map(renderContactCard)
              )}
            </section>

            {/* Family Contacts */}
            <section>
              <h4 className="text-muted">Family</h4>
              {helpContacts.length === 0 ? (
                <p className="text-muted">No family contacts found.</p>
              ) : (
                helpContacts.map(renderContactCard)
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
};

//toast notification
	<div
	  className="toast-container position-fixed bottom-0 end-0 p-3"
	  style={{ zIndex: 9999 }}
	>
	  <div
		id="deleteToast"
		className="toast align-items-center text-bg-danger border-0"
		role="alert"
		aria-live="assertive"
		aria-atomic="true"
	  >
		<div className="d-flex">
		  <div className="toast-body">
			Contact deleted successfully!
		  </div>
		  <button
			type="button"
			className="btn-close btn-close-white me-2 m-auto"
			data-bs-dismiss="toast"
			aria-label="Close"
		  ></button>
		</div>
	  </div>
	</div>

export default HomePage;
