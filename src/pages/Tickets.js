import { useEffect, useState } from "react";
import API from "../api";

function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [issue, setIssue] = useState("");
  const [asset, setAsset] = useState("");
  const [assets, setAssets] = useState([]);

  const role = localStorage.getItem("role");

  useEffect(() => {
    loadTickets();

    if (role === "EMPLOYEE") {
      API.get("assets/").then((res) => setAssets(res.data));
    }
  }, []);

  const loadTickets = () => {
    API.get("tickets/").then((res) => setTickets(res.data));
  };

  const submitTicket = (e) => {
    e.preventDefault();

    API.post("tickets/", {
      asset,
      issue,
    })
      .then(() => {
        alert("Ticket raised successfully");
        setShowForm(false);
        setIssue("");
        setAsset("");
        loadTickets();
      })
      .catch(() => alert("Failed to raise ticket"));
  };

  // 🔹 Technician marks ticket as resolved
  const markAsResolved = (ticketId) => {
    API.post(`tickets/${ticketId}/resolve/`)
      .then(() => {
        alert("Ticket marked as resolved");
        loadTickets();
      })
      .catch(() => alert("Failed to update ticket"));
  };

  return (
    <div className="tickets-page">
      <h2 className="page-title">Repair Tickets</h2>

      {/* EMPLOYEE ONLY – Raise Ticket Button */}
      {role === "EMPLOYEE" && (
        <button
          className="primary-btn"
          onClick={() => setShowForm(!showForm)}
        >
          + Raise Ticket
        </button>
      )}

      {/* Raise Ticket Form */}
      {showForm && role === "EMPLOYEE" && (
        <form className="ticket-form" onSubmit={submitTicket}>
          <select
            required
            value={asset}
            onChange={(e) => setAsset(e.target.value)}
          >
            <option value="">Select Asset</option>
            {assets.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>

          <textarea
            placeholder="Describe the issue"
            value={issue}
            required
            onChange={(e) => setIssue(e.target.value)}
          />

          <button type="submit">Submit Ticket</button>
        </form>
      )}

      {/* Tickets List */}
      <div className="tickets-grid">
        {tickets.map((t) => (
          <div key={t.id} className="ticket-card">
            <h3>{t.issue}</h3>

            <p className="asset">
              <strong>Asset:</strong> {t.asset_name || "—"}
            </p>

            <span className={`ticket-status ${t.status.toLowerCase()}`}>
              {t.status}
            </span>

            {/* 🔹 TECHNICIAN ONLY – Repair Completed Button */}
            {role === "TECHNICIAN" && t.status === "IN_PROGRESS" && (
              <button
                className="btn-success"
                onClick={() => markAsResolved(t.id)}
              >
                Repair Completed
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Tickets;
