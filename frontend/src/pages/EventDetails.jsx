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

  const createSparkles = () => {
    const sparkleContainer = document.createElement('div');
    sparkleContainer.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999';
    document.body.appendChild(sparkleContainer);
    
    for(let i = 0; i < 15; i++) {
      const sparkle = document.createElement('div');
      sparkle.innerHTML = '✨';
      sparkle.style.cssText = `position:absolute;font-size:${Math.random()*20+15}px;left:${Math.random()*100}%;top:${Math.random()*100}%;animation:sparkleBlast 3s ease-out forwards`;
      sparkleContainer.appendChild(sparkle);
    }
    
    setTimeout(() => document.body.removeChild(sparkleContainer), 3000);
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
      createSparkles();
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
    <div style={{ minHeight: "100vh", background: "white", padding: 0 }}>
      <div style={{ position: "relative", height: "300px" }}>
        <img src={getEventImage(event.category)} alt={event.category} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "700", color: "#2d3748", marginBottom: "15px", textAlign: "center" }}>{event.title}</h1>
          <div style={{ textAlign: "center" }}>
            <span style={{ display: "inline-block", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white", padding: "8px 20px", borderRadius: "25px", fontSize: "1rem", fontWeight: "600", marginBottom: "20px" }}>
              {event.category}
            </span>
          </div>

          <div style={{ width: "100%", margin: 0, textAlign: "left", padding: "0 20px" }}>
            <style>{`
              @media (max-width: 768px) {
                .event-grid { grid-template-columns: 1fr !important; }
                .event-section { padding: 15px !important; margin-bottom: 20px !important; }
                .event-title { font-size: 1.2rem !important; }
                .event-content { font-size: 1rem !important; }
                .button-container { flex-direction: column !important; gap: 10px !important; }
                .event-button { width: 100% !important; margin-right: 0 !important; }
              }
            `}</style>
            <div className="event-section" style={{ marginBottom: "30px", padding: "20px", background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)", borderRadius: "15px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}>
              <h3 className="event-title" style={{ fontSize: "1.4rem", fontWeight: "700", color: "#2d3748", marginBottom: "15px", display: "flex", alignItems: "center", gap: "10px" }}>📅 Event Schedule</h3>
              <div className="event-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                <div style={{ padding: "15px", background: "white", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                  <div style={{ color: "#48bb78", fontWeight: "600", fontSize: "0.9rem", marginBottom: "5px" }}>🚀 START</div>
                  <div style={{ color: "#2d3748", fontWeight: "600", fontSize: "1.1rem" }}>{new Date(event.startDate).toLocaleDateString()}</div>
                  <div style={{ color: "#718096", fontSize: "0.95rem" }}>{new Date(event.startDate).toLocaleTimeString()}</div>
                </div>
                <div style={{ padding: "15px", background: "white", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                  <div style={{ color: "#f56565", fontWeight: "600", fontSize: "0.9rem", marginBottom: "5px" }}>🏁 END</div>
                  <div style={{ color: "#2d3748", fontWeight: "600", fontSize: "1.1rem" }}>{new Date(event.endDate).toLocaleDateString()}</div>
                  <div style={{ color: "#718096", fontSize: "0.95rem" }}>{new Date(event.endDate).toLocaleTimeString()}</div>
                </div>
              </div>
            </div>

            {event.description && (
              <div className="event-section" style={{ marginBottom: "30px", padding: "20px", background: "linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%)", borderRadius: "15px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}>
                <h3 className="event-title" style={{ fontSize: "1.4rem", fontWeight: "700", color: "#2d3748", marginBottom: "15px", display: "flex", alignItems: "center", gap: "10px" }}>📝 About This Event</h3>
                <p className="event-content" style={{ color: "#4a5568", lineHeight: "1.7", fontSize: "1.1rem", margin: 0, fontStyle: "italic" }}>"{event.description}"</p>
              </div>
            )}

            {event.location && (
              <div className="event-section" style={{ marginBottom: "30px", padding: "20px", background: "linear-gradient(135deg, #f0fff4 0%, #c6f6d5 100%)", borderRadius: "15px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}>
                <h3 className="event-title" style={{ fontSize: "1.4rem", fontWeight: "700", color: "#2d3748", marginBottom: "15px", display: "flex", alignItems: "center", gap: "10px" }}>📍 Venue</h3>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px", background: "white", borderRadius: "10px" }}>
                  <div style={{ fontSize: "1.5rem" }}>🏢</div>
                  <span style={{ color: "#2d3748", fontWeight: "600", fontSize: "1.2rem" }}>{event.location}</span>
                </div>
              </div>
            )}

            {event.maxParticipants && (
              <div className="event-section" style={{ marginBottom: "30px", padding: "20px", background: "linear-gradient(135deg, #fffaf0 0%, #fbd38d 100%)", borderRadius: "15px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}>
                <h3 className="event-title" style={{ fontSize: "1.4rem", fontWeight: "700", color: "#2d3748", marginBottom: "15px", display: "flex", alignItems: "center", gap: "10px" }}>👥 Capacity</h3>
                <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                  <div style={{ fontSize: "2rem" }}>🎯</div>
                  <span style={{ color: "#2d3748", fontWeight: "600", fontSize: "1.3rem" }}>{event.maxParticipants} participants</span>
                </div>
              </div>
            )}

            {event.organizer && (
              <div className="event-section" style={{ marginBottom: "30px", padding: "20px", background: "linear-gradient(135deg, #f7fafc 0%, #cbd5e0 100%)", borderRadius: "15px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}>
                <h3 className="event-title" style={{ fontSize: "1.4rem", fontWeight: "700", color: "#2d3748", marginBottom: "15px", display: "flex", alignItems: "center", gap: "10px" }}>👤 Event Organizer</h3>
                <div style={{ display: "flex", alignItems: "center", gap: "15px", padding: "10px", background: "white", borderRadius: "10px" }}>
                  <div style={{ width: "50px", height: "50px", borderRadius: "50%", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>👨‍💼</div>
                  <span style={{ color: "#2d3748", fontWeight: "600", fontSize: "1.2rem" }}>{event.organizer}</span>
                </div>
              </div>
            )}

            {/* Animated Event Rating */}
            <div className="event-section" style={{ marginBottom: "30px", padding: "25px", background: "linear-gradient(135deg, #fef5e7 0%, #f6e05e 100%)", borderRadius: "15px", boxShadow: "0 6px 20px rgba(0,0,0,0.15)", textAlign: "center" }}>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#2d3748", marginBottom: "20px", animation: "fadeInUp 0.6s ease-out" }}>⭐ Community Rating</h3>
              <div style={{ marginBottom: "15px", animation: "fadeInUp 0.8s ease-out" }}>
                <StarRating
                  rating={Math.round(eventRatings.averageRating)}
                  onRate={handleRating}
                  readOnly={user.role !== "student"}
                />
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                <span style={{ fontSize: "2rem", fontWeight: "700", color: "#d69e2e", animation: "fadeInUp 1s ease-out, pulse 2s infinite" }}>
                  {Math.round(eventRatings.averageRating)}
                </span>
                <span style={{ color: "#744210", fontSize: "1.1rem", fontWeight: "600" }}>/ 5 stars</span>
              </div>
            </div>
            
            <style>{`
              @keyframes fadeInUp {
                from {
                  opacity: 0;
                  transform: translateY(30px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
              
              @keyframes pulse {
                0%, 100% {
                  transform: scale(1);
                }
                50% {
                  transform: scale(1.05);
                }
              }
              
              @keyframes sparkleBlast {
                0% {
                  opacity: 1;
                  transform: scale(0) rotate(0deg);
                }
                50% {
                  opacity: 1;
                  transform: scale(1.5) rotate(180deg);
                }
                100% {
                  opacity: 0;
                  transform: scale(0) rotate(360deg) translateY(-100px);
                }
              }
            `}</style>

            {/* Register / Status Buttons */}
            <div className="button-container" style={{ marginTop: "40px", display: "flex", alignItems: "center" }}>
              {user.role === "student" && !isRegistered && (
                <button
                  className="event-button"
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
                className="event-button"
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
  );
}