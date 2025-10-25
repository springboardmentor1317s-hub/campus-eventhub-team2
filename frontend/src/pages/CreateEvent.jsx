import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import Select from "react-select";


const collegeOptions = [
  { value: "IIT Bombay", label: "IIT Bombay" },
  { value: "IIT Delhi", label: "IIT Delhi" },
  { value: "NIT Trichy", label: "NIT Trichy" },
  { value: "BITS Pilani", label: "BITS Pilani" },
  { value: "Anna University", label: "Anna University" },
];

export default function CreateEvent() {
  
  const handleInputFocus = (e) => {
    e.target.style.borderColor = "#1e40af";
    e.target.style.boxShadow = "0 4px 12px rgba(30, 64, 175, 0.15)";
  };
  
  const handleInputBlur = (e) => {
    e.target.style.borderColor = "#e2e8f0";
    e.target.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.05)";
  };
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Sports",
    location: "",
    startDate: "",
    endDate: "",
    college: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [eventId, setEventId] = useState(null);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const editId = searchParams.get('edit');
    if (editId) {
      setIsEditing(true);
      setEventId(editId);
      loadEventData(editId);
    }
  }, [searchParams]);

  const loadEventData = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:5000/api/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const event = response.data;
      setForm({
        title: event.title || "",
        description: event.description || "",
        category: event.category || "Sports",
        location: event.location || "",
        startDate: event.startDate ? new Date(event.startDate).toISOString().slice(0, 16) : "",
        endDate: event.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : "",
        college: event.college || "",
      });
    } catch (err) {
      console.error("Failed to load event data:", err);
      alert("Failed to load event data");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      const eventData = {
        title: form.title,
        description: form.description,
        category: form.category,
        location: form.location,
        startDate: form.startDate,
        endDate: form.endDate,
        college: form.college,
      };

      console.log("📤 Sending event data:", eventData);

      let response;
      if (isEditing) {
        response = await axios.put(`http://localhost:5000/api/events/${eventId}`, eventData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("✅ Event updated successfully!");
      } else {
        response = await axios.post("http://localhost:5000/api/events", eventData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("✅ Event created successfully!");
      }

      console.log("✅ Event response:", response.data);
      navigate("/dashboard", { replace: true });
      window.location.reload();
    } catch (err) {
      console.error("Event operation error:", err.response || err);
      alert(err.response?.data?.error || `❌ Failed to ${isEditing ? 'update' : 'create'} event`);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 50%, #bfdbfe 100%)",
        padding: window.innerWidth <= 768 ? "1rem" : "2rem",
      }}
    >
      <div
        style={{
          background: "white",
          padding: window.innerWidth <= 768 ? "1.5rem" : "3rem",
          borderRadius: window.innerWidth <= 768 ? "12px" : "20px",
          boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)",
          width: "100%",
          maxWidth: window.innerWidth <= 768 ? "100%" : "600px",
          textAlign: "left",
        }}
      >
        <h2 style={{ 
          marginBottom: window.innerWidth <= 768 ? "1.5rem" : "2rem", 
          color: "#2d3748", 
          textAlign: "center",
          fontSize: window.innerWidth <= 768 ? "1.8rem" : "2.5rem",
          fontWeight: "700",
          fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif"
        }}>
          {isEditing ? "✏️ Edit Event" : "📅 Create New Event"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={fieldContainer}>
            <label style={labelStyle}>📝 Event Title</label>
            <input
              type="text"
              placeholder="Enter event title (e.g., Annual Sports Meet 2024)"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              required
              style={inputStyle}
            />
          </div>

          <div style={fieldContainer}>
            <label style={labelStyle}>📄 Event Description</label>
            <textarea
              placeholder="Describe your event in detail (minimum 20 words)..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              rows="4"
              style={{...inputStyle, resize: "vertical"}}
            />
          </div>

          <div style={fieldContainer}>
            <label style={labelStyle}>📍 Event Location</label>
            <input
              type="text"
              placeholder="Where will the event take place? (e.g., Main Auditorium, Sports Complex)"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              style={inputStyle}
            />
          </div>

          <div style={fieldContainer}>
            <label style={labelStyle}>🕐 Start Date & Time</label>
            <input
              type="datetime-local"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              required
              style={inputStyle}
            />
          </div>

          <div style={fieldContainer}>
            <label style={labelStyle}>🕕 End Date & Time</label>
            <input
              type="datetime-local"
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              required
              style={inputStyle}
            />
          </div>

          <div style={fieldContainer}>
            <label style={labelStyle}>🏫 College</label>
            <Select
              options={collegeOptions}
              placeholder="Select your college"
              value={
                form.college
                  ? collegeOptions.find((opt) => opt.value === form.college)
                  : null
              }
              onChange={(selected) =>
                setForm({ ...form, college: selected?.value || "" })
              }
              isSearchable
              menuPortalTarget={document.body}
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: "12px",
                  border: "2px solid #e2e8f0",
                  fontSize: "1rem",
                  padding: "8px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                }),
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              }}
            />
          </div>

          <div style={fieldContainer}>
            <label style={labelStyle}>🎯 Event Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              style={inputStyle}
            >
              <option value="Sports">⚽ Sports</option>
              <option value="Hackathon">💻 Hackathon</option>
              <option value="Cultural">🎭 Cultural</option>
              <option value="Workshop">🛠️ Workshop</option>
            </select>
          </div>

          <button type="submit" style={buttonStyle}>
            {isEditing ? "✏️ Update Event" : "🎉 Create Event"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ✅ Styles
const fieldContainer = {
  marginBottom: "1.5rem",
};

const inputStyle = {
  width: "100%",
  padding: "15px",
  borderRadius: "12px",
  border: "2px solid #e2e8f0",
  fontSize: "1rem",
  fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
  transition: "all 0.3s ease",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
};

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  fontSize: "1.1rem",
  fontWeight: "600",
  color: "#2d3748",
  fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
};

const buttonStyle = {
  width: "100%",
  padding: "18px",
  marginTop: "2rem",
  background: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #3b82f6 100%)",
  color: "white",
  border: "none",
  borderRadius: "12px",
  fontSize: "1.2rem",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.3s ease",
  boxShadow: "0 6px 20px rgba(30, 58, 138, 0.3)",
  fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
};