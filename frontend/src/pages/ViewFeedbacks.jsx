import React, { useState, useEffect } from "react";
import axios from "axios";

const ViewFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ averageRating: 0, totalFeedbacks: 0 });

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const loadFeedbacks = async () => {
    try {
      const response = await axios.get("/api/feedback/all");
      setFeedbacks(response.data);
      
      // Calculate stats
      const total = response.data.length;
      const avgRating = total > 0 ? response.data.reduce((sum, f) => sum + f.rating, 0) / total : 0;
      setStats({ averageRating: avgRating.toFixed(1), totalFeedbacks: total });
    } catch (err) {
      console.error("Failed to load feedbacks", err);
    } finally {
      setLoading(false);
    }
  };

  const getRatingStars = (rating) => {
    return "⭐".repeat(rating) + "☆".repeat(5 - rating);
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return "#48bb78";
    if (rating >= 3) return "#ed8936";
    return "#f56565";
  };

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <div style={{ fontSize: "2rem", marginBottom: "20px" }}>🔄</div>
        <p>Loading feedbacks...</p>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "40px 20px"
    }}>
      <div style={{
        maxWidth: "1000px",
        margin: "0 auto",
        background: "white",
        borderRadius: "20px",
        padding: "40px",
        boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)"
      }}>
        <h1 style={{
          fontSize: "2.5rem",
          fontWeight: "700",
          color: "#2d3748",
          marginBottom: "30px",
          textAlign: "center"
        }}>
          📊 Website Feedbacks
        </h1>

        {/* Stats Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          marginBottom: "40px"
        }}>
          <div style={{
            background: "linear-gradient(135deg, #48bb78 0%, #38a169 100%)",
            color: "white",
            padding: "25px",
            borderRadius: "15px",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "10px" }}>⭐</div>
            <div style={{ fontSize: "2rem", fontWeight: "bold" }}>{stats.averageRating}</div>
            <div style={{ fontSize: "0.9rem", opacity: "0.9" }}>Average Rating</div>
          </div>
          
          <div style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            padding: "25px",
            borderRadius: "15px",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "10px" }}>💬</div>
            <div style={{ fontSize: "2rem", fontWeight: "bold" }}>{stats.totalFeedbacks}</div>
            <div style={{ fontSize: "0.9rem", opacity: "0.9" }}>Total Feedbacks</div>
          </div>
        </div>

        {/* Feedbacks List */}
        {feedbacks.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "60px 20px",
            color: "#718096"
          }}>
            <div style={{ fontSize: "4rem", marginBottom: "20px" }}>📝</div>
            <h3 style={{ margin: "0 0 10px 0", color: "#4a5568" }}>No Feedbacks Yet</h3>
            <p style={{ margin: "0" }}>Users haven't submitted any website feedback yet.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {feedbacks.map((feedback) => (
              <div
                key={feedback._id}
                style={{
                  background: "#f7fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  padding: "25px",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "15px"
                }}>
                  <div>
                    <h4 style={{
                      margin: "0 0 5px 0",
                      color: "#2d3748",
                      fontSize: "1.2rem",
                      fontWeight: "600"
                    }}>
                      {feedback.user?.name || "Anonymous User"}
                    </h4>
                    <p style={{
                      margin: "0",
                      color: "#718096",
                      fontSize: "0.9rem"
                    }}>
                      {feedback.user?.college || "Unknown College"}
                    </p>
                  </div>
                  
                  <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: "5px"
                  }}>
                    <div style={{
                      fontSize: "1.5rem",
                      color: getRatingColor(feedback.rating)
                    }}>
                      {getRatingStars(feedback.rating)}
                    </div>
                    <small style={{
                      color: "#a0aec0",
                      fontSize: "0.8rem"
                    }}>
                      {new Date(feedback.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                </div>
                
                <div style={{
                  background: "white",
                  padding: "20px",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0"
                }}>
                  <p style={{
                    margin: "0",
                    color: "#4a5568",
                    lineHeight: "1.6",
                    fontSize: "1rem"
                  }}>
                    "{feedback.message}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewFeedbacks;