import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import CommentsSection from "../components/CommentsSection";

// --- Animated Star Rating Component ---
const StarRating = ({ rating = 0, onRate, readOnly = false }) => {
  const [hover, setHover] = useState(0);
  const [currentRating, setCurrentRating] = useState(rating);
  const [animateStar, setAnimateStar] = useState(0);

  useEffect(() => {
    setCurrentRating(rating);
  }, [rating]);

  const stars = [1, 2, 3, 4, 5];

  const starStyle = (star) => ({
    cursor: readOnly ? "default" : "pointer",
    fontSize: "2rem",
    display: "inline-block",
    marginRight: "5px",
    position: "relative",
    color: "transparent",
    WebkitTextStroke: "1px #FFD700",
    transition: "transform 0.2s, color 0.3s",
  });

  const fillStyle = (star) => ({
    position: "absolute",
    top: 0,
    left: 0,
    width: `${Math.min(1, Math.max(0, (hover || currentRating) >= star ? 1 : 0)) * 100}%`,
    overflow: "hidden",
    color: "#FFD700",
    WebkitTextStroke: "0px",
    transition: "width 0.3s ease",
  });

  const handleClick = (star) => {
    if (readOnly) return;
    setCurrentRating(star);
    setAnimateStar(star);
    setTimeout(() => setAnimateStar(0), 300);
    if (onRate) onRate(star);
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
      {stars.map((star) => (
        <span
          key={star}
          style={{
            ...starStyle(star),
            transform: hover === star || animateStar >= star ? "scale(1.4)" : "scale(1)",
            textShadow:
              star <= (hover || currentRating)
                ? "0 0 10px rgba(255,215,0,0.6)"
                : "none",
          }}
          onClick={() => handleClick(star)}
          onMouseEnter={() => !readOnly && setHover(star)}
          onMouseLeave={() => !readOnly && setHover(0)}
        >
          ★
          <span style={fillStyle(star)}>★</span>
        </span>
      ))}
    </div>
  );
};

