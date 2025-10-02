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

  const navigate = useNavigate();
  const API = "http://localhost:5000/api";

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

    axios
      .get(`${API}/events`)
      .then((res) => setEvents(res.data))
      .catch((err) => console.error("Failed to load events", err));

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
    background: "linear-gradient(120deg, #eaf6ff 60%, #d4edfb 100%)",
    display: "flex",
    justifyContent: "center",
  };
  const containerInner = {
    width: "100%",
    maxWidth: "1600px",
    margin: "0 auto",
    background: "#fff",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(33,77,109,0.07)",
    minHeight: "88vh",
    padding: "40px 36px",
    display: "flex",
    flexDirection: "column",
  };
  const statsGrid = {
    background: "#fff",
    padding: "10px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    display: "flex",
    gap: "25px",
    justifyContent: "center",
  };
  const statCard = {
    background: "linear-gradient(90deg, #0996e6, #29c2ee)",
    color: "white",
    padding: "1.1rem",
    borderRadius: "13px",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: "1.15rem",
    boxShadow: "0 8px 24px #c2e7fa",
    letterSpacing: "1px",
  };
  const eventCardGrid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(350px,1fr))",
    gap: "36px",
  };
  const eventCard = {
    background: "#ffffff",
    borderRadius: "17px",
    boxShadow: "0 6px 34px 0px #bacee0",
    padding: "2rem 1.3rem 1.2rem 1.3rem",
    position: "relative",
  };
  const registerBtn = {
    marginTop: "18px",
    padding: "10px 28px",
    background: "linear-gradient(90deg, #0996e6, #29c2ee)",
    color: "white",
    fontWeight: 600,
    border: "none",
    borderRadius: "9px",
    fontSize: "1.07rem",
    cursor: "pointer",
    boxShadow: "0 2px 7px #cde8fa",
    alignSelf: "start",
  };
  const registeredBtn = {
    ...registerBtn,
    background: "gray",
    cursor: "not-allowed",
  };
  const deleteBtn = {
    marginTop: "14px",
    padding: "10px 28px",
    background: "#e74c3c",
    color: "white",
    fontWeight: 600,
    border: "none",
    borderRadius: "9px",
    fontSize: "1.07rem",
    cursor: "pointer",
    boxShadow: "0 2px 7px #eec2cc",
    alignSelf: "start",
  };
  const selectStyle = {
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #0996e6",
    fontSize: "1rem",
    color: "#14476f",
    cursor: "pointer",
  };

  return (
    <div style={containerOuter}>
      <div style={containerInner}>
        <h1>
          📊 {user.role === "college_admin" ? "Admin Dashboard" : "Student Dashboard"}
        </h1>
        <h2>Welcome, {user.name}!</h2>

        {/* Admin Dashboard */}
        {user.role === "college_admin" && (
          <>
            <div style={statsGrid}>
              <div style={statCard}>📅 Total Events: {stats.totalEvents}</div>
              <div style={statCard}>📝 Registrations: {stats.totalRegistrations}</div>
              <div style={statCard}>👥 Active Users: {stats.activeUsers}</div>
              <div style={statCard}>⏳ Pending Reviews: {stats.pendingReviews}</div>
            </div>
            <div style={{ margin: "1.5rem 0", fontWeight: 500, color: "#0996e6" }}>
              <label style={{ marginRight: "12px" }}>Sort by:</label>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                style={selectStyle}
              >
                <option value="date">Start Date</option>
                <option value="category">Category (A-Z)</option>
              </select>
              <label style={{ margin: "0 12px" }}>Filter by:</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                style={selectStyle}
              >
                <option value="all">All</option>
                <option value="sports">Sports</option>
                <option value="hackathon">Hackathon</option>
                <option value="cultural">Cultural</option>
                <option value="workshop">Workshop</option>
              </select>
            </div>
            <section>
              <h3 style={{ margin: "20px 0" }}>Upcoming Events</h3>
              <div style={eventCardGrid}>
                {displayEvents.map((event) => (
                  <div key={event._id} style={eventCard}>
                    <img
                      src={getEventImage(event.category)}
                      alt={event.category}
                      style={{
                        width: "100%",
                        height: "150px",
                        objectFit: "cover",
                        borderRadius: "10px",
                        marginBottom: "12px",
                      }}
                    />
                    <h4>{event.title}</h4>
                    <p>{event.category}</p>
                    <p>
                      {new Date(event.startDate).toLocaleDateString()} -{" "}
                      {new Date(event.endDate).toLocaleDateString()}
                    </p>
                    <button
                      style={deleteBtn}
                      onClick={() => handleDeleteEvent(event._id)}
                    >
                      Delete Event
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {/* Student Dashboard */}
        {user.role === "student" && (
          <>
            <div style={{ margin: "1.5rem 0", fontWeight: 500, color: "#0996e6" }}>
              <label style={{ marginRight: "12px" }}>Sort by:</label>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                style={selectStyle}
              >
                <option value="date">Start Date</option>
                <option value="category">Category (A-Z)</option>
              </select>
              <label style={{ margin: "0 12px" }}>Filter by:</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                style={selectStyle}
              >
                <option value="all">All</option>
                <option value="sports">Sports</option>
                <option value="hackathon">Hackathon</option>
                <option value="cultural">Cultural</option>
                <option value="workshop">Workshop</option>
              </select>
            </div>
            {/* Available Events: Comments Button SHOWN */}
            <section>
              <h3 style={{ marginBottom: "20px" }}>Available Events</h3>
              <div style={eventCardGrid}>
                {displayEvents.map((event) => {
                  const reg = registeredEvents.find((r) => r.event._id === event._id);
                  return (
                    <div key={event._id} style={eventCard}>
                      <img
                        src={getEventImage(event.category)}
                        alt={event.category}
                        style={{
                          width: "100%",
                          height: "150px",
                          objectFit: "cover",
                          borderRadius: "10px",
                          marginBottom: "12px",
                        }}
                      />
                      <h4>{event.title}</h4>
                      <p>{event.category}</p>
                      <p>
                        {new Date(event.startDate).toLocaleDateString()} -{" "}
                        {new Date(event.endDate).toLocaleDateString()}
                      </p>
                      {reg ? (
                        <div>
                          <p>
                            Status:{" "}
                            {reg.status === "approved" ? (
                              <span style={{ color: "green" }}>Approved ✅</span>
                            ) : reg.status === "rejected" ? (
                              <span style={{ color: "red" }}>Rejected ❌</span>
                            ) : (
                              <span style={{ color: "orange" }}>Pending ⏳</span>
                            )}
                          </p>
                          {reg.status === "approved" && (
                            <TicketDownload event={reg.event} user={user} />
                          )}
                        </div>
                      ) : (
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px" }}>
                          <button
                            style={registerBtn}
                            onClick={() => handleRegister(event._id)}
                          >
                            Register
                          </button>
                          <button
                            style={{
                              marginTop: "18px",
                              padding: "10px 28px",
                              background: "#eee",
                              color: "#14476f",
                              fontWeight: 600,
                              border: "1px solid #0996e6",
                              borderRadius: "9px",
                              fontSize: "1.07rem",
                              cursor: "pointer",
                              boxShadow: "0 2px 7px #cde8fa",
                              alignSelf: "start",
                            }}
                            onClick={() =>
                              setOpenCommentsId(openCommentsId === event._id ? null : event._id)
                            }
                          >
                            {openCommentsId === event._id ? "Hide Comments" : "Comments"}
                          </button>
                        </div>
                      )}
                      {openCommentsId === event._id && (
                        <CommentsSection eventId={event._id} />
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
            {/* Registered Events: Comments Button/box NOT SHOWN */}
            <section style={{ marginTop: "2rem" }}>
              <h3>Your Registered Events</h3>
              <div style={eventCardGrid}>
                {registeredEvents.map((reg) => (
                  <div key={reg._id} style={eventCard}>
                    <h4>{reg.event.title}</h4>
                    <p>
                      Status:{" "}
                      {reg.status === "approved" ? (
                        <span style={{ color: "green" }}>Approved ✅</span>
                      ) : reg.status === "rejected" ? (
                        <span style={{ color: "red" }}>Rejected ❌</span>
                      ) : (
                        <span style={{ color: "orange" }}>Pending ⏳</span>
                      )}
                    </p>
                    {reg.status === "approved" && (
                      <TicketDownload event={reg.event} user={user} />
                    )}
                    {/* Comments Button NOT SHOWN in registered section */}
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
