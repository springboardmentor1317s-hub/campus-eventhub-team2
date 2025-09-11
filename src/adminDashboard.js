import React from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ navigation ke liye
import './Dashboard.css';

// Profile Card component
function ProfileCard({ name, email, onLogout }) {
    return (
        <div className="profile-card">
            <div className="profile-avatar">
                {name ? name.slice(0, 2).toUpperCase() : "U"}
            </div>
            <div className="profile-info">
                <div className="profile-name">{name}</div>
                <div className="profile-email">{email}</div>
                <button className="logout-btn" onClick={onLogout}>Logout</button>
            </div>
        </div>
    );
}

function Dashboard() {
    const navigate = useNavigate();

    // Fake user data (later API se aayega)
    const user = {
        name: "Anas",
        email: "anas@gmail.com"
    };

    const handleLogout = () => {
        alert("Logged out!");
        navigate("/"); // ✅ logout ke baad login page par redirect
    };

    return (
        <div className="dashboard-container">
            {/* Header section */}
            <header className="dashboard-header">
                <div className="logo-title">
                    <span className="logo">📅</span>
                    <span className="title">CampusEventHub</span>
                </div>
                <nav>
                    <button onClick={() => navigate("/events")}>Events</button>
                    <button onClick={() => navigate("/dashboard")} className="active">Dashboard</button>
                </nav>
                <ProfileCard name={user.name} email={user.email} onLogout={handleLogout} />
            </header>

            {/* Main dashboard */}
            <main>
                <h2>Event Organizer Dashboard</h2>
                <p>Manage your events and track performance</p>

                {/* Stats cards */}
                <div className="stats-cards">
                    <div className="card blue">
                        <span>🗓️</span>
                        <div>Total Events</div>
                        <div>0</div>
                    </div>
                    <div className="card green">
                        <span>📈</span>
                        <div>Active Events</div>
                        <div>0</div>
                    </div>
                    <div className="card purple">
                        <span>👥</span>
                        <div>Total Registrations</div>
                        <div>0</div>
                    </div>
                    <div className="card orange">
                        <span>📊</span>
                        <div>Average Participants</div>
                        <div>0</div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="dashboard-tabs">
                    <button onClick={() => navigate("/dashboard/overview")}>Overview</button>
                    <button onClick={() => navigate("/dashboard/my-events")}>My Events</button>
                    <button onClick={() => navigate("/dashboard/analytics")}>Analytics</button>
                </div>

                <div className="dashboard-main">
                    <div className="recent-events">
                        <h3>Recent Events</h3>
                        <p>No events yet</p>
                    </div>

                    {/* Quick Actions */}
                    <div className="quick-actions">
                        <h3>Quick Actions</h3>
                        <button className="create-event-btn" onClick={() => navigate("/dashboard/create-event")}>
                            + Create New Event
                        </button>
                        <button onClick={() => navigate("/dashboard/registrations")}>View All Registrations</button>
                        <button onClick={() => navigate("/dashboard/export")}>Export Event Data</button>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;
