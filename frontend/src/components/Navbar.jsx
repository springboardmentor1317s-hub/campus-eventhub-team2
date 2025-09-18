import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("token");
  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav style={navbarStyle}>
      {/* ✅ Left: Logo */}
      <div style={logoContainer}>
        <img
          src="/logo.png" // ✅ place logo.png in /public
          alt="Logo"
          style={{ width: "40px", height: "40px", borderRadius: "50%" }}
        />
        <span style={{ marginLeft: "10px", fontSize: "1.3rem", fontWeight: "bold", color: "white" }}>
          Event Hub
        </span>
      </div>

      {/* ✅ Right: Navigation Links */}
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
              <Link to="/create-event" style={linkStyle} className="nav-link">
                Create Event
              </Link>
            )}

            {/* User Info */}
            <div style={{ textAlign: "right", color: "white", fontSize: "1rem" }}>
              <div style={{ fontWeight: "bold" }}>👋 {name}</div>
            </div>

            <button style={logoutBtn} onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

// ✅ Styles
const navbarStyle = {
  padding: "1rem 2rem",
  background: "#0996e6",
  display: "flex",
  justifyContent: "space-between", // ✅ logo left, links right
  alignItems: "center",
  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  fontFamily: "Segoe UI, sans-serif",
};

const logoContainer = {
  display: "flex",
  alignItems: "center",
};

const navLinks = {
  display: "flex",
  alignItems: "center",
  gap: "1.5rem",
};

const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontWeight: "600",
  fontSize: "1.05rem",
  transition: "all 0.3s ease",
};

// ✅ Hover styles via CSS injection
const style = document.createElement("style");
style.innerHTML = `
  .nav-link:hover {
    color: #dff6ff !important;
    text-decoration: underline;
  }
`;
document.head.appendChild(style);

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

export default Navbar;
