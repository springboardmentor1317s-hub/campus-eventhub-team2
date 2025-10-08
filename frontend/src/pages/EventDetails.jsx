import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function EventDetails() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [user, setUser] = useState(null);
  const [registeredEvents, setRegisteredEvents] = useState([]);
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

    // Load event details
    axios.get(`${API}/events/${eventId}`)
      .then(res => setEvent(res.data))
      .catch(err => console.error("Failed to load event", err));

    // Load registered events for students
    if (role === "student" && token) {
      axios.get(`${API}/student/my-events`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setRegisteredEvents(res.data))
      .catch(err => console.error("Failed to load registered events", err));
    }
  }, [eventId, navigate]);

  const handleRegister = async () => {
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
        // Refresh registered events
        axios.get(`${API}/student/my-events`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => setRegisteredEvents(res.data))
        .catch(err => console.error("Failed to refresh registered events", err));
      } else {
        alert(data.message || "Error registering");
      }
    } catch (err) {
      alert("❌ Network error while registering");
    }
  };

  const getEventImage = (category) => {
    switch (category) {
      case "Sports": return "/sports.events.jpg";
      case "Hackathon": return "/hackathon.events.jpg";
      case "Cultural": return "/cultural.events.jpg";
      case "Workshop": return "/workshop.events.jpg";
      default: return "/default.jpg";
    }
  };

  if (!event || !user) return <p style={{ textAlign: "center" }}>Loading...</p>;

  const isRegistered = registeredEvents.find(r => r.event._id === eventId);

  const containerStyle = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "40px 20px",
  };

  const cardStyle = {
    maxWidth: "800px",
    margin: "0 auto",
    background: "white",
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)",
  };

  const headerStyle = {
    position: "relative",
    height: "300px",
  };

  const contentStyle = {
    padding: "40px",
  };

  const titleStyle = {
    fontSize: "2.5rem",
    fontWeight: "700",
    color: "#2d3748",
    marginBottom: "15px",
    fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
  };

  const categoryStyle = {
    display: "inline-block",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    padding: "8px 20px",
    borderRadius: "25px",
    fontSize: "1rem",
    fontWeight: "600",
    marginBottom: "20px",
  };

  const sectionStyle = {
    marginBottom: "25px",
  };

  const sectionTitleStyle = {
    fontSize: "1.3rem",
    fontWeight: "600",
    color: "#4a5568",
    marginBottom: "10px",
  };

  const textStyle = {
    color: "#718096",
    lineHeight: "1.6",
    fontSize: "1.1rem",
  };

  const buttonStyle = {
    padding: "15px 30px",
    background: "linear-gradient(135deg, #48bb78 0%, #38a169 100%)",
    color: "white",
    fontWeight: "600",
    border: "none",
    borderRadius: "12px",
    fontSize: "1.1rem",
    cursor: "pointer",
    marginRight: "15px",
    boxShadow: "0 4px 15px rgba(72, 187, 120, 0.3)",
  };

  const backButtonStyle = {
    padding: "15px 30px",
    background: "#f7fafc",
    color: "#4a5568",
    fontWeight: "600",
    border: "2px solid #e2e8f0",
    borderRadius: "12px",
    fontSize: "1.1rem",
    cursor: "pointer",
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <img
            src={getEventImage(event.category)}
            alt={event.category}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
        <div style={contentStyle}>
          <h1 style={titleStyle}>{event.title}</h1>
          <span style={categoryStyle}>{event.category}</span>
          
          <div style={sectionStyle}>
            <h3 style={sectionTitleStyle}>📅 Event Dates</h3>
            <p style={textStyle}>
              <strong>Start:</strong> {new Date(event.startDate).toLocaleDateString()} at {new Date(event.startDate).toLocaleTimeString()}<br/>
              <strong>End:</strong> {new Date(event.endDate).toLocaleDateString()} at {new Date(event.endDate).toLocaleTimeString()}
            </p>
          </div>
          
          {event.description && (
            <div style={sectionStyle}>
              <h3 style={sectionTitleStyle}>📝 Description</h3>
              <p style={textStyle}>{event.description}</p>
            </div>
          )}
          
          {event.location && (
            <div style={sectionStyle}>
              <h3 style={sectionTitleStyle}>📍 Location</h3>
              <p style={textStyle}>{event.location}</p>
            </div>
          )}
          
          {event.maxParticipants && (
            <div style={sectionStyle}>
              <h3 style={sectionTitleStyle}>👥 Capacity</h3>
              <p style={textStyle}>{event.maxParticipants} participants</p>
            </div>
          )}
          
          {event.organizer && (
            <div style={sectionStyle}>
              <h3 style={sectionTitleStyle}>👤 Organizer</h3>
              <p style={textStyle}>{event.organizer}</p>
            </div>
          )}
          
          <div style={{ marginTop: "40px", display: "flex", alignItems: "center" }}>
            {user.role === "student" && !isRegistered && (
              <button style={buttonStyle} onClick={handleRegister}>
                ✨ Register for Event
              </button>
            )}
            {user.role === "student" && isRegistered && (
              <div style={{
                padding: "10px 20px",
                borderRadius: "20px",
                fontSize: "1rem",
                fontWeight: "600",
                marginRight: "15px",
                background: isRegistered.status === "approved" ? "#48bb78" : isRegistered.status === "rejected" ? "#f56565" : "#ed8936",
                color: "white"
              }}>
                {isRegistered.status === "approved" ? "✅ Approved" : isRegistered.status === "rejected" ? "❌ Rejected" : "⏳ Pending"}
              </div>
            )}
            <button style={backButtonStyle} onClick={() => navigate("/dashboard")}>
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}