import { useEffect, useState } from "react";
import API from "../api";

function AssignAsset() {
  const [assets, setAssets] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [asset, setAsset] = useState("");
  const [employee, setEmployee] = useState("");

  useEffect(() => {
    API.get("assets/").then(res => setAssets(res.data));
    API.get("employees/").then(res => setEmployees(res.data));
  }, []);

  const assign = () => {
    API.post("assignments/", {
      asset,
      employee
    })
      .then(() => alert("Asset assigned successfully"))
      .catch(() => alert("Error assigning asset"));
  };

 return (
  <div className="assign-container">
    <div className="assign-header">
      <h2>Assign Asset</h2>
      <p>Allocate company assets to employees securely</p>
    </div>

    <div className="assign-card">
      <div className="form-group">
        <label>Asset</label>
        <select value={asset} onChange={(e) => setAsset(e.target.value)}>
          <option value="">Select Asset</option>
          {assets.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Employee</label>
        <select value={employee} onChange={(e) => setEmployee(e.target.value)}>
          <option value="">Select Employee</option>
          {employees.map((e) => (
            <option key={e.id} value={e.id}>
              {e.email}
            </option>
          ))}
        </select>
      </div>

      <div className="form-actions">
        <button
          className="primary-btn"
          disabled={!asset || !employee}
          onClick={assign}
        >
          Assign Asset
        </button>
      </div>
    </div>
  </div>
);
}

export default AssignAsset;