import { jsPDF } from "jspdf";
import QRCode from "qrcode";

export default function TicketDownload({ event, user }) {
    const generateTicket = async () => {
        const doc = new jsPDF();

        // Title
        doc.setFontSize(20);
        doc.text("🎟 Event Ticket", 70, 20);

        // Event + User Details
        doc.setFontSize(12);
        doc.text(`Event: ${event.title}`, 20, 40);
        doc.text(`Date: ${event.startDate} - ${event.endDate}`, 20, 50);
        doc.text(`Venue: ${event.location}`, 20, 60);
        doc.text(`Name: ${user.name}`, 20, 70);
        doc.text(`Email: ${user.email}`, 20, 80);

        // QR Code
        const qrData = `Event: ${event.title} | User: ${user.name} | Email: ${user.email}`;
        const qrImage = await QRCode.toDataURL(qrData);
        doc.addImage(qrImage, "PNG", 150, 40, 40, 40);

        // Download
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
