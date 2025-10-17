import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import TicketDownload from "../components/TicketDownload";
import CommentsSection from "../components/CommentsSection";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [justRegisteredId, setJustRegisteredId] = useState(null);
  const [sortOption, setSortOption] = useState("date");
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchTitle, setSearchTitle] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [registrationFilter, setRegistrationFilter] = useState("all");
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalRegistrations: 0,
    activeUsers: 0,
    pendingReviews: 0,
  });
  const [openCommentsId, setOpenCommentsId] = useState(null);
  const [eventStats, setEventStats] = useState([]);

  const navigate = useNavigate();
  const API = "http://localhost:5000/api";

  const loadEvents = async () => {
    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      
      let endpoint = `${API}/events`; // Default for students
      let headers = {};
      
      if (role === "college_admin") {
        endpoint = `${API}/events/my-events`; // Admin gets only their events
        headers = { Authorization: `Bearer ${token}` };
      }
      
      const res = await axios.get(endpoint, { headers });
      console.log("📅 Events loaded:", res.data);
      setEvents(res.data);
    } catch (err) {
      console.error("❌ Failed to load events", err);
    }
  };

  useEffect(() => {
    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");
    const role = localStorage.getItem("role");
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!name || !role || !token) {
      navigate("/login");
      return;
    }
    setUser({ name, email, role, id: userId, token });

    if (role === "student" && userId) {
      socket.emit("joinStudent", userId);
      socket.on("registrationStatusChanged", (data) => {
        alert(`🔔 ${data.message}`);
        axios
          .get(`${API}/student/my-events`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => setRegisteredEvents(res.data))
          .catch((err) => console.error("Failed to refresh registered events", err));
      });
    }

    loadEvents();

    if (role === "student" && token) {
      axios
        .get(`${API}/student/my-events`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setRegisteredEvents(res.data))
        .catch((err) => console.error("Failed to load registered events", err));
    }

    if (role === "college_admin") {
      axios
        .get(`${API}/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setStats(res.data))
        .catch((err) => console.error("Failed to load stats", err));
    }

    if (role === "superadmin") {
      axios
        .get(`${API}/superadmin/event-stats`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setEventStats(res.data))
        .catch((err) => console.error("Failed to load event stats", err));
    }

    return () => {
      socket.off("registrationStatusChanged");
    };
  }, [navigate]);

  // Refresh events when returning to dashboard
  useEffect(() => {
    const handleFocus = () => {
      loadEvents();
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  if (!user) return <p style={{ textAlign: "center" }}>Loading...</p>;

  const filteredEvents = events.filter((event) => {
    const matchesCategory = filterCategory === "all" || event.category.toLowerCase() === filterCategory.toLowerCase();
    const matchesTitle = searchTitle === "" || event.title.toLowerCase().includes(searchTitle.toLowerCase());
    const matchesLocation = searchLocation === "" || (event.location && event.location.toLowerCase().includes(searchLocation.toLowerCase()));
    
    // Registration status filter for students
    let matchesRegistration = true;
    if (user?.role === "student" && registrationFilter !== "all") {
      const isRegistered = registeredEvents.find((r) => r.event._id === event._id);
      if (registrationFilter === "registered") {
        matchesRegistration = !!isRegistered;
      } else if (registrationFilter === "not-registered") {
        matchesRegistration = !isRegistered;
      }
    }
    
    return matchesCategory && matchesTitle && matchesLocation && matchesRegistration;
  });

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (sortOption === "date") return new Date(a.startDate) - new Date(b.startDate);
    if (sortOption === "category") return a.category.localeCompare(b.category);
    return 0;
  });

  const displayEvents = sortedEvents;

  const handleRegister = async (eventId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/student/register-event`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ eventId }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("✅ Registered successfully!");
        setJustRegisteredId(eventId);
        setTimeout(() => setJustRegisteredId(null), 2000);
        axios
          .get(`${API}/student/my-events`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => setRegisteredEvents(res.data))
          .catch((err) => console.error("Failed to refresh registered events", err));
      } else {
        alert(data.message || "Error registering");
      }
    } catch (err) {
      alert("❌ Network error while registering");
    }
  };

  const handleCancelRegistration = async (eventId) => {
    if (window.confirm("Are you sure you want to cancel your registration?")) {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API}/student/cancel-registration`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ eventId }),
        });
        const data = await res.json();
        if (res.ok) {
          alert("✅ Registration cancelled successfully!");
          axios
            .get(`${API}/student/my-events`, {
              headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setRegisteredEvents(res.data))
            .catch((err) => console.error("Failed to refresh registered events", err));
        } else {
          alert(data.message || "Error cancelling registration");
        }
      } catch (err) {
        alert("❌ Network error while cancelling registration");
      }
    }
  };

  const handleDeleteEvent = async (eventId) => {
    const token = localStorage.getItem("token");
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await axios.delete(`${API}/admin/delete-event/${eventId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(events.filter((event) => event._id !== eventId));
        await loadEvents(); // Refresh events after deletion
        alert("✅ Event deleted!");
      } catch (err) {
        alert("❌ Error deleting event");
      }
    }
  };

  const getEventImage = (category) => {
    switch (category) {
      case "Sports":
        return "/sports.events.jpg";
      case "Hackathon":
        return "/hackathon.events.jpg";
      case "Cultural":
        return "/cultural.events.jpg";
      case "Workshop":
        return "/workshop.events.jpg";
      default:
        return "/default.jpg";
    }
  };

  const containerOuter = {
    minHeight: "100vh",
    width: "100%",
    background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 50%, #bfdbfe 100%)",
    display: "flex",
    justifyContent: "center",
    padding: window.innerWidth <= 768 ? "10px" : "20px 0",
    position: "relative",
    overflow: "hidden",
  };
  const containerInner = {
    width: "100%",
    maxWidth: window.innerWidth <= 768 ? "100%" : "1500px",
    margin: "0 auto",
    background: "rgba(255, 255, 255, 0.98)",
    borderRadius: window.innerWidth <= 768 ? "12px" : "24px",
    boxShadow: "0 30px 60px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1)",
    minHeight: window.innerWidth <= 768 ? "auto" : "95vh",
    padding: window.innerWidth <= 768 ? "20px" : "50px",
    display: "flex",
    flexDirection: "column",
    backdropFilter: "blur(20px)",
    position: "relative",
    border: "1px solid rgba(255, 255, 255, 0.2)",
  };
  const headerContainer = {
    background: "white",
    padding: "20px 30px",
    borderRadius: "12px",
    marginBottom: "25px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
    border: "1px solid rgba(226, 232, 240, 0.6)",
  };
  const headerStyle = {
    color: "#2d3748",
    fontSize: "2.2rem",
    fontWeight: "700",
    marginBottom: "8px",
    textAlign: "center",
    fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
    letterSpacing: "-0.02em",
  };
  const welcomeStyle = {
    fontSize: "1.1rem",
    color: "#4a5568",
    textAlign: "center",
    marginBottom: "0",
    fontWeight: "500",
    fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
    letterSpacing: "-0.01em",
  };
  const statsGrid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: "12px",
    marginBottom: "25px",
  };
  const statCard = {
    background: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #3b82f6 100%)",
    color: "white",
    padding: "15px 12px",
    borderRadius: "12px",
    textAlign: "center",
    fontWeight: "600",
    fontSize: "0.8rem",
    boxShadow: "0 6px 15px rgba(30, 58, 138, 0.3), 0 2px 8px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    cursor: "pointer",
    position: "relative",
    overflow: "hidden",
  };
  const statNumber = {
    fontSize: "1.5rem",
    fontWeight: "700",
    display: "block",
    marginBottom: "4px",
    fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
  };
  const controlsContainer = {
    background: "linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)",
    padding: window.innerWidth <= 768 ? "15px" : "30px",
    borderRadius: "18px",
    marginBottom: window.innerWidth <= 768 ? "20px" : "40px",
    display: "flex",
    gap: window.innerWidth <= 768 ? "8px" : "15px",
    alignItems: "center",
    flexWrap: "wrap",
    border: "1px solid rgba(226, 232, 240, 0.6)",
    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)",
    backdropFilter: "blur(10px)",
    flexDirection: "row",
  };
  const eventCardGrid = {
    display: "grid",
    gridTemplateColumns: window.innerWidth <= 768 ? "1fr" : "repeat(auto-fit, minmax(380px, 1fr))",
    gap: window.innerWidth <= 768 ? "15px" : "25px",
  };
  const eventCard = {
    background: "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
    borderRadius: "24px",
    boxShadow: "0 15px 40px rgba(0, 0, 0, 0.12), 0 5px 15px rgba(0, 0, 0, 0.08)",
    padding: "0",
    position: "relative",
    overflow: "hidden",
    transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    border: "1px solid rgba(226, 232, 240, 0.6)",
  };
  const eventCardContent = {
    padding: "25px",
  };
  const eventTitle = {
    fontSize: "1.6rem",
    fontWeight: "700",
    color: "#2d3748",
    marginBottom: "10px",
    fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
    letterSpacing: "-0.01em",
    lineHeight: "1.3",
  };
  const eventCategory = {
    display: "inline-block",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    padding: "6px 16px",
    borderRadius: "20px",
    fontSize: "0.95rem",
    fontWeight: "600",
    marginBottom: "15px",
    fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
    letterSpacing: "0.02em",
  };
  const eventDate = {
    color: "#718096",
    fontSize: "1.05rem",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontWeight: "500",
    fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
  };
  const registerBtn = {
    padding: "14px 28px",
    background: "linear-gradient(135deg, #48bb78 0%, #38a169 100%)",
    color: "white",
    fontWeight: "600",
    border: "none",
    borderRadius: "12px",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    boxShadow: "0 6px 20px rgba(72, 187, 120, 0.4), 0 2px 8px rgba(0, 0, 0, 0.1)",
    fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
  };
  const commentsBtn = {
    padding: "14px 28px",
    background: "linear-gradient(145deg, #f7fafc 0%, #ffffff 100%)",
    color: "#4a5568",
    fontWeight: "600",
    border: "2px solid rgba(226, 232, 240, 0.8)",
    borderRadius: "12px",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
    fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
  };
  const cancelBtn = {
    padding: "12px 24px",
    background: "linear-gradient(135deg, #f56565 0%, #e53e3e 100%)",
    color: "white",
    fontWeight: "600",
    border: "none",
    borderRadius: "10px",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(245, 101, 101, 0.3)",
  };
  const deleteBtn = {
    padding: "14px 28px",
    background: "linear-gradient(135deg, #f56565 0%, #e53e3e 100%)",
    color: "white",
    fontWeight: "600",
    border: "none",
    borderRadius: "12px",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    boxShadow: "0 6px 20px rgba(245, 101, 101, 0.4), 0 2px 8px rgba(0, 0, 0, 0.1)",
    fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
  };
  const editBtn = {
    padding: "14px 28px",
    background: "linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)",
    color: "white",
    fontWeight: "600",
    border: "none",
    borderRadius: "12px",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    boxShadow: "0 6px 20px rgba(237, 137, 54, 0.4), 0 2px 8px rgba(0, 0, 0, 0.1)",
    fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
  };

  const selectStyle = {
    padding: window.innerWidth <= 768 ? "8px 12px" : "10px 14px",
    borderRadius: "8px",
    border: "2px solid rgba(226, 232, 240, 0.8)",
    fontSize: window.innerWidth <= 768 ? "0.8rem" : "0.9rem",
    color: "#2d3748",
    cursor: "pointer",
    background: "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
    transition: "all 0.3s ease",
    minWidth: window.innerWidth <= 768 ? "120px" : "140px",
    width: "auto",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
    fontWeight: "500",
  };
  const sectionTitle = {
    fontSize: "2.2rem",
    fontWeight: "700",
    color: "#2d3748",
    marginBottom: "30px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
    letterSpacing: "-0.02em",
  };
  const statusBadge = {
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "0.85rem",
    fontWeight: "600",
    display: "inline-block",
    marginTop: "10px",
  };


  return (
    <div style={containerOuter}>
      <div style={containerInner}>
        <div style={headerContainer}>
          <h1 style={headerStyle}>
            {user.role === "college_admin" ? "🎯 Admin Dashboard" : 
             user.role === "superadmin" ? "🔧 Superadmin Dashboard" : "🎓 Student Dashboard"}
          </h1>
          <h2 style={welcomeStyle}>Welcome back, {user.name}! 👋</h2>
        </div>

        {/* Superadmin Dashboard */}
        {user.role === "superadmin" && (
          <>
            <div style={{ textAlign: "center", marginBottom: "30px" }}>
              <h2 style={{ color: "#4a5568", marginBottom: "10px" }}>Welcome back, Mate! 👋</h2>
              <p style={{ color: "#718096" }}>Here's an overview of event activity across all colleges.</p>
            </div>
            
            {/* Event Statistics Graph */}
            <div style={{
              background: "white",
              borderRadius: "12px",
              padding: "30px",
              marginBottom: "30px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              border: "1px solid rgba(226, 232, 240, 0.6)"
            }}>
              <h2 style={{ marginBottom: "25px", color: "#2d3748", fontSize: "1.8rem" }}>📈 Events by College</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                {eventStats.map((stat, index) => {
                  const maxCount = Math.max(...eventStats.map(s => s.eventCount));
                  const barWidth = maxCount > 0 ? (stat.eventCount / maxCount) * 100 : 0;
                  return (
                    <div key={index} style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "20px",
                      padding: "15px",
                      background: "linear-gradient(145deg, #f8fafc 0%, #ffffff 100%)",
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)"
                    }}>
                      <div style={{ minWidth: "180px", fontWeight: "700", color: "#2d3748", fontSize: "1.1rem" }}>
                        {stat._id}
                      </div>
                      <div style={{ flex: 1, position: "relative" }}>
                        <div style={{
                          height: "35px",
                          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          borderRadius: "18px",
                          width: `${barWidth}%`,
                          minWidth: "30px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontSize: "1rem",
                          fontWeight: "700",
                          boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)"
                        }}>
                          {stat.eventCount} events
                        </div>
                      </div>
                      <div style={{ fontSize: "0.9rem", color: "#718096", fontWeight: "500" }}>
                        by {stat.adminName}
                      </div>
                    </div>
                  );
                })}
                {eventStats.length === 0 && (
                  <div style={{ textAlign: "center", padding: "40px" }}>
                    <p style={{ color: "#718096", fontSize: "1.1rem" }}>No event data available yet</p>
                    <p style={{ color: "#a0aec0", fontSize: "0.9rem" }}>Events will appear here once college admins start creating them</p>
                  </div>
                )}
              </div>
            </div>
            
            <div style={{ textAlign: "center" }}>
              <button
                onClick={() => navigate("/superadmin")}
                style={{
                  padding: "15px 30px",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  boxShadow: "0 6px 20px rgba(102, 126, 234, 0.4)"
                }}
              >
                🚀 Go to Superadmin Management
              </button>
            </div>
          </>
        )}

        {/* Admin Dashboard */}
        {user.role === "college_admin" && (
          <>
            <div style={statsGrid}>
              <div style={statCard} onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-8px) scale(1.02)";
                e.target.style.boxShadow = "0 25px 50px rgba(102, 126, 234, 0.5), 0 10px 25px rgba(0, 0, 0, 0.15)";
              }} onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0) scale(1)";
                e.target.style.boxShadow = "0 15px 35px rgba(102, 126, 234, 0.4), 0 5px 15px rgba(0, 0, 0, 0.1)";
              }}>
                <span style={statNumber}>{stats.totalEvents}</span>
                📅 Total Events
              </div>
              <div style={statCard} onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-8px) scale(1.02)";
                e.target.style.boxShadow = "0 25px 50px rgba(102, 126, 234, 0.5), 0 10px 25px rgba(0, 0, 0, 0.15)";
              }} onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0) scale(1)";
                e.target.style.boxShadow = "0 15px 35px rgba(102, 126, 234, 0.4), 0 5px 15px rgba(0, 0, 0, 0.1)";
              }}>
                <span style={statNumber}>{stats.totalRegistrations}</span>
                📝 Total Registrations
              </div>
              <div style={statCard} onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-8px) scale(1.02)";
                e.target.style.boxShadow = "0 25px 50px rgba(102, 126, 234, 0.5), 0 10px 25px rgba(0, 0, 0, 0.15)";
              }} onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0) scale(1)";
                e.target.style.boxShadow = "0 15px 35px rgba(102, 126, 234, 0.4), 0 5px 15px rgba(0, 0, 0, 0.1)";
              }}>
                <span style={statNumber}>{stats.activeUsers}</span>
                👥 Active Users
              </div>
              <div style={statCard} onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-8px) scale(1.02)";
                e.target.style.boxShadow = "0 25px 50px rgba(102, 126, 234, 0.5), 0 10px 25px rgba(0, 0, 0, 0.15)";
              }} onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0) scale(1)";
                e.target.style.boxShadow = "0 15px 35px rgba(102, 126, 234, 0.4), 0 5px 15px rgba(0, 0, 0, 0.1)";
              }}>
                <span style={statNumber}>{stats.pendingReviews}</span>
                ⏳ Pending Reviews
              </div>
            </div>
            <div style={controlsContainer}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <label style={{ fontWeight: "600", color: "#4a5568" }}>📝 Title:</label>
                <input
                  type="text"
                  placeholder="Search by title..."
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                  style={{
                    ...selectStyle,
                    minWidth: "200px"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#667eea"}
                  onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <label style={{ fontWeight: "600", color: "#4a5568" }}>📍 Location:</label>
                <input
                  type="text"
                  placeholder="Search by location..."
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  style={{
                    ...selectStyle,
                    minWidth: "200px"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#667eea"}
                  onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <label style={{ fontWeight: "600", color: "#4a5568" }}>📊 Sort by:</label>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  style={selectStyle}
                  onFocus={(e) => e.target.style.borderColor = "#667eea"}
                  onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                >
                  <option value="date">📅 Start Date</option>
                  <option value="category">📂 Category (A-Z)</option>
                </select>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <label style={{ fontWeight: "600", color: "#4a5568" }}>🎯 Filter by:</label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  style={selectStyle}
                  onFocus={(e) => e.target.style.borderColor = "#667eea"}
                  onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                >
                  <option value="all">🌟 All Categories</option>
                  <option value="sports">⚽ Sports</option>
                  <option value="hackathon">💻 Hackathon</option>
                  <option value="cultural">🎭 Cultural</option>
                  <option value="workshop">🛠️ Workshop</option>
                </select>
              </div>
            </div>
            <section>
              <h3 style={sectionTitle}>🎪 Upcoming Events</h3>
              <div style={eventCardGrid}>
                {displayEvents.map((event) => (
                  <div key={event._id} style={{...eventCard, cursor: "pointer"}} onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-12px) scale(1.02)";
                    e.currentTarget.style.boxShadow = "0 25px 60px rgba(0, 0, 0, 0.2), 0 10px 30px rgba(0, 0, 0, 0.12)";
                  }} onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0) scale(1)";
                    e.currentTarget.style.boxShadow = "0 15px 40px rgba(0, 0, 0, 0.12), 0 5px 15px rgba(0, 0, 0, 0.08)";
                  }} onClick={() => {
                    navigate(`/event-details/${event._id}`);
                  }}>
                    <img
                      src={getEventImage(event.category)}
                      alt={event.category}
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                      }}
                    />
                    <div style={eventCardContent}>
                      <h4 style={eventTitle}>{event.title}</h4>
                      <span style={eventCategory}>{event.category}</span>
                      <p style={eventDate}>
                        📅 {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                        <span style={{ fontSize: "1.2rem" }}>⭐</span>
                        <span style={{ color: "#4a5568", fontWeight: "600" }}>Rating will load...</span>
                      </div>
                      <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                        <button
                          style={editBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/create-event?edit=${event._id}`);
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = "translateY(-2px)";
                            e.target.style.boxShadow = "0 6px 20px rgba(237, 137, 54, 0.4)";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = "translateY(0)";
                            e.target.style.boxShadow = "0 4px 15px rgba(237, 137, 54, 0.3)";
                          }}
                        >
                          ✏️ Edit Event
                        </button>
                        <button
                          style={deleteBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteEvent(event._id);
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = "translateY(-2px)";
                            e.target.style.boxShadow = "0 6px 20px rgba(245, 101, 101, 0.4)";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = "translateY(0)";
                            e.target.style.boxShadow = "0 4px 15px rgba(245, 101, 101, 0.3)";
                          }}
                        >
                          🗑️ Delete Event
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {/* Student Dashboard */}
        {user.role === "student" && (
          <>
            <div style={controlsContainer}>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <label style={{ fontWeight: "600", color: "#4a5568", fontSize: "0.9rem" }}>📝 Title:</label>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                  style={selectStyle}
                  onFocus={(e) => e.target.style.borderColor = "#667eea"}
                  onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <label style={{ fontWeight: "600", color: "#4a5568", fontSize: "0.9rem" }}>📍 Location:</label>
                <input
                  type="text"
                  placeholder="Location..."
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  style={selectStyle}
                  onFocus={(e) => e.target.style.borderColor = "#667eea"}
                  onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <label style={{ fontWeight: "600", color: "#4a5568", fontSize: "0.9rem" }}>📊 Sort:</label>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  style={selectStyle}
                  onFocus={(e) => e.target.style.borderColor = "#667eea"}
                  onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                >
                  <option value="date">Date</option>
                  <option value="category">Category</option>
                </select>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <label style={{ fontWeight: "600", color: "#4a5568", fontSize: "0.9rem" }}>🎯 Filter:</label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  style={selectStyle}
                  onFocus={(e) => e.target.style.borderColor = "#667eea"}
                  onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                >
                  <option value="all">All</option>
                  <option value="sports">Sports</option>
                  <option value="hackathon">Hackathon</option>
                  <option value="cultural">Cultural</option>
                  <option value="workshop">Workshop</option>
                </select>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <label style={{ fontWeight: "600", color: "#4a5568", fontSize: "0.9rem" }}>📋 Registration:</label>
                <select
                  value={registrationFilter}
                  onChange={(e) => setRegistrationFilter(e.target.value)}
                  style={selectStyle}
                  onFocus={(e) => e.target.style.borderColor = "#667eea"}
                  onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                >
                  <option value="all">All</option>
                  <option value="registered">Registered</option>
                  <option value="not-registered">Not Registered</option>
                </select>
              </div>
            </div>
            {/* Available Events: Comments Button SHOWN */}
            <section>
              <h3 style={sectionTitle}>🎪 Available Events</h3>
              <div style={eventCardGrid}>
                {displayEvents.map((event) => {
                  const reg = registeredEvents.find((r) => r.event._id === event._id);
                  return (
                    <div key={event._id} style={{...eventCard, cursor: "pointer"}} onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-8px)";
                      e.currentTarget.style.boxShadow = "0 20px 40px rgba(0, 0, 0, 0.15)";
                    }} onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.1)";
                    }} onClick={() => {
                      navigate(`/event-details/${event._id}`);
                    }}>
                      <img
                        src={getEventImage(event.category)}
                        alt={event.category}
                        style={{
                          width: "100%",
                          height: "200px",
                          objectFit: "cover",
                        }}
                      />
                      <div style={eventCardContent}>
                        <h4 style={eventTitle}>{event.title}</h4>
                        <span style={eventCategory}>{event.category}</span>
                        <p style={eventDate}>
                          📅 {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                        </p>
                        {reg ? (
                          <div>
                            <div style={{
                              ...statusBadge,
                              background: reg.status === "approved" ? "#48bb78" : reg.status === "rejected" ? "#f56565" : "#ed8936",
                              color: "white"
                            }}>
                              {reg.status === "approved" ? "✅ Approved" : reg.status === "rejected" ? "❌ Rejected" : "⏳ Pending"}
                            </div>
                            <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                              {reg.status === "approved" && (
                                <TicketDownload event={reg.event} user={user} />
                              )}
                              <button
                                style={cancelBtn}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCancelRegistration(event._id);
                                }}
                                onMouseEnter={(e) => {
                                  e.target.style.transform = "translateY(-2px)";
                                  e.target.style.boxShadow = "0 6px 20px rgba(245, 101, 101, 0.4)";
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.transform = "translateY(0)";
                                  e.target.style.boxShadow = "0 4px 15px rgba(245, 101, 101, 0.3)";
                                }}
                              >
                                ❌ Cancel Registration
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                            <button
                              style={registerBtn}
                              onClick={() => handleRegister(event._id)}
                              onMouseEnter={(e) => {
                                e.target.style.transform = "translateY(-2px)";
                                e.target.style.boxShadow = "0 6px 20px rgba(72, 187, 120, 0.4)";
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.transform = "translateY(0)";
                                e.target.style.boxShadow = "0 4px 15px rgba(72, 187, 120, 0.3)";
                              }}
                            >
                              ✨ Register
                            </button>
                            <button
                              style={commentsBtn}
                              onClick={() =>
                                setOpenCommentsId(openCommentsId === event._id ? null : event._id)
                              }
                              onMouseEnter={(e) => {
                                e.target.style.borderColor = "#667eea";
                                e.target.style.color = "#667eea";
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.borderColor = "#e2e8f0";
                                e.target.style.color = "#4a5568";
                              }}
                            >
                              {openCommentsId === event._id ? "🔼 Hide" : "💬 Comments"}
                            </button>
                          </div>
                        )}
                        {openCommentsId === event._id && (
                          <div style={{ marginTop: "20px", borderTop: "1px solid #e2e8f0", paddingTop: "20px" }}>
                            <CommentsSection eventId={event._id} />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
            {/* Registered Events: Comments Button/box NOT SHOWN */}
            <section style={{ marginTop: "40px" }}>
              <h3 style={sectionTitle}>🎫 Your Registered Events</h3>
              <div style={eventCardGrid}>
                {registeredEvents.map((reg) => (
                  <div key={reg._id} style={eventCard} onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px)";
                    e.currentTarget.style.boxShadow = "0 20px 40px rgba(0, 0, 0, 0.15)";
                  }} onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.1)";
                  }}>
                    <img
                      src={getEventImage(reg.event.category)}
                      alt={reg.event.category}
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                      }}
                    />
                    <div style={eventCardContent}>
                      <h4 style={eventTitle}>{reg.event.title}</h4>
                      <span style={eventCategory}>{reg.event.category}</span>
                      <p style={eventDate}>
                        📅 {new Date(reg.event.startDate).toLocaleDateString()} - {new Date(reg.event.endDate).toLocaleDateString()}
                      </p>
                      <div style={{
                        ...statusBadge,
                        background: reg.status === "approved" ? "#48bb78" : reg.status === "rejected" ? "#f56565" : "#ed8936",
                        color: "white"
                      }}>
                        {reg.status === "approved" ? "✅ Approved" : reg.status === "rejected" ? "❌ Rejected" : "⏳ Pending"}
                      </div>
                      {reg.status === "approved" && (
                        <div style={{ marginTop: "15px" }}>
                          <TicketDownload event={reg.event} user={user} />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
        

      </div>
    </div>
  );
}
