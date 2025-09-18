import React from "react";
<<<<<<< HEAD

const Home = () => {
  return (
    <div style={{ width: "100%",
      minHeight: "100vh",
        margin: 0,
        padding: 0,
        backgroundColor: " #e0c3fc", // ✅ remove black bg, fallback white
        overflowX: "hidden", // ✅ no horizontal scroll
     }}>
      {/* Hero Section */}
      <section
    style={{
        width: "100vw",            // full width of viewport
        height: "100vh",           // full height of viewport
        margin: 0,
        padding: 0,
        // background: "linear-gradient(135deg, #f3e8ff 0%, #e0c3fc 100%)",
        backgroundImage:
              "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('sp.jpg')",
        backgroundSize: "cover",   // makes sure image covers whole area
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        textAlign: "center",
  }}
      >
        <h1
          style={{
            fontSize: "4rem",
            fontWeight: "bold",
            marginBottom: "1rem",
            textShadow: "2px 2px 6px rgba(0,0,0,0.5)",
          }}
        >
          🎓 Campus Event Hub
        </h1>
        <p
          style={{
            fontSize: "1.4rem",
            maxWidth: "800px",
            margin: "0 auto 2.5rem auto",
            opacity: 0.9,
          }}
        >
          A centralized platform for inter-college events – sports, hackathons,
          cultural fests, and workshops. Join, manage, and celebrate together 🚀
        </p>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          
        </div>
      </section>

      {/* Modules Section */}
      <section
        style={{
          width: "100%",
=======
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  // 🔹 Hero section style
  const homeStyle = {
    height: "100vh",
    width: "100vw",
    margin: 0,
    padding: 0,
    backgroundImage: "url('/ap.jpg')", // ✅ place ap.jpg in /public
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
    backgroundColor: "rgba(0,0,0,0.5)", // ✅ dark overlay
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
          {/* ✅ Animated Title */}
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
>>>>>>> 691d12a1436471119c9ea769cc0bcdf3163c5867
          padding: "5rem 2rem",
          backgroundColor: "#f3f4f6",
          textAlign: "center",
        }}
      >
        <h2
<<<<<<< HEAD
          style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: "2rem",color:"black" }}
=======
          style={{
            fontSize: "2.5rem",
            fontWeight: "bold",
            marginBottom: "2rem",
            color: "#333",
          }}
>>>>>>> 691d12a1436471119c9ea769cc0bcdf3163c5867
        >
          📌 Core Modules
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
<<<<<<< HEAD
          <div style={cardStyle}>
            <h3 style={{ ...cardHeading, color: "#3498db" }}>🔑 Authentication</h3>
            <p style={cardText}>
              Secure login/registration for students & admins with role-based dashboards.
            </p>
          </div>
          <div style={cardStyle}>
            <h3 style={{ ...cardHeading, color: "#2ecc71" }}>📅 Event Listing</h3>
            <p style={cardText}>
              Browse upcoming events filtered by category, college, or date.
            </p>
          </div>
          <div style={cardStyle}>
            <h3 style={{ ...cardHeading, color: "#8e44ad" }}>🛠 Dashboard</h3>
            <p style={cardText}>
              Admin panel to create events, manage participants, and schedules.
            </p>
          </div>
          <div style={cardStyle}>
            <h3 style={{ ...cardHeading, color: "#e74c3c" }}>💬 Feedback</h3>
            <p style={cardText}>
              Engage students with event comments, ratings, and feedback.
            </p>
          </div>
        </div>
      </section>

      {/* Outcomes Section */}
      <section
        style={{
          width: "100%",
          padding: "5rem 2rem",
          backgroundColor: "#fff",
          textAlign: "center",
        }}
      >
        {/* <h2
          style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: "2rem" }}
        > */}
          {/* 🎯 Outcomes
        </h2>
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            maxWidth: "800px",
            margin: "0 auto",
            fontSize: "1.2rem",
            color: "#444",
            lineHeight: "2rem",
            textAlign: "left",
          }}
        >
          <li>✅ Students can view & register for inter-college events</li>
          <li>✅ Colleges can manage event listings, registrations, and schedules</li>
          <li>✅ Real-time updates on event statuses & participation</li>
          <li>✅ Feedback & engagement through discussions and ratings</li>
        </ul> */}
      </section>
    </div>
  );
};

// ✅ Reusable Styles
const buttonStyleBase = {
  padding: "12px 28px",
  fontSize: "1rem",
  fontWeight: "bold",
  color: "#fff",
  border: "none",
  borderRadius: "30px",
  cursor: "pointer",
  boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
  transition: "all 0.3s ease",
};

const buttonStyleGreen = {
  ...buttonStyleBase,
  background: "linear-gradient(45deg, #2ecc71, #27ae60)",
};

const buttonStyleOrange = {
  ...buttonStyleBase,
  background: "linear-gradient(45deg, #e67e22, #e74c3c)",
};

const buttonStyleBlue = {
  ...buttonStyleBase,
  background: "linear-gradient(45deg, #3498db, #2980b9)",
};

=======
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

// ✅ Reusable Styles
>>>>>>> 691d12a1436471119c9ea769cc0bcdf3163c5867
const cardStyle = {
  background: "#fff",
  padding: "2rem",
  borderRadius: "12px",
  boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  textAlign: "center",
};
<<<<<<< HEAD

=======
>>>>>>> 691d12a1436471119c9ea769cc0bcdf3163c5867
const cardHeading = {
  fontSize: "1.5rem",
  fontWeight: "bold",
  marginBottom: "1rem",
<<<<<<< HEAD
};

=======
  color: "#444",
};
>>>>>>> 691d12a1436471119c9ea769cc0bcdf3163c5867
const cardText = {
  fontSize: "1rem",
  color: "#555",
  lineHeight: "1.5rem",
};

<<<<<<< HEAD
export default Home;
=======
// ✅ Animation styles injected globally
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
>>>>>>> 691d12a1436471119c9ea769cc0bcdf3163c5867