export default function EventDetails() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [event, setEvent] = useState(null);
  const [user, setUser] = useState(null);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [userRating, setUserRating] = useState(0);
  const [eventRatings, setEventRatings] = useState({ averageRating: 0, totalRatings: 0 });
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

    axios.get(`${API}/events/${eventId}`)
      .then(res => setEvent(res.data))
      .catch(err => console.error("Failed to load event", err));
    
    axios.get(`${API}/events/${eventId}/ratings`)
      .then(res => setEventRatings(res.data))
      .catch(err => console.error("Failed to load ratings", err));

    if (role === "student" && token) {
      axios.get(`${API}/student/my-events`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setRegisteredEvents(res.data))
      .catch(err => console.error("Failed to load registered events", err));
    }
  }, [eventId, navigate]);

  useEffect(() => {
    if (location.state?.scrollToComments || location.hash === '#comments') {
      setTimeout(() => {
        const commentsSection = document.getElementById('comments-section');
        if (commentsSection) {
          commentsSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
    }
  }, [location, event]);

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
        axios.get(`${API}/student/my-events`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => setRegisteredEvents(res.data));
      } else {
        alert(data.message || "Error registering");
      }
    } catch (err) {
      alert("❌ Network error while registering");
    }
  };

  const handleRating = async (rating) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API}/events/${eventId}/rate`, { rating }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserRating(rating);
      const res = await axios.get(`${API}/events/${eventId}/ratings`);
      setEventRatings(res.data);
      alert("✅ Rating submitted!");
    } catch (err) {
      alert("❌ Failed to submit rating");
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

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", padding: 0 }}>
      <div style={{ width: "100%", maxWidth: "none", margin: 0, background: "white", borderRadius: 0, overflow: "hidden" }}>
        <div style={{ position: "relative", height: "300px" }}>
          <img src={getEventImage(event.category)} alt={event.category} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div style={{ padding: "40px" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "700", color: "#2d3748", marginBottom: "15px", textAlign: "center" }}>{event.title}</h1>
          <div style={{ textAlign: "center" }}>
            <span style={{ display: "inline-block", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white", padding: "8px 20px", borderRadius: "25px", fontSize: "1rem", fontWeight: "600", marginBottom: "20px" }}>
              {event.category}
            </span>
          </div>

          <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "left" }}>
            <div style={{ marginBottom: "25px" }}>
              <h3 style={{ fontSize: "1.3rem", fontWeight: "600", color: "#4a5568", marginBottom: "10px" }}>📅 Event Dates</h3>
              <p style={{ color: "#718096", lineHeight: "1.6", fontSize: "1.1rem" }}>
                <strong>Start:</strong> {new Date(event.startDate).toLocaleDateString()} at {new Date(event.startDate).toLocaleTimeString()}<br/>
                <strong>End:</strong> {new Date(event.endDate).toLocaleDateString()} at {new Date(event.endDate).toLocaleTimeString()}
              </p>
            </div>

            {event.description && (
              <div style={{ marginBottom: "25px" }}>
                <h3 style={{ fontSize: "1.3rem", fontWeight: "600", color: "#4a5568", marginBottom: "10px" }}>📝 Description</h3>
                <p style={{ color: "#718096", lineHeight: "1.6", fontSize: "1.1rem" }}>{event.description}</p>
              </div>
            )}

            {event.location && (
              <div style={{ marginBottom: "25px" }}>
                <h3 style={{ fontSize: "1.3rem", fontWeight: "600", color: "#4a5568", marginBottom: "10px" }}>📍 Location</h3>
                <p style={{ color: "#718096", lineHeight: "1.6", fontSize: "1.1rem" }}>{event.location}</p>
              </div>
            )}

            {event.maxParticipants && (
              <div style={{ marginBottom: "25px" }}>
                <h3 style={{ fontSize: "1.3rem", fontWeight: "600", color: "#4a5568", marginBottom: "10px" }}>👥 Capacity</h3>
                <p style={{ color: "#718096", lineHeight: "1.6", fontSize: "1.1rem" }}>{event.maxParticipants} participants</p>
              </div>
            )}

            {event.organizer && (
              <div style={{ marginBottom: "25px" }}>
                <h3 style={{ fontSize: "1.3rem", fontWeight: "600", color: "#4a5568", marginBottom: "10px" }}>👤 Organizer</h3>
                <p style={{ color: "#718096", lineHeight: "1.6", fontSize: "1.1rem" }}>{event.organizer}</p>
              </div>
            )}

            {/* Animated Event Rating */}
            <div style={{ marginBottom: "25px" }}>
              <h3 style={{ fontSize: "1.3rem", fontWeight: "600", color: "#4a5568", marginBottom: "10px" }}>⭐ Event Rating</h3>
              <div style={{ marginBottom: "10px" }}>
                <StarRating
                  rating={userRating}
                  onRate={handleRating}
                  readOnly={user.role !== "student"}
                />
              </div>
              <span style={{ fontSize: "1.2rem", fontWeight: "600", color: "#4a5568" }}>
                {eventRatings.averageRating.toFixed(1)} ({eventRatings.totalRatings} ratings)
              </span>
            </div>

            {/* Register / Status Buttons */}
            <div style={{ marginTop: "40px", display: "flex", alignItems: "center" }}>
              {user.role === "student" && !isRegistered && (
                <button
                  style={{
                    padding: "15px 30px",
                    background: "linear-gradient(135deg, #48bb78 0%, #38a169 100%)",
                    color: "white",
                    fontWeight: "600",
                    border: "none",
                    borderRadius: "12px",
                    fontSize: "1.1rem",
                    cursor: "pointer",
                    marginRight: "15px",
                    boxShadow: "0 4px 15px rgba(72, 187, 120, 0.3)"
                  }}
                  onClick={handleRegister}
                >
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
              <button
                style={{
                  padding: "15px 30px",
                  background: "#f7fafc",
                  color: "#4a5568",
                  fontWeight: "600",
                  border: "2px solid #e2e8f0",
                  borderRadius: "12px",
                  fontSize: "1.1rem",
                  cursor: "pointer",
                }}
                onClick={() => navigate("/dashboard")}
              >
                ← Back to Dashboard
              </button>
            </div>

            {/* Comments Section */}
            <div id="comments-section" style={{ marginTop: "40px", borderTop: "2px solid #e2e8f0", paddingTop: "30px" }}>
              <h3 style={{ fontSize: "1.3rem", fontWeight: "600", color: "#4a5568", marginBottom: "10px" }}>💬 Comments & Discussion</h3>
              <CommentsSection eventId={eventId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
