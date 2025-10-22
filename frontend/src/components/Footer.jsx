import React, { useState } from "react";
import FeedbackForm from "./FeedbackForm";

const Footer = () => {
  const [showFeedback, setShowFeedback] = useState(false);
  const role = localStorage.getItem("role");

  const creators = [
    "Savita P N",
    "Anas", 
    "Sanjay",
    "Vennela",
    "Kalyani",
    "Utsarg Kumar Tiwary",
    "Radhe Shyam"
  ];

  return (
    <>
      <footer style={{
        background: "linear-gradient(135deg, #2d3748 0%, #4a5568 100%)",
        color: "white",
        padding: "40px 20px 20px",
        marginTop: "auto"
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "30px"
        }}>
          {/* About Section */}
          <div>
            <h3 style={{ marginBottom: "15px", color: "#e2e8f0" }}>Campus EventHub</h3>
            <p style={{ lineHeight: "1.6", color: "#cbd5e0", fontSize: "0.9rem" }}>
              Your one-stop platform for discovering and managing campus events. 
              Connect with your college community and never miss an exciting event!
            </p>
          </div>

          {/* Website Creators */}
          <div>
            <h3 style={{ marginBottom: "15px", color: "#e2e8f0" }}>Website Creators</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {creators.map((creator, index) => (
                <span
                  key={index}
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    padding: "4px 12px",
                    borderRadius: "15px",
                    fontSize: "0.85rem",
                    color: "#e2e8f0"
                  }}
                >
                  {creator}
                </span>
              ))}
            </div>
          </div>

          {/* Feedback Section - Only for non-superadmin users */}
          {role !== "superadmin" && (
            <div>
              <h3 style={{ marginBottom: "15px", color: "#e2e8f0" }}>Website Feedback</h3>
              <p style={{ color: "#cbd5e0", fontSize: "0.9rem", marginBottom: "15px" }}>
                Help us improve! Share your thoughts about the website.
              </p>
              <button
                onClick={() => setShowFeedback(true)}
                style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "0.9rem",
                  transition: "transform 0.2s ease"
                }}
                onMouseEnter={(e) => e.target.style.transform = "translateY(-2px)"}
                onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
              >
                💬 Give Feedback
              </button>
            </div>
          )}
        </div>

        {/* Copyright */}
        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.1)",
          marginTop: "30px",
          paddingTop: "20px",
          textAlign: "center",
          color: "#a0aec0",
          fontSize: "0.85rem"
        }}>
          © 2024 Campus EventHub. All rights reserved.
        </div>
      </footer>

      {/* Feedback Modal */}
      {showFeedback && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000
          }}
          onClick={() => setShowFeedback(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <FeedbackForm />
            <button
              style={{
                marginTop: "15px",
                background: "#e53e3e",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "8px 16px",
                fontWeight: "600",
                cursor: "pointer",
                width: "100%"
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
};

export default Footer;