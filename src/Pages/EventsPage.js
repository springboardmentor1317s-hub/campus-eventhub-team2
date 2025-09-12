import React from "react";
import "./EventsPage.css";

const events = [
    {
        id: 1,
        name: "Tech Fest 2025",
        date: "20 Sept 2025",
        time: "10:00 AM",
        location: "Auditorium Hall",
        organizer: "CSE Department",
        fees: "₹200",
    },
    {
        id: 2,
        name: "Startup Meetup",
        date: "25 Sept 2025",
        time: "02:00 PM",
        location: "Seminar Hall",
        organizer: "Entrepreneurship Cell",
        fees: "Free",
    },
    {
        id: 3,
        name: "AI Workshop",
        date: "28 Sept 2025",
        time: "11:00 AM",
        location: "Lab 3, Block A",
        organizer: "AI Club",
        fees: "₹500",
    },
];

function EventsPage() {
    return (
        <div className="events-container">
            <h2 className="events-title">Manage Your Events</h2>
            <div className="events-grid">
                {events.map((event) => (
                    <div className="event-card" key={event.id}>
                        <h3 className="event-name">{event.name}</h3>
                        <p><strong>Date:</strong> {event.date}</p>
                        <p><strong>Time:</strong> {event.time}</p>
                        <p><strong>Location:</strong> {event.location}</p>
                        <p><strong>Organizer:</strong> {event.organizer}</p>
                        <p><strong>Fees:</strong> {event.fees}</p>

                        <div className="event-actions">
                            <button className="btn edit">Edit</button>
                            <button className="btn stats">View Stats</button>
                            <button className="btn delete">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default EventsPage;
