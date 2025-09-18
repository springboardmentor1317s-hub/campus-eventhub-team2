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

    axios
      .get("/api/events")
      .then((res) => setEvents(res.data))
      .catch((err) => console.error("Failed to load events", err));

    if (role === "college_admin") {
      axios
        .get("/api/admin/stats")
        .then((res) => setStats(res.data))
        .catch((err) => console.error("Failed to load stats", err));
    }
  }, [navigate]);

  if (!user) return <p style={{ textAlign: "center" }}>Loading...</p>;

  // Filtering
  const filteredEvents =
    filterCategory === "all"
      ? events
      : events.filter(
          (event) => event.category.toLowerCase() === filterCategory
        );

  // Sorting
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (sortOption === "date") {
      return new Date(a.startDate) - new Date(b.startDate);
    }
    if (sortOption === "category") {
      return a.category.localeCompare(b.category);
    }
    return 0;
  });

  // Registered Events
  const registeredEvents = events.filter((event) =>
    event.registrations?.includes(user.id)
  );

  // Shared styles
  const containerOuter = {
    minHeight: "100vh",
    width: "100vw",
    background: "linear-gradient(120deg, #eaf6ff 60%, #d4edfb 100%)",
    margin: 0,
    padding: 0,
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

<<<<<<< HEAD
const statsGrid = {
  background: "#fff",
  padding: "10px",
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  textAlign: "center",
  fontWeight: "600",
  height: "120px", // ✅ sab ka height equal
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "25px",
};

=======
  const statsGrid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "1.7rem",
    marginTop: "2.2rem",
  };
