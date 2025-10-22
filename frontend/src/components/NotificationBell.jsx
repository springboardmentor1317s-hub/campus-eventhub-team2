import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { joinUserNotifications, onNotification, offNotification } from "../socket";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    loadNotifications();
    
    // Join user notifications room
    const userId = localStorage.getItem("userId");
    if (userId) {
      joinUserNotifications(userId);
    }
    
    // Listen for real-time notifications
    onNotification((notification) => {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    });
    
    const interval = setInterval(loadNotifications, 60000); // Check every minute
    
    return () => {
      clearInterval(interval);
      offNotification();
    };
  }, []);

  const loadNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get("/api/notifications", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setNotifications(response.data);
      setUnreadCount(response.data.filter(n => !n.isRead).length);
    } catch (err) {
      console.error("Failed to load notifications", err);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`/api/notifications/${notificationId}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      loadNotifications();
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markAsRead(notification._id);
    }
    if (notification.eventId) {
      setShowDropdown(false);
      navigate(`/event-details/${notification.eventId}`, {
        state: { scrollToComments: true }
      });
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put("/api/notifications/read-all", {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      loadNotifications();
    } catch (err) {
      console.error("Failed to mark all notifications as read", err);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        style={{
          background: "transparent",
          border: "none",
          color: "white",
          fontSize: "1.5rem",
          cursor: "pointer",
          position: "relative",
          padding: "8px"
        }}
      >
        🔔
        {unreadCount > 0 && (
          <span style={{
            position: "absolute",
            top: "0",
            right: "0",
            background: "#e53e3e",
            color: "white",
            borderRadius: "50%",
            width: "20px",
            height: "20px",
            fontSize: "0.7rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold"
          }}>
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div style={{
          position: "absolute",
          top: "45px",
          right: "0",
          background: "white",
          borderRadius: "12px",
          boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
          width: "350px",
          maxHeight: "400px",
          overflowY: "auto",
          zIndex: 1000,
          border: "1px solid #e2e8f0"
        }}>
          <div style={{
            padding: "15px",
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <h4 style={{ margin: "0", color: "#2d3748" }}>Notifications</h4>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#667eea",
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  fontWeight: "600"
                }}
              >
                Mark all read
              </button>
            )}
          </div>

          <div style={{ maxHeight: "300px", overflowY: "auto" }}>
            {notifications.length === 0 ? (
              <div style={{
                padding: "30px",
                textAlign: "center",
                color: "#718096"
              }}>
                <div style={{ fontSize: "2rem", marginBottom: "10px" }}>🔔</div>
                <p style={{ margin: "0", fontSize: "0.9rem" }}>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  onClick={() => handleNotificationClick(notification)}
                  style={{
                    padding: "12px 15px",
                    borderBottom: "1px solid #f7fafc",
                    cursor: "pointer",
                    background: notification.isRead ? "white" : "#f0f8ff",
                    transition: "background 0.2s ease"
                  }}
                  onMouseEnter={(e) => e.target.style.background = "#e6f3ff"}
                  onMouseLeave={(e) => e.target.style.background = notification.isRead ? "white" : "#f0f8ff"}
                >
                  <div style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px"
                  }}>
                    <div style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: notification.isRead ? "transparent" : "#667eea",
                      marginTop: "6px",
                      flexShrink: 0
                    }} />
                    <div style={{ flex: 1 }}>
                      <p style={{
                        margin: "0 0 5px 0",
                        fontSize: "0.9rem",
                        color: "#2d3748",
                        lineHeight: "1.4"
                      }}>
                        {notification.message}
                      </p>
                      <small style={{
                        color: "#718096",
                        fontSize: "0.75rem"
                      }}>
                        {new Date(notification.createdAt).toLocaleDateString()} at{" "}
                        {new Date(notification.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </small>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;