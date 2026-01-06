import { useEffect, useState } from "react";
import API from "../api";

function AdminTickets() {
  const [tickets, setTickets] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [selectedTech, setSelectedTech] = useState({});

  useEffect(() => {
    loadTickets();
    loadTechnicians();
  }, []);

  const loadTickets = async () => {
    try {
      const res = await API.get("tickets/");
      setTickets(res.data);
    } catch (err) {
      console.error("Tickets error", err);
    }
  };

  const loadTechnicians = async () => {
    try {
      const res = await API.get("technicians/");
      setTechnicians(res.data);
    } catch (err) {
      console.error("Technician error", err);
    }
  };

  const assignTechnician = async (ticketId) => {
    const techId = selectedTech[ticketId];
    console.log("Assigning technician:", techId);

    if (!techId) {
      alert("Please select a technician");
      return;
    }

    try {
      await API.post(`tickets/${ticketId}/assign/`, {
        technician_id: techId,
      });

      alert("Technician assigned successfully");
      loadTickets();
    } catch (err) {
      console.error(err.response?.data || err);
      alert("Assign failed");
    }
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Ticket Assignment</h1>
        <p>Assign technicians to support tickets</p>
      </header>

      <div className="ticket-grid">
        {tickets.map((t) => (
          <div key={t.id} className="ticket-card">
            <div className="card-top">
              <h3 className="issue-title">{t.issue}</h3>
              <span className={`status ${t.status.toLowerCase()}`}>
                {t.status}
              </span>
            </div>

            <div className="card-body">
              <div className="info-row">
                <span>Asset</span>
                <strong>{t.asset_name || "—"}</strong>
              </div>

              <div className="info-row">
  <span>Technician</span>
  <strong>{t.technician_email || "Not Assigned"}</strong>
</div>

            </div>

            <div className="card-footer">
              <select
                value={selectedTech[t.id] || ""}
                onChange={(e) =>
                  setSelectedTech({
                    ...selectedTech,
                    [t.id]: e.target.value,
                  })
                }
              >
                <option value="">Select Technician</option>
                {technicians.map((tech) => (
                  <option key={tech.id} value={tech.id}>
                    {tech.email}
                  </option>
                ))}
              </select>

              <button
                disabled={!selectedTech[t.id]}
                onClick={() => assignTechnician(t.id)}
              >
                Assign
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminTickets;
