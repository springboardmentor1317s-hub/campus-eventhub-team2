import React from "react";
import { Link, useNavigate } from "react-router-dom";
import FeedbackForm from "./FeedbackForm"; // components folder mein jo feedback.jsx file hai uska import

function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("token");
  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");
  const [showFeedback, setShowFeedback] = React.useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      <nav style={navbarStyle}>
        {/* Left side logo */}
        <div style={logoContainer}>
          <img
            src="/Event3.png"
            alt="Logo"
            style={{ 
              width: window.innerWidth <= 768 ? "100px" : "135px", 
              height: window.innerWidth <= 768 ? "45px" : "60px" 
            }}
          />
        </div>

        {/* Right side links */}
        <div style={navLinks}>
          <Link to="/" style={linkStyle} className="nav-link">
            Home
          </Link>

          {!isLoggedIn && (
            <>
              <Link to="/login" style={linkStyle} className="nav-link">
                Login
              </Link>
              <Link to="/register" style={linkStyle} className="nav-link">
                Register
              </Link>
            </>
          )}

          {isLoggedIn && (
            <>
              <Link to="/dashboard" style={linkStyle} className="nav-link">
                Dashboard
              </Link>

              {role === "college_admin" && (
                <>
                  <Link to="/create-event" style={linkStyle} className="nav-link">
                    Create Event
                  </Link>
                  <Link to="/registrations" style={linkStyle} className="nav-link">
                    Registrations
                  </Link>
                </>
              )}

              {/* Feedback button only for students */}
              {role === "student" && (
                <button
                  style={{
                    background: "transparent",
                    color: "white",
                    border: "none",
                    padding: "10px 16px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "0.95rem",
                    marginRight: "8px",
                    transition: "all 0.3s ease",
                  }}
                  onClick={() => setShowFeedback(true)}
                >
                  Feedback
                </button>
              )}

              {/* User greet */}
              <div style={{ textAlign: "right", color: "white", fontSize: window.innerWidth <= 768 ? "0.9rem" : "1rem" }}>
                <div style={{ fontWeight: "bold" }}>👋 {name}</div>
              </div>

              {/* Logout button */}
              <button style={logoutBtn} onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Feedback Form modal for students */}
      {showFeedback && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999
          }}
          onClick={() => setShowFeedback(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <FeedbackForm />
            <button
              style={{
                marginTop: "12px",
                background: "#e74c3c",
                color: "white",
                border: "none",
                borderRadius: "6px",
                padding: "6px 12px",
                fontWeight: "bold",
                cursor: "pointer"
              }}
              onClick={() => setShowFeedback(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// Styles
const navbarStyle = {
  padding: window.innerWidth <= 768 ? "0.8rem 1rem" : "1rem 2rem",
  background: "linear-gradient(to right, #6a11cb, #2575fc)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow: "0 2px 20px rgba(0, 0, 0, 0.1)",
  fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
  borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
  flexWrap: window.innerWidth <= 768 ? "wrap" : "nowrap",
};
const logoContainer = { display: "flex", alignItems: "center" };
const navLinks = { 
  display: "flex", 
  alignItems: "center", 
  gap: window.innerWidth <= 768 ? "0.5rem" : "1.5rem",
  flexWrap: "wrap",
};
const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontWeight: "600",
  fontSize: window.innerWidth <= 768 ? "0.9rem" : "1.05rem",
  transition: "all 0.3s ease",
  padding: window.innerWidth <= 768 ? "6px 8px" : "8px 12px",
  borderRadius: "6px",
  whiteSpace: "nowrap",
};
const logoutBtn = {
  background: "#e74c3c",
  color: "white",
  border: "none",
  padding: "10px 16px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "0.95rem",
  transition: "all 0.3s ease",
  boxShadow: "0 4px 12px rgba(231, 76, 60, 0.3)",
};

// Hover styles via CSS injection
const style = document.createElement("style");
style.innerHTML = `
  .nav-link:hover {
    background: rgba(102, 126, 234, 0.1) !important;
    color: #667eea !important;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
  }
`;
document.head.appendChild(style);

export default Navbar;
