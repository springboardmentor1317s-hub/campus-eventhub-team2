import React from 'react';
import './Dashboard.css';

// Profile Card component.
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
    // Fake user data, backend se lana ho toh yaha dynamic la sakte hain
    const user = {
        name: "Anas",
        email: "anas@gmail.com"
    };

    const handleLogout = () => {
        alert("Logged out!"); 
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
                    <a href="/events">Events</a>
                    <a href="/dashboard" className="active">Dashboard</a>
                </nav>
                <ProfileCard name={user.name} email={user.email} onLogout={handleLogout} />
            </header>

            {/* Main dashboard */}
            <main>
                <h2>Event Organizer Dashboard</h2>
                <p>Manage your events and track performance</p>
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
                    <button className="active">Overview</button>
                    <button>My Events</button>
                    <button>Analytics</button>
                </div>
                <div className="dashboard-main">
                    <div className="recent-events">
                        <h3>Recent Events</h3>
                    </div>
                    <div className="quick-actions">
                        <h3>Quick Actions</h3>
                        <button className="create-event-btn">+ Create New Event</button>
                        <button>View All Registrations</button>
                        <button>Export Event Data</button>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;
