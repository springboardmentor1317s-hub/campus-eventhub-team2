import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [sortOption, setSortOption] = useState("date");
  const [filterCategory, setFilterCategory] = useState("all");
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalRegistrations: 0,
    activeUsers: 0,
    pendingReviews: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const name = localStorage.getItem("name");
    const role = localStorage.getItem("role");
    const userId = localStorage.getItem("userId");

    if (!name || !role) {
      navigate("/login");
    } else {
      setUser({ name, role, id: userId });
    }

    // ✅ Fetch events
    axios
      .get("/api/events")
      .then((res) => setEvents(res.data))
      .catch((err) => console.error("Failed to load events", err));

    // ✅ Fetch stats only for admins
    if (role === "college_admin") {
      axios
        .get("/api/admin/stats")
        .then((res) => setStats(res.data))
        .catch((err) => console.error("Failed to load stats", err));
    }
  }, [navigate]);

  if (!user) return <p style={{ textAlign: "center" }}>Loading...</p>;

  // ✅ Filtering
  const filteredEvents =
    filterCategory === "all"
      ? events
      : events.filter(
          (event) => event.category.toLowerCase() === filterCategory
        );

  // ✅ Sorting
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (sortOption === "date") {
      return new Date(a.startDate) - new Date(b.startDate);
    }
    if (sortOption === "category") {
      return a.category.localeCompare(b.category);
    }
    return 0;
  });

  // ✅ Registered Events
  const registeredEvents = events.filter((event) =>
    event.registrations?.includes(user.id)
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "2rem",
        backgroundColor: user.role === "student" ? "#000" : "#f4f7fb",
        backgroundImage:
          user.role === "student"
            ? "url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=80')"
            : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          background:
            user.role === "student"
              ? "rgba(255, 255, 255, 0.9)"
              : "white",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
        }}
      >
        <h1>
          📊{" "}
          {user.role === "college_admin"
            ? "Admin Dashboard"
            : "Student Dashboard"}
        </h1>
        <h2>Welcome, {user.name}!</h2>

        {/* ======================== */}
        {/* ADMIN DASHBOARD */}
        {/* ======================== */}
        {user.role === "college_admin" && (
          <>
            <div style={statsGrid}>
              <div style={statCard}>📈 View Analytics</div>
              <div style={statCard}>
                📅 Total Events: {stats.totalEvents}
              </div>
              <div style={statCard}>
                👥 Active Users: {stats.activeUsers}
              </div>
              <div style={statCard}>
                📝 Total Registrations: {stats.totalRegistrations}
              </div>
              <div style={statCard}>
                ⏳ Pending Reviews: {stats.pendingReviews}
              </div>
            </div>

            <div style={{ marginTop: "2rem" }}>
              <h3>📅 All Events</h3>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ marginRight: "10px" }}>Sort by:</label>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="date">Start Date</option>
                  <option value="category">Category (A-Z)</option>
                </select>

                <label style={{ margin: "0 10px" }}>Filter by:</label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="sports">Sports</option>
                  <option value="hackathon">Hackathon</option>
                  <option value="cultural">Cultural</option>
                  <option value="workshop">Workshop</option>
                </select>
              </div>

              {sortedEvents.length === 0 ? (
                <p>No events found.</p>
              ) : (
                <ul style={{ marginTop: "1rem" }}>
                  {sortedEvents.map((event) => (
                    <li key={event._id} style={eventItem}>
                      <strong>{event.title}</strong> ({event.category}) <br />
                      📍 {event.location || "N/A"} <br />
                      {new Date(event.startDate).toLocaleDateString()} -{" "}
                      {new Date(event.endDate).toLocaleDateString()}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}

        {/* ======================== */}
        {/* STUDENT DASHBOARD */}
        {/* ======================== */}
        {user.role === "student" && (
          <>
            {/* Upcoming Events */}
            <div style={{ marginTop: "2rem" }}>
              <h3>📅 Upcoming Events</h3>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ marginRight: "10px" }}>Sort by:</label>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="date">Start Date</option>
                  <option value="category">Category (A-Z)</option>
                </select>

                <label style={{ margin: "0 10px" }}>Filter by:</label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="sports">Sports</option>
                  <option value="hackathon">Hackathon</option>
                  <option value="cultural">Cultural</option>
                  <option value="workshop">Workshop</option>
                </select>
              </div>

              {sortedEvents.length === 0 ? (
                <p>No upcoming events.</p>
              ) : (
                <ul style={{ marginTop: "1rem" }}>
                  {sortedEvents.map((event) => (
                    <li key={event._id} style={eventItem}>
                      <strong>{event.title}</strong> ({event.category}) <br />
                      📍 {event.location || "N/A"} <br />
                      {new Date(event.startDate).toLocaleDateString()} -{" "}
                      {new Date(event.endDate).toLocaleDateString()} <br />
                      <button style={registerBtn}>Register</button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Registered Events */}
            <div style={{ marginTop: "2rem" }}>
              <h3>✅ Your Registered Events</h3>
              {registeredEvents.length === 0 ? (
                <p>You haven’t registered for any events yet.</p>
              ) : (
                <ul style={{ marginTop: "1rem" }}>
                  {registeredEvents.map((event) => (
                    <li key={event._id} style={eventItem}>
                      <strong>{event.title}</strong> ({event.category}) <br />
                      📍 {event.location || "N/A"} <br />
                      {new Date(event.startDate).toLocaleDateString()} -{" "}
                      {new Date(event.endDate).toLocaleDateString()}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Live Poll */}
            <div style={{ marginTop: "2rem" }}>
              <h3>📊 Live Poll</h3>
              <p>Vote and see results during events. (Feature coming soon 🚀)</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ✅ Styles
const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "1rem",
  marginTop: "1.5rem",
};

const statCard = {
  background: "#3498db",
  color: "white",
  padding: "1rem",
  borderRadius: "10px",
  textAlign: "center",
  fontWeight: "bold",
};

const eventItem = {
  background: "#f9f9f9",
  padding: "1rem",
  borderRadius: "8px",
  marginBottom: "10px",
  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
};

const registerBtn = {
  marginTop: "0.5rem",
  padding: "6px 12px",
  backgroundColor: "#3498db",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};
