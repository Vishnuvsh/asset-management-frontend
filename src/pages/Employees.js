import { useEffect, useState } from "react";
import API from "../api";

function Employees() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    API.get("employees/")
      .then(res => setEmployees(res.data))
      .catch(() => alert("Access denied"));
  }, []);

  return (
    <div className="page">
      <h2>Employees</h2>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>

          <tbody>
            {employees.map(emp => (
              <tr key={emp.id}>
                <td>{emp.id}</td>
                <td>{emp.email}</td>
                <td>{emp.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Employees;
