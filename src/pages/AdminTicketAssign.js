import { useEffect, useState } from "react";
import API from "../api";

function AdminTickets() {
  const [tickets, setTickets] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [selectedTech, setSelectedTech] = useState({});
  const [filter, setFilter] = useState("ALL");

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
      alert(err.response?.data?.error || "Assign failed");
    }
  };

  const closeTicket = async (ticketId) => {
    if (!window.confirm("Are you sure you want to close this ticket?")) return;
    try {
      await API.post(`tickets/${ticketId}/close/`);
      alert("Ticket closed successfully");
      loadTickets();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to close ticket");
    }
  };

  const filteredTickets = tickets.filter((t) => {
    if (filter === "PENDING") return t.status === "OPEN" || t.status === "IN_PROGRESS";
    if (filter === "RESOLVED") return t.status === "RESOLVED";
    if (filter === "CLOSED") return t.status === "CLOSED";
    return true;
  });

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Ticket Assignment</h1>
        <p>Assign technicians to support tickets</p>
      </header>

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
        {[
          { key: "ALL", label: `All (${tickets.length})` },
          { key: "PENDING", label: `Active (${tickets.filter((t) => t.status === "OPEN" || t.status === "IN_PROGRESS").length})` },
          { key: "RESOLVED", label: `Resolved (${tickets.filter((t) => t.status === "RESOLVED").length})` },
          { key: "CLOSED", label: `Closed (${tickets.filter((t) => t.status === "CLOSED").length})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            style={{
              padding: "6px 14px",
              borderRadius: "8px",
              border: filter === tab.key ? "1px solid #2563eb" : "1px solid #cbd5e1",
              background: filter === tab.key ? "#2563eb" : "#ffffff",
              color: filter === tab.key ? "#ffffff" : "#475569",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="ticket-grid">
        {filteredTickets.map((t) => (
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

            {/* Footer: Only show Assign dropdown when NOT resolved or closed */}
            <div className="card-footer">
              {t.status === "OPEN" || t.status === "IN_PROGRESS" ? (
                <>
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
                    {t.status === "IN_PROGRESS" ? "Re-assign" : "Assign"}
                  </button>
                </>
              ) : t.status === "RESOLVED" ? (
                <div style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#16a34a", fontSize: "14px", fontWeight: "600" }}>✓ Resolved</span>
                  <button
                    onClick={() => closeTicket(t.id)}
                    style={{ background: "#2563eb", color: "#fff", padding: "8px 14px", borderRadius: "6px", border: "none", cursor: "pointer" }}
                  >
                    Close Ticket
                  </button>
                </div>
              ) : (
                <div style={{ color: "#64748b", fontSize: "14px", fontWeight: "600", padding: "6px 0" }}>
                  ✓ Ticket Closed
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminTickets;
