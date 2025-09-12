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
    {
        id: 4,
        name: "Cultural Night",
        date: "30 Sept 2025",
        time: "06:00 PM",
        location: "Open Ground",
        organizer: "Cultural Committee",
        fees: "₹100",
    },
    {
        id: 5,
        name: "Hackathon 24hr",
        date: "05 Oct 2025",
        time: "09:00 AM",
        location: "Innovation Hub",
        organizer: "Coding Club",
        fees: "₹300",
    },
    {
        id: 6,
        name: "Sports Meet",
        date: "10 Oct 2025",
        time: "08:00 AM",
        location: "Main Stadium",
        organizer: "Sports Department",
        fees: "₹150",
    },
];

function EventsPage() {
    return (
        <div className="events-container">
            <h2 className="events-title">Upcoming Events</h2>
            <div className="events-grid">
                {events.map((event) => (
                    <div className="event-card" key={event.id}>
                        <h3 className="event-name">{event.name}</h3>
                        <p><strong>Date:</strong> {event.date}</p>
                        <p><strong>Time:</strong> {event.time}</p>
                        <p><strong>Location:</strong> {event.location}</p>
                        <p><strong>Organizer:</strong> {event.organizer}</p>
                        <p><strong>Fees:</strong> {event.fees}</p>
                        <button className="register-btn">Register</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default EventsPage;
