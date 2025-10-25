// frontend/src/App.jsx
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { socket, joinUserNotifications } from "./socket";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateEvent from "./pages/CreateEvent";
import EventList from "./pages/EventList";
import EventDetails from "./pages/EventDetails";
import Registrations from "./pages/Registrations"; // Admin Registrations
import SuperadminDashboard from "./pages/SuperadminDashboard";
import ViewFeedbacks from "./pages/ViewFeedbacks";

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  useEffect(() => {
    // Add mobile viewport meta tag
    const viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
      document.head.appendChild(meta);
    }

    // Add mobile-first CSS
    const style = document.createElement('style');
    style.innerHTML = `
      * {
        box-sizing: border-box;
      }
      body {
        margin: 0;
        padding: 0;
        font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
      @media (max-width: 768px) {
        body {
          font-size: 14px;
        }
      }
    `;
    document.head.appendChild(style);

    // Initialize socket connection for logged-in users
    const userId = localStorage.getItem("userId");
    if (userId) {
      joinUserNotifications(userId);
    }

    // Listen to registration status changes from backend
    socket.on("registrationStatusChanged", (data) => {
      toast.info(data.message, { position: toast.POSITION.TOP_RIGHT });
    });

    // Cleanup on unmount
    return () => {
      socket.off("registrationStatusChanged");
    };
  }, []);

  return (
    <Router>
      <div style={{ 
        display: "flex", 
        flexDirection: "column", 
        minHeight: "100vh",
        width: "100%",
        overflowX: "hidden"
      }}>
        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <div style={{ 
          flex: 1,
          width: "100%",
          padding: "0",
          margin: "0",
          paddingTop: window.innerWidth <= 768 ? "75px" : "95px"
        }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/events" element={<EventList />} />
            <Route path="/event-details/:eventId" element={<EventDetails />} />

            {/* Student or Admin */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Admin Only */}
            <Route
              path="/create-event"
              element={
                <ProtectedRoute role="college_admin">
                  <CreateEvent />
                </ProtectedRoute>
              }
            />

            {/* Admin Registrations Management */}
            <Route
              path="/registrations"
              element={
                <ProtectedRoute role="college_admin">
                  <Registrations />
                </ProtectedRoute>
              }
            />

            {/* Superadmin Dashboard */}
            <Route
              path="/superadmin"
              element={
                <ProtectedRoute role="superadmin">
                  <SuperadminDashboard />
                </ProtectedRoute>
              }
            />

            {/* View Feedbacks */}
            <Route
              path="/view-feedbacks"
              element={
                <ProtectedRoute role="superadmin">
                  <ViewFeedbacks />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>

        {/* Footer */}
        <Footer />

        {/* Toast Container */}
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;