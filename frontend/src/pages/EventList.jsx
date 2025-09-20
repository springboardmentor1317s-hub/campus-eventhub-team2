import { useEffect, useState } from "react";
import axios from "axios";

export default function EventList() {
  const [events, setEvents] = useState([]);
  const [sortOption, setSortOption] = useState("date");
  const [filterCategory, setFilterCategory] = useState("all");

  useEffect(() => {
    axios
      .get("/api/events")
      .then((res) => setEvents(res.data))
      .catch((err) => console.error("Failed to load events", err));
  }, []);

  // ✅ Filtering
  const filteredEvents =
    filterCategory === "all"
      ? events
      : events.filter(
          (event) => event.category.toLowerCase() === filterCategory.toLowerCase()
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

  return (
    <div style={{ padding: "2rem" }}>
      <h2>📅 Upcoming Events</h2>

      {/* Sorting & Filtering Controls */}
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

      {/* Event List */}
      {sortedEvents.length === 0 ? (
        <p>No events available.</p>
      ) : (
        <div style={{ display: "grid", gap: "1rem" }}>
          {sortedEvents.map((event) => (
            <div key={event._id} style={eventCard}>
              {/* ✅ Left side image */}
              <div style={{ flex: "1" }}>
                <img
                  src={`/${event.image || "default.jpg"}`}
                  alt={event.category}
                  style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                  onError={(e) => {
                    e.target.src = "/default.jpg";
                  }}
                />
              </div>

              {/* ✅ Right side details */}
              <div style={{ flex: "2", paddingLeft: "1rem" }}>
                <h3 style={{ margin: "0 0 8px" }}>{event.title}</h3>
                <p style={{ margin: "0 0 6px", color: "#555" }}>
                  <strong>Category:</strong> {event.category}
                </p>
                <p style={{ margin: "0 0 6px" }}>
                  📍 {event.location || "N/A"}
                </p>
                <p style={{ margin: "0 0 6px" }}>
                  {new Date(event.startDate).toLocaleDateString()} -{" "}
                  {new Date(event.endDate).toLocaleDateString()}
                </p>
                <p style={{ margin: "0", color: "#666" }}>
                  {event.description || "No description available"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ✅ Styles
const eventCard = {
  display: "flex",
  alignItems: "flex-start",
  background: "#fff",
  padding: "1rem",
  borderRadius: "10px",
  boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
};
