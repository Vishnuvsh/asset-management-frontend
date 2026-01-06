import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Assets from "./pages/Assets";
import Inventory from "./pages/Inventory";
import Tickets from "./pages/Tickets";
import Employees from "./pages/Employees";
import AssignAsset from "./pages/AssignAsset";
import Profile from "./pages/Profile";
import AdminTicketAssign from "./pages/AdminTicketAssign";

import ProtectedRoute from "./ProtectedRoute";
import Layout from "./Layout";

function App() {
  return (
    <Router>
      <Routes>

        {/* Public Route */}
        <Route path="/" element={<Login />} />

        {/* Protected Layout */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/assets" element={<Assets />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/assign-asset" element={<AssignAsset />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/assign-tickets" element={<AdminTicketAssign />} />




        </Route>

      </Routes>
    </Router>
  );
}

export default App;


