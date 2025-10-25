import React from "react";
import { useNavigate } from "react-router-dom";
import FeedbackDisplay from "../components/FeedbackDisplay";

export default function Home() {
  const navigate = useNavigate();

  //  Hero section style
  const homeStyle = {
    height: "100vh",
    width: "100vw",
    margin: 0,
    padding: 0,
    backgroundImage: "url('/ap.jpg')", 
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    textAlign: "center",
    position: "relative",
  };

  const overlayStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 0,
  };

  const contentStyle = {
    zIndex: 1,
    maxWidth: "800px",
    padding: "2rem",
  };

  return (
    <div style={{ width: "100%", margin: 0, padding: 0 }}>
      {/* Hero Section */}
      <section style={homeStyle}>
        <div style={overlayStyle}></div>
        <div style={contentStyle}>
          {/*  Animated Title */}
          <h1 className="animated-title">🎓 Campus Event Hub</h1>

          <p
            style={{
              fontSize: "1.5rem",
              marginBottom: "2rem",
              opacity: 0.9,
            }}
          >
            Discover, create, and join exciting events happening at your campus –
            sports, hackathons, cultural fests, and workshops 🚀
          </p>
          <button
            style={{
              background: "#0996e6",
              border: "none",
              padding: "14px 28px",
              borderRadius: "10px",
              fontSize: "1.2rem",
              fontWeight: "bold",
              color: "white",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.background = "#007acc")}
            onMouseLeave={(e) => (e.target.style.background = "#0996e6")}
            onClick={() => navigate("/login")}
          >
            Get Started 🚀
          </button>
        </div>
      </section>

      {/* Core Modules */}
      <section
        style={{
          padding: "5rem 2rem",
          backgroundColor: "#f3f4f6",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "2.5rem",
            fontWeight: "bold",
            marginBottom: "2rem",
            color: "#333",
          }}
        >
           Core Modules
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "2rem",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {[
            {
              icon: "🔑",
              title: "Authentication",
              text: "Secure login/registration for students & admins with role-based dashboards.",
            },
            {
              icon: "📅",
              title: "Event Listing",
              text: "Browse events filtered by category, college, or date.",
            },
            {
              icon: "🛠",
              title: "Dashboard",
              text: "Admin panel to create events, manage participants, and schedules.",
            },
            {
              icon: "💬",
              title: "Feedback",
              text: "Engage students with event comments, ratings, and feedback.",
            },
          ].map((m, i) => (
            <div key={i} style={cardStyle}>
              <h3 style={cardHeading}>
                {m.icon} {m.title}
              </h3>
              <p style={cardText}>{m.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section
        style={{ padding: "5rem 2rem", backgroundColor: "#fff", textAlign: "center" }}
      >
        <h2
          style={{
            fontSize: "2.5rem",
            fontWeight: "bold",
            marginBottom: "2rem",
            color: "#333",
          }}
        >
          🌟 Why Choose Us?
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "2rem",
            maxWidth: "1000px",
            margin: "0 auto",
          }}
        >
          <div style={cardStyle}>⚡ Real-time Updates</div>
          <div style={cardStyle}>🤝 Student Engagement</div>
          <div style={cardStyle}>📊 Analytics for Admins</div>
        </div>
      </section>

      {/* Feedback Section */}
      <section style={{ padding: "3rem 2rem", backgroundColor: "#f8fafc" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <FeedbackDisplay />
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: "#0996e6",
          color: "white",
          padding: "2rem",
          textAlign: "center",
          marginTop: "2rem",
        }}
      >
        <p>© {new Date().getFullYear()} Campus Event Hub. All rights reserved.</p>
      </footer>
    </div>
  );
}

//  Reusable Styles
const cardStyle = {
  background: "#fff",
  padding: "2rem",
  borderRadius: "12px",
  boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  textAlign: "center",
};
const cardHeading = {
  fontSize: "1.5rem",
  fontWeight: "bold",
  marginBottom: "1rem",
  color: "#444",
};
const cardText = {
  fontSize: "1rem",
  color: "#555",
  lineHeight: "1.5rem",
};

//  Animation styles injected globally
const style = document.createElement("style");
style.innerHTML = `
  .animated-title {
    font-size: 4rem;
    font-weight: bold;
    margin-bottom: 1rem;
    text-shadow: 2px 2px 6px rgba(0,0,0,0.6);
    display: inline-block;
    animation: fadeZoomIn 2s ease forwards, glowPulse 2s infinite alternate;
  }

  @keyframes fadeZoomIn {
    0% { opacity: 0; transform: scale(0.8); }
    100% { opacity: 1; transform: scale(1); }
  }

  @keyframes glowPulse {
    0% { text-shadow: 0 0 8px #0996e6, 0 0 12px #007acc; }
    100% { text-shadow: 0 0 16px #0996e6, 0 0 24px #00bfff; }
  }
`;
document.head.appendChild(style);
