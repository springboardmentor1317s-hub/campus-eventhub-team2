import "./Registrations.css";

export default function Registrations() {
    return (
        <div className="registrations-container">
            <h2>👥 Registrations</h2>
            <table className="registrations-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Event</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Anas</td>
                        <td>Hackathon</td>
                        <td>Approved</td>
                    </tr>
                    <tr>
                        <td>Sarah</td>
                        <td>Cultural Fest</td>
                        <td>Pending</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
