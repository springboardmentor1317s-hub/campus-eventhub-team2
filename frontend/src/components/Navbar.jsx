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
            style={{ width: "135px", height: "60px" }}
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
                    background: "#635bff",
                    color: "white",
                    border: "none",
                    padding: "8px 14px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "0.95rem",
                    marginRight: "8px"
                  }}
                  onClick={() => setShowFeedback(true)}
                >
                  Feedback
                </button>
              )}

              {/* User greet */}
              <div style={{ textAlign: "right", color: "white", fontSize: "1rem" }}>
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
  padding: "1rem 2rem",
  background: "#0996e6",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  fontFamily: "Segoe UI, sans-serif",
};
const logoContainer = { display: "flex", alignItems: "center" };
const navLinks = { display: "flex", alignItems: "center", gap: "1.5rem" };
const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontWeight: "600",
  fontSize: "1.05rem",
  transition: "all 0.3s ease",
};
const logoutBtn = {
  background: "#e74c3c",
  color: "white",
  border: "none",
  padding: "8px 14px",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "0.95rem",
  transition: "background 0.3s ease",
};

// Hover styles via CSS injection
const style = document.createElement("style");
style.innerHTML = `
  .nav-link:hover {
    color: #dff6ff !important;
    text-decoration:import FeedbackForm from './FeedbackForm';
 underline;
  }
`;
document.head.appendChild(style);

export default Navbar;
