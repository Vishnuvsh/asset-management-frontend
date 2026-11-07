import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (!role) return null;

  return (
    <aside className="sidebar">
      <div>
        <h2 className="sidebar-logo">AssetSys</h2>

        <nav className="sidebar-menu">
          <NavLink to="/dashboard" className="menu-item">
            <span>📊</span> Dashboard
          </NavLink>

          {(role === "ADMIN" || role === "EMPLOYEE") && (
            <NavLink to="/assets" className="menu-item">
              <span>💻</span> Assets
            </NavLink>
          )}

          {role === "ADMIN" && (
            <NavLink to="/inventory" className="menu-item">
              <span>📦</span> Inventory
            </NavLink>
          )}

          {role === "ADMIN" && (
            <NavLink to="/employees" className="menu-item">
              👥 Users
            </NavLink>
          )}

          {role === "ADMIN" && (
            <NavLink to="/assign-asset" className="menu-item">
              🔁 Assign Asset
            </NavLink>
          )}

         {role === "ADMIN" && (
  <NavLink to="/assign-tickets" className="menu-item">
    <span>🎫</span> Assign Tickets
  </NavLink>
)}


          <NavLink to="/profile" className="menu-item">
            👤 My Profile
          </NavLink>

          <NavLink to="/tickets" className="menu-item">
            <span>🛠️</span> Tickets
          </NavLink>
        </nav>
      </div>

      <button className="logout-btn" onClick={logout}>
        ⏻ Logout
      </button>
    </aside>
  );
}

export default Sidebar;
