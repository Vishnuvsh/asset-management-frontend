import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (!role) return null; // Not logged in → no navbar

  return (
    <nav style={styles.nav}>
      <h3 style={styles.logo}>Asset System</h3>

      <div style={styles.links}>
        <Link to="/dashboard">Dashboard</Link>

        {(role === "ADMIN" || role === "EMPLOYEE") && (
          <Link to="/assets">Assets</Link>
        )}

        {role === "ADMIN" && (
          <Link to="/inventory">Inventory</Link>
        )}

        {(role === "ADMIN" || role === "EMPLOYEE" || role === "TECHNICIAN") && (
          <Link to="/tickets">Tickets</Link>
        )}

        <button onClick={logout} style={styles.logout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 24px",
    background: "#1e293b",
    color: "#fff",
  },
  logo: {
    margin: 0,
  },
  links: {
    display: "flex",
    gap: "16px",
    alignItems: "center",
  },
  logout: {
    background: "#ef4444",
    border: "none",
    padding: "6px 12px",
    color: "#fff",
    cursor: "pointer",
  },
};

export default Navbar;
