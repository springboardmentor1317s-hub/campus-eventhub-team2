import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CreateEvent() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Sports",
    location: "",
    startDate: "",
    endDate: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("/api/events", form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("✅ Event created successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Event creation error:", err.response || err); // log full error
      alert(err.response?.data?.error || "❌ Failed to create event");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f7fa",
        padding: "2rem",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: "500px",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "1.5rem", color: "#2c3e50" }}>
          📅 Create New Event
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Event Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            style={inputStyle}
          />

          <textarea
            placeholder="Event Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows="3"
            style={inputStyle}
          />

          <input
            type="text"
            placeholder="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            style={inputStyle}
          />

          <label style={labelStyle}>Start Date</label>
          <input
            type="date"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            required
            style={inputStyle}
          />

          <label style={labelStyle}>End Date</label>
          <input
            type="date"
            value={form.endDate}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            required
            style={inputStyle}
          />

          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            style={inputStyle}
          >
            <option value="Sports">Sports</option>
            <option value="Hackathon">Hackathon</option>
            <option value="Cultural">Cultural</option>
            <option value="Workshop">Workshop</option>
          </select>

          <button type="submit" style={buttonStyle}>
            Create Event
          </button>
        </form>
      </div>
    </div>
  );
}

// ✅ Styles
const inputStyle = {
  width: "100%",
  padding: "12px",
  margin: "10px 0",
  borderRadius: "6px",
  border: "1px solid #ccc",
  fontSize: "1rem",
};

const labelStyle = {
  display: "block",
  marginTop: "10px",
  marginBottom: "4px",
  textAlign: "left",
  fontSize: "0.9rem",
  color: "#555",
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "15px",
  backgroundColor: "#27ae60",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  fontSize: "1rem",
  cursor: "pointer",
  transition: "0.3s",
};
