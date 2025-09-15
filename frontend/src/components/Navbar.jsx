import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ get current page
  const isLoggedIn = localStorage.getItem("token");
  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // ✅ Pages where Events should be hidden if logged out
  const hideEventsPages = ["/", "/login", "/register"];

  return (
    <nav
      style={{
        padding: "1rem 2rem",
        background: "#2c3e50",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: "1.5rem",
      }}
    >
      {/* Always visible */}
      <Link to="/" style={linkStyle}>
        Home
      </Link>

      {/* ✅ Show Events only if logged in OR logged out but not on Home/Login/Register */}
      {(isLoggedIn || (!isLoggedIn && !hideEventsPages.includes(location.pathname))) && (
        <Link to="/events" style={linkStyle}>
          Events
        </Link>
      )}

      {!isLoggedIn && (
        <>
          <Link to="/login" style={linkStyle}>
            Login
          </Link>
          <Link to="/register" style={linkStyle}>
            Register
          </Link>
        </>
      )}

      {isLoggedIn && (
        <>
          <Link to="/dashboard" style={linkStyle}>
            Dashboard
          </Link>
          {role === "college_admin" && (
            <Link to="/create-event" style={linkStyle}>
              Create Event
            </Link>
          )}

          {/* User Info */}
          <div style={{ textAlign: "right", color: "white" }}>
            <div style={{ fontWeight: "bold" }}>👋 {name}</div>
          </div>

          <button style={logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </>
      )}
    </nav>
  );
}

// ✅ Styles
const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontWeight: "500",
  transition: "0.3s",
};

const logoutBtn = {
  background: "#e74c3c",
  color: "white",
  border: "none",
  padding: "6px 12px",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
};

export default Navbar;
