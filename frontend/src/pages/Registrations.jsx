import { useState, useEffect } from "react";

function Registrations() {
  const [registrations, setRegistrations] = useState([]);
  const [allRegistrations, setAllRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending"); // pending, approved, rejected, all

  useEffect(() => {
    fetchRegistrations();
  }, []);

  // Update filtered data when filter changes
  useEffect(() => {
    if (allRegistrations.length > 0) {
      const filteredData = filter === "all" ? allRegistrations : 
        allRegistrations.filter(reg => reg.status === filter);
      setRegistrations(filteredData);
    }
  }, [filter, allRegistrations]);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      // Always get all registrations, then filter on frontend
      const response = await fetch("http://localhost:5000/api/admin/registrations", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        
        // Store all data for counting
        setAllRegistrations(data);
        
        // Filter based on selected tab
        const filteredData = filter === "all" ? data : 
          data.filter(reg => reg.status === filter);
        
        setRegistrations(filteredData);
      } else {
        console.error("Failed to fetch registrations");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (registrationId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/admin/registrations/${registrationId}/approve`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        alert("Registration approved successfully!");
        fetchRegistrations(); // Refresh the list
      } else {
        alert("Failed to approve registration");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error approving registration");
    }
  };

  const handleReject = async (registrationId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/admin/registrations/${registrationId}/reject`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        alert("Registration rejected successfully!");
        fetchRegistrations(); // Refresh the list
      } else {
        alert("Failed to reject registration");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error rejecting registration");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved": return "#27ae60";
      case "rejected": return "#e74c3c";
      case "pending": return "#f39c12";
      default: return "#95a5a6";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <h2>Loading registrations...</h2>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1>📋 Registration Management</h1>
        <p>Manage student registrations for your events</p>
      </div>

      {/* Filter Tabs */}
      <div style={filterContainerStyle}>
        {["pending", "approved", "rejected", "all"].map((filterType) => {
          // Calculate count from allRegistrations, not filtered registrations
          const count = filterType === "all" 
            ? allRegistrations.length 
            : allRegistrations.filter(r => r.status === filterType).length;
          
          return (
            <button
              key={filterType}
              style={{
                ...filterButtonStyle,
                backgroundColor: filter === filterType ? "#0996e6" : "#ecf0f1",
                color: filter === filterType ? "white" : "#2c3e50",
              }}
              onClick={() => setFilter(filterType)}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              {filterType !== "all" ? ` (${count})` : ""}
            </button>
          );
        })}
      </div>

      {/* Registrations List */}
      {registrations.length === 0 ? (
        <div style={noDataStyle}>
          <h3>No {filter === "all" ? "" : filter} registrations found</h3>
          <p>Students haven't registered for your events yet.</p>
        </div>
      ) : (
        <div style={gridStyle}>
          {registrations.map((registration) => (
            <div key={registration._id} style={cardStyle}>
              {/* Status Badge */}
              <div 
                style={{
                  ...statusBadgeStyle,
                  backgroundColor: getStatusColor(registration.status)
                }}
              >
                {registration.status.toUpperCase()}
              </div>

              {/* Student Info */}
              <div style={sectionStyle}>
                <h3 style={{ margin: "0 0 0.5rem 0", color: "#2c3e50" }}>
                  👤 {registration.student.name}
                </h3>
                <p style={{ margin: "0", color: "#7f8c8d", fontSize: "0.9rem" }}>
                  📧 {registration.student.email}
                </p>
              </div>

              {/* Event Info */}
              <div style={sectionStyle}>
                <h4 style={{ margin: "0 0 0.5rem 0", color: "#34495e" }}>
                  🎉 {registration.event.title}
                </h4>
                <p style={{ margin: "0", color: "#7f8c8d", fontSize: "0.85rem" }}>
                  📅 Category: {registration.event.category}
                </p>
                <p style={{ margin: "0", color: "#7f8c8d", fontSize: "0.85rem" }}>
                  🗓️ Event Date: {formatDate(registration.event.startDate)}
                </p>
              </div>

              {/* Registration Details */}
              <div style={sectionStyle}>
                <p style={{ margin: "0", color: "#95a5a6", fontSize: "0.8rem" }}>
                  Registered: {formatDate(registration.registeredAt)}
                </p>
                {registration.approvedAt && (
                  <p style={{ margin: "0", color: "#27ae60", fontSize: "0.8rem" }}>
                    Approved: {formatDate(registration.approvedAt)}
                  </p>
                )}
                {registration.rejectedAt && (
                  <p style={{ margin: "0", color: "#e74c3c", fontSize: "0.8rem" }}>
                    Rejected: {formatDate(registration.rejectedAt)}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              {registration.status === "pending" && (
                <div style={buttonContainerStyle}>
                  <button
                    style={{ ...actionButtonStyle, backgroundColor: "#27ae60" }}
                    onClick={() => handleApprove(registration._id)}
                  >
                    ✅ Approve
                  </button>
                  <button
                    style={{ ...actionButtonStyle, backgroundColor: "#e74c3c" }}
                    onClick={() => handleReject(registration._id)}
                  >
                    ❌ Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Styles
const containerStyle = {
  padding: "2rem",
  maxWidth: "1200px",
  margin: "0 auto",
  fontFamily: "'Segoe UI', sans-serif",
};

const headerStyle = {
  textAlign: "center",
  marginBottom: "2rem",
  color: "#2c3e50",
};

const filterContainerStyle = {
  display: "flex",
  justifyContent: "center",
  gap: "1rem",
  marginBottom: "2rem",
  flexWrap: "wrap",
};

const filterButtonStyle = {
  padding: "0.75rem 1.5rem",
  border: "none",
  borderRadius: "25px",
  cursor: "pointer",
  fontWeight: "600",
  transition: "all 0.3s ease",
  fontSize: "0.9rem",
};

const noDataStyle = {
  textAlign: "center",
  padding: "3rem",
  color: "#7f8c8d",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
  gap: "1.5rem",
};

const cardStyle = {
  backgroundColor: "white",
  border: "1px solid #ecf0f1",
  borderRadius: "12px",
  padding: "1.5rem",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  position: "relative",
  transition: "transform 0.2s ease",
};

const statusBadgeStyle = {
  position: "absolute",
  top: "1rem",
  right: "1rem",
  padding: "0.25rem 0.75rem",
  borderRadius: "15px",
  color: "white",
  fontSize: "0.7rem",
  fontWeight: "bold",
};

const sectionStyle = {
  marginBottom: "1rem",
  paddingBottom: "0.75rem",
  borderBottom: "1px solid #ecf0f1",
};

const buttonContainerStyle = {
  display: "flex",
  gap: "0.75rem",
  marginTop: "1rem",
};

const actionButtonStyle = {
  flex: 1,
  padding: "0.75rem",
  border: "none",
  borderRadius: "8px",
  color: "white",
  cursor: "pointer",
  fontWeight: "600",
  transition: "opacity 0.3s ease",
  fontSize: "0.9rem",
};

export default Registrations;