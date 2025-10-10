import { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function SuperadminDashboard() {
  const [pendingAdmins, setPendingAdmins] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [adminLogs, setAdminLogs] = useState([]);
  const [studentLogs, setStudentLogs] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [userFilter, setUserFilter] = useState("all");
  const [eventFilter, setEventFilter] = useState("all");
  const API = "http://localhost:5000/api";

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "superadmin") {
      alert("Access denied. Superadmin only.");
      return;
    }
    loadPendingUsers();
    loadAllUsers();
    loadAllEvents();
    loadActivityLogs();
  }, []);

  const loadPendingUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/superadmin/pending-users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPendingAdmins(res.data);
    } catch (err) {
      console.error("Failed to load pending users", err);
    }
  };

  const loadAllUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/superadmin/all-users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAllUsers(res.data);
    } catch (err) {
      console.error("Failed to load all users", err);
    }
  };

  const loadAllEvents = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/superadmin/all-events`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAllEvents(res.data);
    } catch (err) {
      console.error("Failed to load all events", err);
    }
  };

  const loadActivityLogs = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/superadmin/activity-logs`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAdminLogs(res.data.adminLogs || []);
      setStudentLogs(res.data.studentLogs || []);
    } catch (err) {
      console.error("Failed to load activity logs", err);
    }
  };

  const approveUser = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API}/superadmin/approve-user/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("✅ User approved successfully!");
      loadPendingUsers();
      loadAllUsers();
    } catch {
      alert("❌ Failed to approve user");
    }
  };

  const rejectUser = async (userId) => {
    if (window.confirm("Are you sure you want to reject this user?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${API}/superadmin/reject-user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("✅ User rejected successfully!");
        loadPendingUsers();
        loadAllUsers();
      } catch {
        alert("❌ Failed to reject user");
      }
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${API}/superadmin/delete-user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("✅ User deleted successfully!");
        loadAllUsers();
      } catch {
        alert("❌ Failed to delete user");
      }
    }
  };

  const deleteEvent = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${API}/superadmin/delete-event/${eventId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("✅ Event deleted successfully!");
        loadAllEvents();
      } catch {
        alert("❌ Failed to delete event");
      }
    }
  };

  // ======== Styles =========
  const containerStyle = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 50%, #bfdbfe 100%)",
    padding: "20px",
  };

  const cardStyle = {
    background: "white",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "20px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  };

  const buttonStyle = {
    padding: "8px 16px",
    margin: "0 5px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
  };

  const approveButtonStyle = {
    ...buttonStyle,
    background: "#48bb78",
    color: "white",
  };

  const rejectButtonStyle = {
    ...buttonStyle,
    background: "#f56565",
    color: "white",
  };

  const tabStyle = {
    padding: "10px 20px",
    margin: "0 5px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
  };

  // ========== Statistics Data ==========
  const categoryCounts = allEvents.reduce((acc, ev) => {
    acc[ev.category] = (acc[ev.category] || 0) + 1;
    return acc;
  }, {});

  const statsData = {
    labels: Object.keys(categoryCounts),
    datasets: [
      {
        label: "Number of Events",
        data: Object.values(categoryCounts),
        backgroundColor: "#667eea",
      },
    ],
  };

  return (
    <div style={containerStyle}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{ textAlign: "center", marginBottom: "30px", fontSize: "2.5rem", color: "#2d3748" }}>
          🔧 Superadmin Dashboard
        </h1>

        {/* Tabs */}
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          {[
            { key: "pending", label: `Pending Admins (${pendingAdmins.length})` },
            { key: "users", label: `All Users (${allUsers.length})` },
            { key: "events", label: `All Events (${allEvents.length})` },
            { key: "stats", label: "Event Statistics" },
            { key: "logs", label: "Activity Logs" },
          ].map((tab) => (
            <button
              key={tab.key}
              style={{
                ...tabStyle,
                background: activeTab === tab.key ? "#667eea" : "#f7fafc",
                color: activeTab === tab.key ? "white" : "#4a5568",
              }}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* === Existing Tabs (Pending, Users, Events) remain same === */}
        {activeTab === "pending" && (
          <div style={cardStyle}>
            <h2 style={{ marginBottom: "20px" }}>⏳ Pending Admin Approvals</h2>
            {pendingAdmins.length === 0 ? (
              <p style={{ textAlign: "center", color: "#718096" }}>No pending admin approvals</p>
            ) : (
              pendingAdmins.map((user) => (
                <div key={user._id} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "15px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  marginBottom: "10px",
                }}>
                  <div>
                    <h3>{user.name}</h3>
                    <p>{user.email} - {user.role} - {user.college}</p>
                  </div>
                  <div>
                    <button style={approveButtonStyle} onClick={() => approveUser(user._id)}>✅ Approve</button>
                    <button style={rejectButtonStyle} onClick={() => rejectUser(user._id)}>❌ Reject</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "users" && (
          <div style={cardStyle}>
            {/* ...existing user list code... */}
          </div>
        )}

        {activeTab === "events" && (
          <div style={cardStyle}>
            {/* ...existing events code... */}
          </div>
        )}

        {/* === Event Statistics UI === */}
        {activeTab === "stats" && (
          <div style={cardStyle}>
            <h2 style={{ marginBottom: "20px", color: "#2d3748" }}>📊 Event Statistics Overview</h2>
            <div style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "20px",
              marginBottom: "30px",
            }}>
              <div style={{ flex: "1", background: "#ebf8ff", padding: "20px", borderRadius: "10px" }}>
                <h3>Total Events</h3>
                <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#2b6cb0" }}>{allEvents.length}</p>
              </div>
              <div style={{ flex: "1", background: "#f0fff4", padding: "20px", borderRadius: "10px" }}>
                <h3>Total Users</h3>
                <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#38a169" }}>{allUsers.length}</p>
              </div>
              <div style={{ flex: "1", background: "#fffaf0", padding: "20px", borderRadius: "10px" }}>
                <h3>Pending Admins</h3>
                <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#dd6b20" }}>{pendingAdmins.length}</p>
              </div>
            </div>
            <Bar data={statsData} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />
          </div>
        )}

        {/* === Activity Logs === */}
        {activeTab === "logs" && (
          <div style={cardStyle}>
            <h2 style={{ marginBottom: "20px", color: "#2d3748" }}>🧾 Admin & Student Activity Logs</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              {/* Admin Logs */}
              <div style={{ background: "#ebf8ff", borderRadius: "8px", padding: "15px" }}>
                <h3 style={{ marginBottom: "10px" }}>🧑‍💼 Admin Activity</h3>
                {adminLogs.length === 0 ? (
                  <p style={{ color: "#718096" }}>No recent admin activity</p>
                ) : (
                  adminLogs.map((log, i) => (
                    <p key={i} style={{ margin: "5px 0", color: "#2d3748" }}>
                      <b>{log.adminName}</b>: {log.action} ({new Date(log.time).toLocaleString()})
                    </p>
                  ))
                )}
              </div>

              {/* Student Logs */}
              <div style={{ background: "#fefcbf", borderRadius: "8px", padding: "15px" }}>
                <h3 style={{ marginBottom: "10px" }}>🎓 Student Activity</h3>
                {studentLogs.length === 0 ? (
                  <p style={{ color: "#718096" }}>No recent student activity</p>
                ) : (
                  studentLogs.map((log, i) => (
                    <p key={i} style={{ margin: "5px 0", color: "#2d3748" }}>
                      <b>{log.studentName}</b>: {log.action} ({new Date(log.time).toLocaleString()})
                    </p>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
