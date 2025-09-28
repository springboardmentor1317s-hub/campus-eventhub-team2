import { jsPDF } from "jspdf";
import QRCode from "qrcode";

export default function TicketDownload({ event, user }) {
    const generateTicket = async () => {
        const doc = new jsPDF();

        // Title
        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        doc.text(" Event Ticket", 80, 20);

        // Function to format dates nicely
        const formatDate = (dateStr) => {
            const d = new Date(dateStr);
            return d.toLocaleDateString() + " " + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        };
        const startDateStr = formatDate(event.startDate);
        const endDateStr = formatDate(event.endDate);

        // Event and user details
        doc.setFontSize(13);
        doc.setFont("helvetica", "normal");
        doc.text(`Event: ${event.title}`, 20, 40);
        doc.text(`Date: ${startDateStr} - ${endDateStr}`, 20, 50);
        doc.text(`Venue: ${event.location}`, 20, 60);
        doc.text(`Name: ${user.name}`, 20, 70);
        doc.text(`Email: ${user.email ?? "Not provided"}`, 20, 80);

        // QR code data
        const qrData = `Event: ${event.title} | Name: ${user.name} | Email: ${user.email ?? "Not provided"}`;
        const qrImage = await QRCode.toDataURL(qrData);

        // Add QR to PDF
        doc.addImage(qrImage, "PNG", 150, 35, 40, 40);

        // Download PDF
        doc.save(`${event.title}_ticket.pdf`);
    };

    return (
        <button
            onClick={generateTicket}
            className="px-3 py-1 bg-green-600 text-white rounded-lg mt-2 hover:bg-green-700"
        >
            🎟 Download Ticket
        </button>
    );
}
