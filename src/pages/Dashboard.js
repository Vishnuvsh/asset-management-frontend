import { useEffect, useState } from "react";
import API from "../api";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#f59e0b", "#ef4444", "#22c55e"];

function Dashboard() {
  const role = localStorage.getItem("role");
  const [data, setData] = useState(null);

  useEffect(() => {
    API.get("dashboard/")
      .then((res) => setData(res.data))
      .catch(() => alert("Dashboard data load failed"));
  }, []);

  if (!data) return <p>Loading dashboard...</p>;

  /* ================= ADMIN CHART DATA ================= */
  const assetData = data.asset_chart
    ? [
        { name: "AVAILABLE", value: data.asset_chart.AVAILABLE },
        { name: "ASSIGNED", value: data.asset_chart.ASSIGNED },
        { name: "UNDER_REPAIR", value: data.asset_chart.UNDER_REPAIR },
        { name: "RETIRED", value: data.asset_chart.RETIRED },
      ]
    : [];

  const ticketData = data.ticket_chart
    ? [
        { name: "Open", value: data.ticket_chart.OPEN },
        { name: "In Progress", value: data.ticket_chart.IN_PROGRESS },
        { name: "Closed", value: data.ticket_chart.CLOSED },
      ]
    : [];

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Dashboard</h2>

      {/* ================= ADMIN DASHBOARD ================= */}
      {role === "ADMIN" && (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <h4>Total Assets</h4>
              <h1>{data.total_assets}</h1>
              <p>All company assets</p>
            </div>

            <div className="stat-card">
              <h4>Total Inventory Items</h4>
              <h1>{data.inventory_items}</h1>
              <p>Items in stock</p>
            </div>

            <div className="stat-card">
              <h4>Assigned Assets</h4>
              <h1>{data.assigned_assets}</h1>
              <p>Currently in use</p>
            </div>

          </div>

          <div className="charts-grid">
            <div className="chart-card">
              <h3>Assets Overview</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={assetData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="value"
                    fill="#7c3aed"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card">
              <h3>Tickets Status</h3>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={ticketData}
                    dataKey="value"
                    innerRadius={60}
                    outerRadius={100}
                  >
                    {ticketData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {/* ================= EMPLOYEE DASHBOARD ================= */}
      {role === "EMPLOYEE" && (
        <div className="stats-grid">
          <div className="stat-card">
            <h4>My Assets</h4>
            <h1>{data.my_assets}</h1>
            <p>Assigned to me</p>
          </div>

          <div className="stat-card">
            <h4>My Tickets</h4>
            <h1>{data.my_tickets}</h1>
            <p>Reported issues</p>
          </div>
        </div>
      )}

      {/* ================= TECHNICIAN DASHBOARD ================= */}
      {role === "TECHNICIAN" && (
        <div className="stats-grid">
          <div className="stat-card">
            <h4>Assigned Tickets</h4>
            <h1>{data.assigned_tickets}</h1>
            <p>Repairs assigned</p>
          </div>

          <div className="stat-card warning">
            <h4>Pending Repairs</h4>
            <h1>{data.pending_repairs}</h1>
            <p>Needs action</p>
          </div>

          <div className="stat-card">
            <h4>Completed Repairs</h4>
            <h1>{data.completed_repairs}</h1>
            <p>Finished tickets</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
