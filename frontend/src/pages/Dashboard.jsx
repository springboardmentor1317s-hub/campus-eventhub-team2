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
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalRegistrations: 0,
    activeUsers: 0,
    pendingReviews: 0,
  });
  const [openCommentsId, setOpenCommentsId] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });

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

  const filteredEvents =
    filterCategory === "all"
      ? events
      : events.filter(
        (event) => event.category.toLowerCase() === filterCategory.toLowerCase()
      );

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
    width: "100vw",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    justifyContent: "center",
    padding: "20px 0",
  };
  const containerInner = {
    width: "100%",
    maxWidth: "1400px",
    margin: "0 auto",
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: "20px",
    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)",
    minHeight: "90vh",
    padding: "40px",
    display: "flex",
    flexDirection: "column",
    backdropFilter: "blur(10px)",
    position: "relative",
  };
  const headerStyle = {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontSize: "3.2rem",
    fontWeight: "800",
    marginBottom: "15px",
    textAlign: "center",
    fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
    letterSpacing: "-0.02em",
  };
  const welcomeStyle = {
    fontSize: "1.6rem",
    color: "#4a5568",
    textAlign: "center",
    marginBottom: "35px",
    fontWeight: "600",
    fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
    letterSpacing: "-0.01em",
  };
  const statsGrid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    marginBottom: "40px",
  };
  const statCard = {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    padding: "25px",
    borderRadius: "15px",
    textAlign: "center",
    fontWeight: "600",
    fontSize: "1.1rem",
    boxShadow: "0 10px 25px rgba(102, 126, 234, 0.3)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    cursor: "pointer",
  };
  const statNumber = {
    fontSize: "3rem",
    fontWeight: "800",
    display: "block",
    marginBottom: "8px",
    fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
  };
  const controlsContainer = {
    background: "#f8fafc",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "30px",
    display: "flex",
    gap: "20px",
    alignItems: "center",
    flexWrap: "wrap",
    border: "1px solid #e2e8f0",
  };
  const eventCardGrid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
    gap: "25px",
  };
  const eventCard = {
    background: "#ffffff",
    borderRadius: "20px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
    padding: "0",
    position: "relative",
    overflow: "hidden",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    border: "1px solid #e2e8f0",
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
    padding: "12px 24px",
    background: "linear-gradient(135deg, #48bb78 0%, #38a169 100%)",
    color: "white",
    fontWeight: "600",
    border: "none",
    borderRadius: "10px",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(72, 187, 120, 0.3)",
  };
  const commentsBtn = {
    padding: "12px 24px",
    background: "#f7fafc",
    color: "#4a5568",
    fontWeight: "600",
    border: "2px solid #e2e8f0",
    borderRadius: "10px",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "all 0.3s ease",
  };
  const deleteBtn = {
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
  const editBtn = {
    padding: "12px 24px",
    background: "linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)",
    color: "white",
    fontWeight: "600",
    border: "none",
    borderRadius: "10px",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(237, 137, 54, 0.3)",
  };
  const selectStyle = {
    padding: "10px 15px",
    borderRadius: "8px",
    border: "2px solid #e2e8f0",
    fontSize: "1rem",
    color: "#4a5568",
    cursor: "pointer",
    background: "white",
    transition: "border-color 0.3s ease",
    minWidth: "150px",
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
  const modalOverlay = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.7)",
    zIndex: 1000,
    backdropFilter: "blur(5px)",
  };
  const modalContent = {
    background: "white",
    borderRadius: "20px",
    width: "380px",
    maxHeight: "80vh",
    overflow: "auto",
    position: "fixed",
    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.25)",
    left: modalPosition.x,
    top: modalPosition.y,
    zIndex: 1001,
  };
  const modalHeader = {
    position: "relative",
    height: "250px",
    overflow: "hidden",
  };
  const modalBody = {
    padding: "30px",
  };
  const closeBtn = {
    position: "absolute",
    top: "15px",
    right: "15px",
    background: "rgba(0, 0, 0, 0.5)",
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    fontSize: "1.2rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  };

  return (
    <div style={containerOuter}>
      <div style={containerInner}>
        <h1 style={headerStyle}>
          {user.role === "college_admin" ? "🎯 Admin Dashboard" : "🎓 Student Dashboard"}
        </h1>
        <h2 style={welcomeStyle}>Welcome back, {user.name}! 👋</h2>

        {/* Admin Dashboard */}
        {user.role === "college_admin" && (
          <>
            <div style={statsGrid}>
              <div style={statCard} onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-5px)";
                e.target.style.boxShadow = "0 15px 35px rgba(102, 126, 234, 0.4)";
              }} onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 10px 25px rgba(102, 126, 234, 0.3)";
              }}>
                <span style={statNumber}>{stats.totalEvents}</span>
                📅 Total Events
              </div>
              <div style={statCard} onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-5px)";
                e.target.style.boxShadow = "0 15px 35px rgba(102, 126, 234, 0.4)";
              }} onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 10px 25px rgba(102, 126, 234, 0.3)";
              }}>
                <span style={statNumber}>{stats.totalRegistrations}</span>
                📝 Total Registrations
              </div>
              <div style={statCard} onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-5px)";
                e.target.style.boxShadow = "0 15px 35px rgba(102, 126, 234, 0.4)";
              }} onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 10px 25px rgba(102, 126, 234, 0.3)";
              }}>
                <span style={statNumber}>{stats.activeUsers}</span>
                👥 Active Users
              </div>
              <div style={statCard} onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-5px)";
                e.target.style.boxShadow = "0 15px 35px rgba(102, 126, 234, 0.4)";
              }} onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 10px 25px rgba(102, 126, 234, 0.3)";
              }}>
                <span style={statNumber}>{stats.pendingReviews}</span>
                ⏳ Pending Reviews
              </div>
            </div>
            <div style={controlsContainer}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <label style={{ fontWeight: "600", color: "#4a5568" }}>🔍 Sort by:</label>
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
                    e.currentTarget.style.transform = "translateY(-8px)";
                    e.currentTarget.style.boxShadow = "0 20px 40px rgba(0, 0, 0, 0.15)";
                  }} onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.1)";
                  }} onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setModalPosition({
                      x: rect.left,
                      y: rect.top
                    });
                    setSelectedEvent(event);
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
                ))}
              </div>
            </section>
          </>
        )}

        {/* Student Dashboard */}
        {user.role === "student" && (
          <>
            <div style={controlsContainer}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <label style={{ fontWeight: "600", color: "#4a5568" }}>🔍 Sort by:</label>
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
                    }} onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setModalPosition({
                        x: rect.left,
                        y: rect.top
                      });
                      setSelectedEvent(event);
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
                            {reg.status === "approved" && (
                              <div style={{ marginTop: "15px" }}>
                                <TicketDownload event={reg.event} user={user} />
                              </div>
                            )}
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
        
        {/* Event Details Modal */}
        {selectedEvent && (
          <div style={modalOverlay} onClick={() => setSelectedEvent(null)}>
            <div style={modalContent} onClick={(e) => e.stopPropagation()}>
              <button style={closeBtn} onClick={() => setSelectedEvent(null)}>×</button>
              <div style={modalHeader}>
                <img
                  src={getEventImage(selectedEvent.category)}
                  alt={selectedEvent.category}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
              <div style={modalBody}>
                <h2 style={{...eventTitle, fontSize: "1.8rem", marginBottom: "15px"}}>{selectedEvent.title}</h2>
                <span style={eventCategory}>{selectedEvent.category}</span>
                
                <div style={{marginTop: "20px"}}>
                  <h3 style={{color: "#4a5568", fontSize: "1.1rem", marginBottom: "10px"}}>📅 Event Dates</h3>
                  <p style={{color: "#718096", marginBottom: "15px"}}>
                    <strong>Start:</strong> {new Date(selectedEvent.startDate).toLocaleDateString()} at {new Date(selectedEvent.startDate).toLocaleTimeString()}<br/>
                    <strong>End:</strong> {new Date(selectedEvent.endDate).toLocaleDateString()} at {new Date(selectedEvent.endDate).toLocaleTimeString()}
                  </p>
                </div>
                
                {selectedEvent.description && (
                  <div style={{marginTop: "20px"}}>
                    <h3 style={{color: "#4a5568", fontSize: "1.1rem", marginBottom: "10px"}}>📝 Description</h3>
                    <p style={{color: "#718096", lineHeight: "1.6", marginBottom: "15px"}}>{selectedEvent.description}</p>
                  </div>
                )}
                
                {selectedEvent.location && (
                  <div style={{marginTop: "20px"}}>
                    <h3 style={{color: "#4a5568", fontSize: "1.1rem", marginBottom: "10px"}}>📍 Location</h3>
                    <p style={{color: "#718096", marginBottom: "15px"}}>{selectedEvent.location}</p>
                  </div>
                )}
                
                {selectedEvent.maxParticipants && (
                  <div style={{marginTop: "20px"}}>
                    <h3 style={{color: "#4a5568", fontSize: "1.1rem", marginBottom: "10px"}}>👥 Capacity</h3>
                    <p style={{color: "#718096", marginBottom: "15px"}}>{selectedEvent.maxParticipants} participants</p>
                  </div>
                )}
                
                {selectedEvent.organizer && (
                  <div style={{marginTop: "20px"}}>
                    <h3 style={{color: "#4a5568", fontSize: "1.1rem", marginBottom: "10px"}}>👤 Organizer</h3>
                    <p style={{color: "#718096", marginBottom: "15px"}}>{selectedEvent.organizer}</p>
                  </div>
                )}
                
                <div style={{marginTop: "30px", display: "flex", gap: "10px", justifyContent: "center"}}>
                  {user.role === "student" && !registeredEvents.find((r) => r.event._id === selectedEvent._id) && (
                    <button
                      style={registerBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRegister(selectedEvent._id);
                        setSelectedEvent(null);
                      }}
                    >
                      ✨ Register for Event
                    </button>
                  )}
                  {user.role === "college_admin" && (
                    <button
                      style={editBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/create-event?edit=${selectedEvent._id}`);
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
                  )}
                  <button
                    style={{
                      ...commentsBtn,
                      background: "#e2e8f0",
                      border: "none",
                    }}
                    onClick={() => setSelectedEvent(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
