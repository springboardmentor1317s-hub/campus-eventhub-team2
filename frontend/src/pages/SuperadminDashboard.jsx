//  Imports
import { useEffect, useState } from "react";
import axios from "axios";

export default function SuperadminDashboard() {
  //  State Variables
  const [pendingAdmins, setPendingAdmins] = useState([]); // Pending admin approvals
  const [allUsers, setAllUsers] = useState([]); // List of all users
  const [allEvents, setAllEvents] = useState([]); // List of all events
  const [activeTab, setActiveTab] = useState("pending"); // Current active tab (pending/users/events)
  const [userFilter, setUserFilter] = useState("all"); // Filter option for users
  const [eventFilter, setEventFilter] = useState("all"); // Filter option for events
  const API = "http://localhost:5000/api"; 

  
  // Checks superadmin access and loads users/events data
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "superadmin") {
      alert("Access denied. Superadmin only.");
      return;
    }
    loadPendingUsers();
    loadAllUsers();
    loadAllEvents();
  }, []);

  //  Load pending admin approval requests
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

  //  Load all users
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

  //  Approve user request
  const approveUser = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API}/superadmin/approve-user/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("✅ User approved successfully!");
      loadPendingUsers();
      loadAllUsers();
    } catch (err) {
      alert("❌ Failed to approve user");
    }
  };

  //  Reject user request
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
      } catch (err) {
        alert("❌ Failed to reject user");
      }
    }
  };

  // 🗑️ Delete user permanently
  const deleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${API}/superadmin/delete-user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("✅ User deleted successfully!");
        loadAllUsers();
      } catch (err) {
        alert("❌ Failed to delete user");
      }
    }
  };

  //  Delete event permanently
  const deleteEvent = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${API}/superadmin/delete-event/${eventId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("✅ Event deleted successfully!");
        loadAllEvents();
      } catch (err) {
        alert("❌ Failed to delete event");
      }
    }
  };

  //  Load all events
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

  //  Styling Objects
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

  //  JSX Return Section
  // Contains: Tabs for pending admins, all users, and all events
  return (
    <div style={containerStyle}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{ textAlign: "center", marginBottom: "30px", fontSize: "2.5rem", color: "#2d3748" }}>
          🔧 Superadmin Dashboard
        </h1>

        {/*  Tab Navigation */}
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <button
            style={{
              ...tabStyle,
              background: activeTab === "pending" ? "#667eea" : "#f7fafc",
              color: activeTab === "pending" ? "white" : "#4a5568",
            }}
            onClick={() => setActiveTab("pending")}
          >
            Pending Admins ({pendingAdmins.length})
          </button>
          <button
            style={{
              ...tabStyle,
              background: activeTab === "users" ? "#667eea" : "#f7fafc",
              color: activeTab === "users" ? "white" : "#4a5568",
            }}
            onClick={() => setActiveTab("users")}
          >
            All Users ({allUsers.length})
          </button>
          <button
            style={{
              ...tabStyle,
              background: activeTab === "events" ? "#667eea" : "#f7fafc",
              color: activeTab === "events" ? "white" : "#4a5568",
            }}
            onClick={() => setActiveTab("events")}
          >
            All Events ({allEvents.length})
          </button>
        </div>

        {/*  Pending Admins Tab */}
        {activeTab === "pending" && (
          <div style={cardStyle}>
            <h2 style={{ marginBottom: "20px", color: "#2d3748" }}>⏳ Pending Admin Approvals</h2>
            {pendingAdmins.length === 0 ? (
              <p style={{ textAlign: "center", color: "#718096" }}>No pending admin approvals</p>
            ) : (
              pendingAdmins.map((user) => (
                <div
                  key={user._id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "15px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    marginBottom: "10px",
                  }}
                >
                  <div>
                    <h3 style={{ margin: "0 0 5px 0", color: "#2d3748" }}>{user.name}</h3>
                    <p style={{ margin: "0", color: "#718096" }}>
                      {user.email} - {user.role} - {user.college}
                    </p>
                  </div>
                  <div>
                    <button
                      style={approveButtonStyle}
                      onClick={() => approveUser(user._id)}
                    >
                      ✅ Approve
                    </button>
                    <button
                      style={rejectButtonStyle}
                      onClick={() => rejectUser(user._id)}
                    >
                      ❌ Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/*  All Users Tab */}
        {activeTab === "users" && (
          <div style={cardStyle}>
            <h2 style={{ marginBottom: "20px", color: "#2d3748" }}>👥 All Users</h2>
            <div style={{ marginBottom: "20px", display: "flex", gap: "10px", alignItems: "center" }}>
              <label style={{ fontWeight: "600", color: "#4a5568" }}>Filter by Role:</label>
              <select
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1px solid #e2e8f0",
                  fontSize: "0.9rem",
                  cursor: "pointer",
                }}
              >
                <option value="all">All Users</option>
                <option value="student">Students</option>
                <option value="college_admin">College Admins</option>
                <option value="superadmin">Superadmins</option>
              </select>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "15px",
              }}
            >
              {allUsers
                .filter((user) => userFilter === "all" || user.role === userFilter)
                .map((user) => (
                  <div
                    key={user._id}
                    style={{
                      padding: "15px",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      background:
                        user.role === "superadmin"
                          ? "#f0fff4"
                          : user.role === "college_admin"
                          ? "#fef5e7"
                          : "#f7fafc",
                    }}
                  >
                    <h3 style={{ margin: "0 0 5px 0", color: "#2d3748" }}>{user.name}</h3>
                    <p style={{ margin: "0 0 5px 0", color: "#718096" }}>{user.email}</p>
                    <p style={{ margin: "0 0 5px 0", color: "#718096" }}>Role: {user.role}</p>
                    {user.college && (
                      <p style={{ margin: "0 0 5px 0", color: "#718096" }}>
                        College: {user.college}
                      </p>
                    )}
                    <div
                      style={{
                        display: "inline-block",
                        padding: "4px 8px",
                        borderRadius: "12px",
                        fontSize: "0.8rem",
                        fontWeight: "600",
                        background: user.isApproved ? "#48bb78" : "#f56565",
                        color: "white",
                        marginBottom: "10px",
                      }}
                    >
                      {user.isApproved ? "✅ Approved" : "⏳ Pending"}
                    </div>
                    {user.role !== "superadmin" && (
                      <div>
                        <button
                          style={{
                            ...rejectButtonStyle,
                            fontSize: "0.8rem",
                            padding: "6px 12px",
                          }}
                          onClick={() => deleteUser(user._id)}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* All Events Tab */}
        {activeTab === "events" && (
          <div style={cardStyle}>
            <h2 style={{ marginBottom: "20px", color: "#2d3748" }}>🎉 All Events</h2>
            <div style={{ marginBottom: "20px", display: "flex", gap: "10px", alignItems: "center" }}>
              <label style={{ fontWeight: "600", color: "#4a5568" }}>Filter by Category:</label>
              <select
                value={eventFilter}
                onChange={(e) => setEventFilter(e.target.value)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1px solid #e2e8f0",
                  fontSize: "0.9rem",
                  cursor: "pointer",
                }}
              >
                <option value="all">All Categories</option>
                <option value="Sports">Sports</option>
                <option value="Hackathon">Hackathon</option>
                <option value="Cultural">Cultural</option>
                <option value="Workshop">Workshop</option>
              </select>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
                gap: "20px",
              }}
            >
              {allEvents
                .filter((event) => eventFilter === "all" || event.category === eventFilter)
                .map((event) => (
                  <div
                    key={event._id}
                    style={{
                      background: "white",
                      borderRadius: "12px",
                      padding: "20px",
                      color: "#2d3748",
                      boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <h3
                      style={{
                        margin: "0 0 10px 0",
                        fontSize: "1.3rem",
                        color: "#2d3748",
                      }}
                    >
                      {event.title}
                    </h3>
                    <p style={{ margin: "0 0 8px 0", color: "#718096" }}>
                      📍 {event.location}
                    </p>
                    <p style={{ margin: "0 0 8px 0", color: "#718096" }}>
                      📅 {new Date(event.startDate).toLocaleDateString()}
                    </p>
                    <p style={{ margin: "0 0 8px 0", color: "#718096" }}>
                      🎨 {event.category}
                    </p>
                    <p
                      style={{
                        margin: "0 0 12px 0",
                        color: "#718096",
                        fontSize: "0.9rem",
                      }}
                    >
                      {event.description}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: "15px",
                        paddingTop: "15px",
                        borderTop: "1px solid #e2e8f0",
                      }}
                    >
                      <div>
                        <p style={{ margin: "0", fontSize: "0.8rem", color: "#718096" }}>
                          Created by:
                        </p>
                        <p style={{ margin: "0", fontWeight: "600", color: "#2d3748" }}>
                          {event.collegeId?.name}
                        </p>
                        <p style={{ margin: "0", fontSize: "0.8rem", color: "#718096" }}>
                          {event.collegeId?.college}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteEvent(event._id)}
                        style={{
                          background: "linear-gradient(135deg, #f56565 0%, #e53e3e 100%)",
                          color: "white",
                          border: "none",
                          padding: "8px 16px",
                          borderRadius: "8px",
                          fontSize: "0.9rem",
                          fontWeight: "600",
                          cursor: "pointer",
                          boxShadow: "0 4px 12px rgba(245, 101, 101, 0.3)",
                        }}
                      >
                        🗑️ Remove
                      </button>
                    </div>
                  </div>
                ))}
            </div>
            {allEvents.length === 0 && (
              <p
                style={{
                  textAlign: "center",
                  color: "#718096",
                  marginTop: "40px",
                }}
              >
                No events created yet
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
