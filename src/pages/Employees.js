import { useEffect, useState } from "react";
import API from "../api";

const emptyUser = {
  email: "",
  password: "",
  role: "EMPLOYEE",
};

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState(emptyUser);
  const [loading, setLoading] = useState(true);

  const fetchEmployees = () => {
    setLoading(true);
    API.get("employees/")
      .then((res) => setEmployees(res.data))
      .catch(() => alert("Access denied"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    setNewUser({
      ...newUser,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newUser.email || !newUser.password) {
      alert("Please fill in email and password");
      return;
    }

    API.post("employees/", newUser)
      .then(() => {
        alert("User created successfully!");
        setShowModal(false);
        setNewUser(emptyUser);
        fetchEmployees();
      })
      .catch((err) => {
        alert(JSON.stringify(err.response?.data || "Error creating user"));
      });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    API.delete(`employees/${id}/`)
      .then(() => fetchEmployees())
      .catch(() => alert("Error deleting user"));
  };

  return (
    <div className="page" style={{ padding: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2>Employees & Technicians</h2>
        <button
          className="btn primary"
          style={{ padding: "8px 16px", cursor: "pointer", borderRadius: "6px" }}
          onClick={() => setShowModal(true)}
        >
          + Add User
        </button>
      </div>

      <div className="table-card">
        {loading ? (
          <p style={{ padding: "16px" }}>Loading users...</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "1px solid #334155" }}>
                <th style={{ padding: "12px" }}>ID</th>
                <th style={{ padding: "12px" }}>Email</th>
                <th style={{ padding: "12px" }}>Role</th>
                <th style={{ padding: "12px" }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {employees.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", padding: "20px", color: "#94a3b8" }}>
                    No employees or technicians yet. Click "+ Add User" to create one!
                  </td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp.id} style={{ borderBottom: "1px solid #1e293b" }}>
                    <td style={{ padding: "12px" }}>{emp.id}</td>
                    <td style={{ padding: "12px" }}>{emp.email}</td>
                    <td style={{ padding: "12px" }}>
                      <span
                        style={{
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          fontWeight: "bold",
                          background: emp.role === "TECHNICIAN" ? "#0284c7" : "#059669",
                          color: "#fff",
                        }}
                      >
                        {emp.role}
                      </span>
                    </td>
                    <td style={{ padding: "12px" }}>
                      <button
                        style={{
                          background: "#ef4444",
                          color: "#fff",
                          border: "none",
                          padding: "6px 12px",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                        onClick={() => handleDelete(emp.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* CREATE USER MODAL */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal" style={{ maxWidth: "400px" }}>
            <h3>Create New User</h3>

            <form onSubmit={handleCreate}>
              <div className="form-group" style={{ marginBottom: "14px" }}>
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="e.g. employee@company.com"
                  value={newUser.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: "14px" }}>
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Set initial password"
                  value={newUser.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: "18px" }}>
                <label>Role</label>
                <select name="role" value={newUser.role} onChange={handleChange}>
                  <option value="EMPLOYEE">Employee</option>
                  <option value="TECHNICIAN">Technician</option>
                </select>
              </div>

              <div className="modal-actions" style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="primary">
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Employees;
