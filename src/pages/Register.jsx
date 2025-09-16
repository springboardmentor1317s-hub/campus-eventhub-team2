import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    college: "",
    role: "student",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/auth/register", form);
      alert("✅ Registration successful!");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.error || "❌ Registration failed");
    }
  };

  return (
    <div
      style={{
        height: "100vh", // ✅ fixed height, no scroll
        width: "100vw", // ✅ fixed width, no scroll
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // background: "linear-gradient(135deg, #f3e8ff 0%, #e0c3fc 100%)",
        fontFamily: "Segoe UI, sans-serif",
        overflow: "hidden", // ✅ block scrolling
      }}
    >
      {/* Main Card */}
      <div
        style={{
          display: "flex",
          width: "900px",
          maxWidth: "95%",
          backgroundColor: "#fff",
          borderRadius: "15px",
          overflow: "hidden",
          boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
        }}
      >
        {/* LEFT PANEL */}
        <div
          style={{
            flex: 1,
            background: "linear-gradient(to bottom right, #6a11cb, #2575fc)",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
          }}
        >
          <h1 style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>
            🎓 Campus Event Hub
          </h1>
          <p
            style={{
              fontSize: "0.95rem",
              textAlign: "center",
              maxWidth: "80%",
              lineHeight: "1.6",
            }}
          >
            Join the community, explore events, and make your college journey
            unforgettable!
          </p>
          <img
            src="https://img.icons8.com/fluency/240/graduation-cap.png"
            alt="Event Illustration"
            style={{ marginTop: "2rem", maxWidth: "160px" }}
          />
        </div>

        {/* RIGHT PANEL - FORM */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
          }}
        >
          <div style={{ width: "100%", maxWidth: "350px" }}>
            <h2
              style={{
                marginBottom: "0.5rem",
                color: "#2c3e50",
                fontSize: "1.6rem",
                fontWeight: "bold",
              }}
            >
              Create an Account ✨
            </h2>
            <p
              style={{
                marginBottom: "1.5rem",
                color: "#555",
                fontSize: "0.9rem",
              }}
            >
              Sign up to get started with CampusEventHub
            </p>

            <form onSubmit={handleSubmit}>
              {/* Name */}
              <div style={{ marginBottom: "1rem" }}>
                <label style={labelStyle}>Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  style={inputStyle}
                />
              </div>

              {/* Email */}
              <div style={{ marginBottom: "1rem" }}>
                <label style={labelStyle}>Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  style={inputStyle}
                />
              </div>

              {/* Password */}
              <div style={{ marginBottom: "1rem" }}>
                <label style={labelStyle}>Password</label>
                <input
                  type="password"
                  placeholder="Create a password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  style={inputStyle}
                />
              </div>

              {/* College */}
              <div style={{ marginBottom: "1rem" }}>
                <label style={labelStyle}>College</label>
                <input
                  type="text"
                  placeholder="Enter your college"
                  value={form.college}
                  onChange={(e) => setForm({ ...form, college: e.target.value })}
                  required
                  style={inputStyle}
                />
              </div>

              {/* Role */}
              <div style={{ marginBottom: "1.2rem" }}>
                <label style={labelStyle}>Role</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  style={inputStyle}
                >
                  <option value="student">Student</option>
                  <option value="college_admin">College Admin</option>
                </select>
              </div>

              {/* Register Button */}
              <button type="submit" style={buttonStyle}>
                Register
              </button>
            </form>

            <p
              style={{
                marginTop: "1.2rem",
                fontSize: "0.85rem",
                color: "#555",
                textAlign: "center",
              }}
            >
              Already have an account?{" "}
              <a href="/login" style={{ color: "#6a11cb", fontWeight: "bold" }}>
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ✅ Styles
const labelStyle = {
  display: "block",
  marginBottom: "6px",
  fontWeight: "bold",
  fontSize: "0.85rem",
  color: "#333",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "0.95rem",
  outline: "none",
  transition: "0.3s",
  boxSizing: "border-box", // ✅ prevents overflow
};

const buttonStyle = {
  width: "100%", // ✅ aligned with inputs
  padding: "12px",
  background: "linear-gradient(to right, #6a11cb, #2575fc)",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  fontSize: "1rem",
  cursor: "pointer",
  fontWeight: "bold",
  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
};
