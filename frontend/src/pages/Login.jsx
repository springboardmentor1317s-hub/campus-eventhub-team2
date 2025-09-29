import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("name", res.data.name);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("college", res.data.college);

      alert("✅ Login successful!");
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.error || "❌ Login failed");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // background: "linear-gradient(135deg, #f3e8ff 0%, #e0c3fc 100%)",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
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
        {/* LEFT SECTION */}
        <div
          style={{
            flex: 1,
            background: "linear-gradient(to bottom right, #6a11cb, #2575fc)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            flexDirection: "column",
          }}
        >
          <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
            Campus Event Hub
          </h1>
          <p style={{ fontSize: "1rem", textAlign: "center", maxWidth: "80%" }}>
            Manage and participate in events with ease. Stay connected, stay
            inspired!
          </p>
          <img
            src="https://img.icons8.com/fluency/240/conference.png"
            alt="Event Illustration"
            style={{ marginTop: "2rem", maxWidth: "220px" }}
          />
        </div>

        {/* RIGHT SECTION */}
        <div
          style={{
            flex: 1,
            padding: "3rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <h2 style={{ marginBottom: "0.5rem", color: "#2c3e50" }}>
            Welcome Back 👋
          </h2>
          <p style={{ marginBottom: "2rem", color: "#555", fontSize: "0.95rem" }}>
            Sign in to your CampusEventHub account
          </p>

          <form onSubmit={handleSubmit}>
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

            {/* Password with toggle */}
            <div style={{ marginBottom: "1.5rem", position: "relative" }}>
              <label style={labelStyle}>Password</label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                style={inputStyle}
              />
              {/* Eye Icon */}
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "38px",
                  cursor: "pointer",
                  fontSize: "1.2rem",
                  color: "#888",
                  userSelect: "none",
                }}
              >
                {showPassword ? "👁️" : "🙈"}
              </span>
            </div>

            <button type="submit" style={buttonStyle}>
              Sign In
            </button>
          </form>

          <p style={{ marginTop: "1.5rem", fontSize: "0.9rem", color: "#555" }}>
            Don’t have an account?{" "}
            <a href="/register" style={{ color: "#6a11cb", fontWeight: "bold" }}>
              Sign up
            </a>
          </p>
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
  fontSize: "0.9rem",
  color: "#333",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "1rem",
  outline: "none",
  transition: "0.3s",
};

const buttonStyle = {
  width: "100%",
  padding: "14px",
  background: "linear-gradient(to right, #6a11cb, #2575fc)",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  fontSize: "1rem",
  cursor: "pointer",
  fontWeight: "bold",
  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
};
