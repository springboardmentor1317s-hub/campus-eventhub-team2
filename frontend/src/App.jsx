// frontend/src/App.jsx
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { socket } from "./socket";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateEvent from "./pages/CreateEvent";
import EventList from "./pages/EventList";
import Registrations from "./pages/Registrations"; // Admin Registrations

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

function App() {
  useEffect(() => {
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
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/events" element={<EventList />} />

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
          </Routes>
        </div>

        {/* Toast Container */}
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;
