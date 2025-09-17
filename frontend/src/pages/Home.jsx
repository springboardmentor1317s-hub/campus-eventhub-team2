import React from "react";

const Home = () => {
  return (
    <div style={{ width: "100%",
      minHeight: "100vh",
        margin: 0,
        padding: 0,
        backgroundColor: " #e0c3fc", // ✅ remove black bg, fallback white
        overflowX: "hidden", // ✅ no horizontal scroll
     }}>      {/* Hero Section */}
      <section
    style={{
        width: "100vw",            // full width of viewport
        height: "100vh",           // full height of viewport
        margin: 0,
        padding: 0,
        // background: "linear-gradient(135deg, #f3e8ff 0%, #e0c3fc 100%)",
        backgroundImage:
              "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('ap.jpg')",
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
          padding: "5rem 2rem",
          backgroundColor: "#f3f4f6",
          textAlign: "center",
        }}
      >
        <h2
          style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: "2rem",color:"black" }}
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
};

const cardText = {
  fontSize: "1rem",
  color: "#555",
  lineHeight: "1.5rem",
};

export default Home;
