import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Select from "react-select";


const collegeOptions = [
  { value: "IIT Bombay", label: "IIT Bombay" },
  { value: "IIT Delhi", label: "IIT Delhi" },
  { value: "NIT Trichy", label: "NIT Trichy" },
  { value: "BITS Pilani", label: "BITS Pilani" },
  { value: "Anna University", label: "Anna University" },
];

export default function CreateEvent() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Sports",
    location: "",
    startDate: "",
    endDate: "",
    college: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      // ✅ Auto map category -> image
      const imageMap = {
        Sports: "sports.events.jpg",
        Hackathon: "hackathon.events.jpg",
        Cultural: "cultural.events.jpg",
        Workshop: "workshop.events.jpg",
      };

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

      const response = await axios.post("http://localhost:5000/api/events", eventData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("✅ Event created response:", response.data);

      alert("✅ Event created successfully!");
      // Force refresh by adding timestamp to trigger re-render
      navigate("/dashboard", { replace: true });
      window.location.reload();
    } catch (err) {
      console.error("Event creation error:", err.response || err);
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

          {/* <textarea
            placeholder="Event Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows="3"
            style={inputStyle}
          /> */}

          <input
            type="text"
            placeholder="About the Event Mini 20 words"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            style={inputStyle}
          />

          <label style={labelStyle}>Start Date & Time</label>
          <input
            type="datetime-local"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            required
            style={inputStyle}
          />


          <label style={labelStyle}>End Date & Time</label>
          <input
            type="datetime-local"
            value={form.endDate}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            required
            style={inputStyle}
          />


          <div style={{ marginTop: "10px", marginBottom: "10px", textAlign: "left" }}>
            <label style={labelStyle}>College</label>
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
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  fontSize: "1rem",
                  padding: "2px",
                  marginBottom: "10px",
                }),
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              }}
            />
          </div>


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