>>>>>>> 691d12a1436471119c9ea769cc0bcdf3163c5867

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
    display: "flex",
    flexDirection: "column",
    transition: "box-shadow .15s",
    position: "relative",
  };

  const eventCardRegistered = {
    background: "#f7fff9",
    borderRadius: "17px",
    boxShadow: "0 6px 34px 0px #e0faed",
    padding: "2rem 1.3rem 1.2rem 1.3rem",
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
    transition: "background .18s",
    alignSelf: "start",
  };

  // ✅ Shared dropdown styles with hover
  const selectStyle = {
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #0996e6",
    fontSize: "1rem",
    color: "#14476f",
    cursor: "pointer",
    transition: "all 0.2s ease",
  };

  return (
    <div style={containerOuter}>
      <div style={containerInner}>
        <h1>
          📊 {user.role === "college_admin" ? "Admin Dashboard" : "Student Dashboard"}
        </h1>
        <h2>Welcome, {user.name}!</h2>

        {/* Admin Dashboard */}
<<<<<<< HEAD
{user.role === "college_admin" && (
  <>
    <div style={statsGrid}>
      <div style={statCard}>📈 View Analytics</div>
      <div style={statCard}>📅 Total Events: {stats.totalEvents}</div>
      <div style={statCard}>👥 Active Users: {stats.activeUsers}</div>
      <div style={statCard}>📝 Total Registrations: {stats.totalRegistrations}</div>
      <div style={statCard}>⏳ Pending Reviews: {stats.pendingReviews}</div>
    </div>

    <div style={{ marginTop: "2rem" }}>
      <h3>📅 All Events</h3>

      {/* ✅ Styled Sorting + Filtering */}
      <div
        style={{
          marginBottom: "2.5rem",
          fontSize: "1.1rem",
          fontWeight: "500",
          color: "#0996e6",
        }}
      >
        <label style={{ marginRight: "12px" }}>Sort by:</label>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          style={selectStyle}
          onMouseEnter={(e) => (e.target.style.border = "1px solid #007acc")}
          onMouseLeave={(e) => (e.target.style.border = "1px solid #0996e6")}
        >
          <option value="date">Start Date</option>
          <option value="category">Category (A-Z)</option>
        </select>

        <label style={{ margin: "0 12px" }}>Filter by:</label>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          style={selectStyle}
          onMouseEnter={(e) => (e.target.style.border = "1px solid #007acc")}
          onMouseLeave={(e) => (e.target.style.border = "1px solid #0996e6")}
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
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "20px",
            marginTop: "1rem",
          }}
        >
          {sortedEvents.map((event) => (
            <div
              key={event._id}
              style={{
                background: "#fff",
                borderRadius: "16px",
                padding: "18px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow =
                  "0 6px 16px rgba(0,0,0,0.2)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.boxShadow =
                  "0 2px 8px rgba(0,0,0,0.1)")
              }
            >
              <strong style={{ fontSize: "1.25rem", color: "#14476f" }}>
                {event.title}
              </strong>
              <span
                style={{
                  background: "#e4f1fb",
                  color: "#2384cb",
                  marginLeft: "10px",
                  padding: "3px 12px",
                  borderRadius: "18px",
                  fontSize: "0.98rem",
                }}
              >
                {event.category}
              </span>

              <div
                style={{
                  margin: "12px 0 14px 0",
                  color: "#666",
                  fontSize: "1.04rem",
                }}
              >
                📍 {event.location || "N/A"}
              </div>

              <div
                style={{
                  color: "#888",
                  fontSize: "0.97rem",
                  marginBottom: "8px",
                }}
              >
                {new Date(event.startDate).toLocaleDateString()} -{" "}
                {new Date(event.endDate).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </>
)}

=======
        {user.role === "college_admin" && (
          <>
            <div style={statsGrid}>
              <div style={statCard}>📈 View Analytics</div>
              <div style={statCard}>📅 Total Events: {stats.totalEvents}</div>
              <div style={statCard}>👥 Active Users: {stats.activeUsers}</div>
              <div style={statCard}>📝 Total Registrations: {stats.totalRegistrations}</div>
              <div style={statCard}>⏳ Pending Reviews: {stats.pendingReviews}</div>
            </div>

            <div style={{ marginTop: "2rem" }}>
              <h3>📅 All Events</h3>

              {/* ✅ Styled Sorting + Filtering */}
              <div
                style={{
                  marginBottom: "1rem",
                  fontSize: "1.1rem",
                  fontWeight: "500",
                  color: "#0996e6",
                }}
              >
                <label style={{ marginRight: "12px" }}>Sort by:</label>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  style={selectStyle}
                  onMouseEnter={(e) =>
                    (e.target.style.border = "1px solid #007acc")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.border = "1px solid #0996e6")
                  }
                >
                  <option value="date">Start Date</option>
                  <option value="category">Category (A-Z)</option>
                </select>

                <label style={{ margin: "0 12px" }}>Filter by:</label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  style={selectStyle}
                  onMouseEnter={(e) =>
                    (e.target.style.border = "1px solid #007acc")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.border = "1px solid #0996e6")
                  }
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
                <ul style={{ marginTop: "1rem", paddingLeft: 0, listStyle: "none" }}>
                  {sortedEvents.map((event) => (
                    <li key={event._id} style={{ ...eventCard, marginBottom: "20px" }}>
                      <strong style={{ fontSize: "1.25rem", color: "#14476f" }}>
                        {event.title}
                      </strong>{" "}
                      <span
                        style={{
                          background: "#e4f1fb",
                          color: "#2384cb",
                          marginLeft: "10px",
                          padding: "3px 12px",
                          borderRadius: "18px",
                          fontSize: "0.98rem",
                        }}
                      >
                        {event.category}
                      </span>
                      <div
                        style={{
                          margin: "10px 0 14px 0",
                          color: "#666",
                          fontSize: "1.04rem",
                        }}
                      >
                        📍 {event.location || "N/A"}
                      </div>
                      <div
                        style={{
                          color: "#888",
                          fontSize: "0.97rem",
                          marginBottom: "8px",
                        }}
                      >
                        {new Date(event.startDate).toLocaleDateString()} -{" "}
                        {new Date(event.endDate).toLocaleDateString()}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
>>>>>>> 691d12a1436471119c9ea769cc0bcdf3163c5867

        {/* Student Dashboard */}
        {user.role === "student" && (
          <>
            {/* ✅ Styled Sorting + Filtering */}
            <div
              style={{
                marginBottom: "1rem",
                fontSize: "1.1rem",
                fontWeight: "500",
                color: "#0996e6",
              }}
            >
              <label style={{ marginRight: "12px" }}>Sort by:</label>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                style={selectStyle}
                onMouseEnter={(e) =>
                  (e.target.style.border = "1px solid #007acc")
                }
                onMouseLeave={(e) =>
                  (e.target.style.border = "1px solid #0996e6")
                }
              >
                <option value="date">Start Date</option>
                <option value="category">Category (A-Z)</option>
              </select>

              <label style={{ margin: "0 12px" }}>Filter by:</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                style={selectStyle}
                onMouseEnter={(e) =>
                  (e.target.style.border = "1px solid #007acc")
                }
                onMouseLeave={(e) =>
                  (e.target.style.border = "1px solid #0996e6")
                }
              >
                <option value="all">All</option>
                <option value="sports">Sports</option>
                <option value="hackathon">Hackathon</option>
                <option value="cultural">Cultural</option>
                <option value="workshop">Workshop</option>
              </select>
            </div>

            {/* Upcoming Events Cards */}
            <section>
              <h3 style={{ fontSize: "1.35rem", color: "#12649a", marginBottom: "20px" }}>
                Upcoming Events
              </h3>
              {sortedEvents.length === 0 ? (
                <p>No upcoming events.</p>
              ) : (
                <div style={eventCardGrid}>
                  {sortedEvents.map((event) => (
                    <div key={event._id} style={eventCard}>
                      <div>
                        <strong style={{ fontSize: "1.3rem", color: "#14476f" }}>
                          {event.title}
                        </strong>
                        <span
                          style={{
                            background: "#e4f1fb",
                            color: "#2384cb",
                            marginLeft: "10px",
                            padding: "3px 12px",
                            borderRadius: "18px",
                            fontSize: "0.98rem",
                          }}
                        >
                          {event.category}
                        </span>
                      </div>
                      <div
                        style={{
                          margin: "10px 0 14px 0",
                          color: "#666",
                          fontSize: "1.04rem",
                        }}
                      >
                        📍 {event.location || "N/A"}
                      </div>
                      <div
                        style={{
                          color: "#888",
                          fontSize: "0.97rem",
                          marginBottom: "8px",
                        }}
                      >
                        {new Date(event.startDate).toLocaleDateString()} -{" "}
                        {new Date(event.endDate).toLocaleDateString()}
                      </div>
                      <button style={registerBtn}>Register</button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Registered Events Cards */}
            <section style={{ marginTop: "3.3rem" }}>
              <h3 style={{ fontSize: "1.19rem", color: "#1b7e59", marginBottom: "18px" }}>
                Your Registered Events
              </h3>
              {registeredEvents.length === 0 ? (
                <p>You haven’t registered for any events yet.</p>
              ) : (
                <div style={eventCardGrid}>
                  {registeredEvents.map((event) => (
                    <div key={event._id} style={eventCardRegistered}>
                      <strong style={{ fontSize: "1.18rem", color: "#137d52" }}>
                        {event.title}
                      </strong>
                      <span
                        style={{
                          background: "#e9fff0",
                          color: "#1b7e59",
                          marginLeft: "10px",
                          padding: "3px 12px",
                          borderRadius: "18px",
                          fontSize: "0.96rem",
                        }}
                      >
                        {event.category}
                      </span>
                      <div
                        style={{
                          margin: "10px 0 10px 0",
                          color: "#16623c",
                          fontSize: "1.03rem",
                        }}
                      >
                        📍 {event.location || "N/A"}
                      </div>
                      <div style={{ color: "#488a60", fontSize: "0.97rem" }}>
                        {new Date(event.startDate).toLocaleDateString()} -{" "}
                        {new Date(event.endDate).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Live Poll */}
            <section style={{ marginTop: "2.8rem" }}>
              <h3 style={{ fontSize: "1.08rem", color: "#0075C4" }}>Live Poll</h3>
              <p style={{ color: "#444", fontSize: "1rem" }}>
                Vote and see results during events. (Feature coming soon 🚀)
              </p>
            </section>
          </>
        )}
      </div>
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 691d12a1436471119c9ea769cc0bcdf3163c5867
