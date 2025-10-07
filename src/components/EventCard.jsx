import axios from "axios";

function EventCard({ event, userId }) {
  const handleRegister = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/registrations", {
        userId,
        eventId: event._id
      });
      alert(res.data.message);
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="event-card">
      <h3>{event.name}</h3>
      <p>{event.type}</p>
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}

export default EventCard;
