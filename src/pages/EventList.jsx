import { useEffect, useState } from "react";
import axios from "axios";

export default function EventList() {
  const [events, setEvents] = useState([]);
  const [sortOption, setSortOption] = useState("date");
  const [filterCategory, setFilterCategory] = useState("all"); // ✅ new filter

  useEffect(() => {
    axios
      .get("/api/events")
      .then((res) => setEvents(res.data))
      .catch((err) => console.error("Failed to load events", err));
  }, []);

  // ✅ Filtering logic
  const filteredEvents =
    filterCategory === "all"
      ? events
      : events.filter((event) => event.category.toLowerCase() === filterCategory);

  // ✅ Sorting logic
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
        <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
          <option value="date">Start Date</option>
          <option value="category">Category (A-Z)</option>
        </select>

        <label style={{ margin: "0 10px" }}>Filter by:</label>
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
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
        <ul style={{ marginTop: "1rem" }}>
          {sortedEvents.map((event) => (
            <li key={event._id} style={eventCard}>
              <strong>{event.title}</strong> ({event.category}) <br />
              📍 {event.location || "N/A"} <br />
              {new Date(event.startDate).toLocaleDateString()} -{" "}
              {new Date(event.endDate).toLocaleDateString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ✅ Styles
const eventCard = {
  background: "#fff",
  padding: "1rem",
  marginBottom: "10px",
  borderRadius: "8px",
  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
};
