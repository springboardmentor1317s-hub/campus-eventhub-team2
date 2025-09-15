import { useState } from "react";
import "./CreateEvent.css";

export default function CreateEvent() {
    const [title, setTitle] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Event Created: ${title}`);
    };

    return (
        <div className="create-event-container">
            <h2>➕ Create Event</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Event Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <button type="submit">Create</button>
            </form>
        </div>
    );
}
