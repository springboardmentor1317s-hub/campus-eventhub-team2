import React, { useState, useEffect } from "react";
import axios from "axios";

const FeedbackDisplay = () => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = async () => {
    try {
      const response = await axios.get("/api/feedback/all");
      setFeedback(response.data);
    } catch (err) {
      console.error("Failed to load feedback", err);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return "⭐".repeat(rating);
  };

  if (loading) return <div style={{ textAlign: "center", padding: "20px" }}>Loading feedback...</div>;

  return (
    <div style={{
      background: "white",
      borderRadius: "12px",
      padding: "30px",
      margin: "20px 0",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
    }}>
      <h2 style={{ marginBottom: "25px", color: "#2d3748", textAlign: "center" }}>
        💬 User Feedback
      </h2>
      
      {feedback.length === 0 ? (
        <p style={{ textAlign: "center", color: "#718096" }}>No feedback yet</p>
      ) : (
        <div style={{ display: "grid", gap: "15px" }}>
          {feedback.map((item) => (
            <div key={item._id} style={{
              background: "#f8fafc",
              padding: "20px",
              borderRadius: "8px",
              border: "1px solid #e2e8f0"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <div>
                  <strong style={{ color: "#2d3748" }}>{item.user?.name}</strong>
                  <span style={{ color: "#718096", fontSize: "0.9rem", marginLeft: "10px" }}>
                    {item.user?.college}
                  </span>
                </div>
                <div style={{ fontSize: "1.2rem" }}>
                  {renderStars(item.rating)}
                </div>
              </div>
              <p style={{ color: "#4a5568", margin: "0", lineHeight: "1.5" }}>
                {item.message}
              </p>
              <div style={{ fontSize: "0.8rem", color: "#a0aec0", marginTop: "10px" }}>
                {new Date(item.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedbackDisplay;