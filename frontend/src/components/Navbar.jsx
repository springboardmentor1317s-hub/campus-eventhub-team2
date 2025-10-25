import React from "react";
import { Link, useNavigate } from "react-router-dom";
import NotificationBell from "./NotificationBell";

function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("token");
  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");
  const email = localStorage.getItem("email");
  const college = localStorage.getItem("college");

  const [showProfile, setShowProfile] = React.useState(false);
  const [editMode, setEditMode] = React.useState(false);
  const [profileData, setProfileData] = React.useState({
    name: name || '',
    email: email || '',
    college: college || ''
  });

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleProfileUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch('/api/auth/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });
      
      if (response.ok) {
        localStorage.setItem('name', profileData.name);
        localStorage.setItem('email', profileData.email);
        localStorage.setItem('college', profileData.college);
        alert('✅ Profile updated successfully!');
        setEditMode(false);
      } else {
        alert('❌ Failed to update profile');
      }
    } catch (err) {
      alert('❌ Error updating profile');
    }
  };

  const getProfileImage = () => {
    const firstLetter = name ? name.charAt(0).toUpperCase() : 'U';
    return (
      <div style={{
        width: '35px',
        height: '35px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '1.2rem',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
      }}>
        {firstLetter}
      </div>
    );
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

              {role === "superadmin" && (
                <>
                  <Link to="/superadmin" style={linkStyle} className="nav-link">
                    Manage
                  </Link>
                  <Link to="/view-feedbacks" style={linkStyle} className="nav-link">
                    View Feedbacks
                  </Link>
                </>
              )}

              {/* Notification Bell for admins */}
              {role === "college_admin" && (
                <div style={{ marginRight: "8px" }}>
                  <NotificationBell />
                </div>
              )}

              {/* Profile Image */}
              <div style={{ position: 'relative' }}>
                <div onClick={() => setShowProfile(!showProfile)}>
                  {getProfileImage()}
                </div>
                
                {/* Profile Dropdown */}
                {showProfile && (
                  <div style={{
                    position: 'absolute',
                    top: '45px',
                    right: '0',
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                    padding: '20px',
                    minWidth: '280px',
                    zIndex: 1000,
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ marginBottom: '15px', textAlign: 'center' }}>
                      <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '1.8rem',
                        margin: '0 auto 10px'
                      }}>
                        {name ? name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <h3 style={{ margin: '0', color: '#2d3748' }}>{name}</h3>
                      <p style={{ margin: '5px 0 0 0', color: '#718096', fontSize: '0.9rem' }}>{role}</p>
                    </div>
                    
                    {editMode ? (
                      <div>
                        <div style={{ marginBottom: '10px' }}>
                          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#4a5568' }}>Name:</label>
                          <input
                            type="text"
                            value={profileData.name}
                            onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              borderRadius: '6px',
                              border: '1px solid #e2e8f0',
                              fontSize: '0.9rem'
                            }}
                          />
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#4a5568' }}>Email:</label>
                          <input
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              borderRadius: '6px',
                              border: '1px solid #e2e8f0',
                              fontSize: '0.9rem'
                            }}
                          />
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#4a5568' }}>College:</label>
                          <input
                            type="text"
                            value={profileData.college}
                            onChange={(e) => setProfileData({...profileData, college: e.target.value})}
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              borderRadius: '6px',
                              border: '1px solid #e2e8f0',
                              fontSize: '0.9rem'
                            }}
                          />
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button
                            onClick={handleProfileUpdate}
                            style={{
                              flex: 1,
                              padding: '8px 16px',
                              background: '#48bb78',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontWeight: '600'
                            }}
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditMode(false)}
                            style={{
                              flex: 1,
                              padding: '8px 16px',
                              background: '#e2e8f0',
                              color: '#4a5568',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontWeight: '600'
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div style={{ marginBottom: '10px' }}>
                          <p style={{ margin: '0 0 5px 0', fontWeight: '600', color: '#4a5568' }}>Email:</p>
                          <p style={{ margin: '0', color: '#718096' }}>{email}</p>
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                          <p style={{ margin: '0 0 5px 0', fontWeight: '600', color: '#4a5568' }}>College:</p>
                          <p style={{ margin: '0', color: '#718096' }}>{college}</p>
                        </div>
                        <button
                          onClick={() => setEditMode(true)}
                          style={{
                            width: '100%',
                            padding: '10px',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            marginBottom: '10px'
                          }}
                        >
                          ✏️ Edit Profile
                        </button>
                        <button
                          onClick={() => setShowProfile(false)}
                          style={{
                            width: '100%',
                            padding: '8px',
                            background: '#f7fafc',
                            color: '#4a5568',
                            border: '1px solid #e2e8f0',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: '600'
                          }}
                        >
                          Close
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Logout button */}
              <button style={logoutBtn} onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </nav>


    </>
  );
}

// Styles
const navbarStyle = {
  position: "fixed",    
  top: 0,               
  width: "100%",       
  zIndex: 1000,         
  boxSizing: "border-box",
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