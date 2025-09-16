import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateEvent from "./pages/CreateEvent";
import EventList from "./pages/EventList";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar"; // ✅ Imported Navbar

function App() {
  return (
    <Router>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <div
          style={{
            flex: 1,
            padding: "2rem",
          }}
        >
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
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
