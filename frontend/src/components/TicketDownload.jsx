import { jsPDF } from "jspdf";
import QRCode from "qrcode";

export default function TicketDownload({ event, user }) {
    const generateTicket = async () => {
        // Standard ticket size (similar to concert/movie tickets)
        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: [200, 85]
        });

        // Gradient background effect
        doc.setFillColor(20, 25, 45); // Dark blue
        doc.rect(0, 0, 200, 85, 'F');

        // Add some geometric patterns for visual appeal
        doc.setFillColor(30, 35, 55);
        for (let i = 0; i < 10; i++) {
            doc.circle(20 + i * 20, -10, 15, 'F');
            doc.circle(30 + i * 20, 95, 15, 'F');
        }

        // Main ticket container with rounded corners
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(8, 8, 184, 69, 5, 5, 'F');

        // Left section with accent color
        doc.setFillColor(59, 130, 246); // Blue accent
        doc.roundedRect(8, 8, 4, 69, 2, 2, 'F');

        // Perforated line effect
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.3);
        for (let i = 15; i < 70; i += 3) {
            doc.line(140, i, 140, i + 1.5);
        }

        // EVENT header with accent background
        doc.setFillColor(59, 130, 246);
        doc.roundedRect(18, 15, 25, 6, 1, 1, 'F');
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(255, 255, 255);
        doc.text("EVENT", 20, 19);

        // Event title
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(20, 25, 45);
        doc.text(event.title.toUpperCase(), 18, 30);

        // Location with icon effect
        doc.setFillColor(34, 197, 94); // Green
        doc.circle(20, 38, 2, 'F');
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(34, 197, 94);
        doc.text("VENUE", 25, 40);

        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(60, 60, 60);
        doc.text(event.location, 18, 47);

        // Date section with calendar icon effect
        doc.setFillColor(239, 68, 68); // Red
        doc.roundedRect(18, 52, 4, 4, 0.5, 0.5, 'F');
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(239, 68, 68);
        doc.text("DATE & TIME", 25, 55);

        // Format dates beautifully
        const formatDate = (dateStr) => {
            const d = new Date(dateStr);
            const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
                'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
            const month = months[d.getMonth()];
            const day = String(d.getDate()).padStart(2, '0');
            const year = d.getFullYear();
            const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
            return `${month} ${day}, ${year} • ${time}`;
        };

        const startDateStr = formatDate(event.startDate);
        const endDateStr = formatDate(event.endDate);

        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(40, 40, 40);
        doc.text(`FROM: ${startDateStr}`, 18, 62);
        doc.text(`TO: ${endDateStr}`, 18, 68);

        // Right section (QR and details)
        // QR Code with border
        const qrData = JSON.stringify({
            event: event.title,
            attendee: user.name,
            email: user.email ?? "Not provided",
            startDate: event.startDate,
            ticketId: `TKT-${Math.random().toString(36).substr(2, 8).toUpperCase()}`
        });

        const qrImage = await QRCode.toDataURL(qrData, {
            width: 100,
            margin: 1,
            color: {
                dark: '#1a1a1a',
                light: '#ffffff'
            }
        });

        // QR background
        doc.setFillColor(250, 250, 250);
        doc.roundedRect(145, 15, 35, 35, 3, 3, 'F');
        doc.addImage(qrImage, "PNG", 148, 18, 29, 29);

        // Ticket ID with stylish background
        const ticketId = `#${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
        doc.setFillColor(34, 197, 94);
        doc.roundedRect(145, 52, 35, 8, 2, 2, 'F');
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(255, 255, 255);
        doc.text(ticketId, 155, 57);

        // // Pass type badge
        // doc.setFillColor(34, 197, 94);
        // doc.roundedRect(145, 62, 35, 6, 1, 1, 'F');
        // doc.setFontSize(8);
        // doc.setFont("helvetica", "bold");
        // doc.setTextColor(255, 255, 255);
        // doc.text("GENERAL ADMISSION", 147, 66);

        // Attendee details
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(100, 100, 100);
        doc.text("ATTENDEE", 145, 70);

        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(40, 40, 40);
        const attendeeName = user.name.length > 18 ? user.name.substring(0, 15) + "..." : user.name;
        doc.text(attendeeName.toUpperCase(), 145, 75);

        // Decorative elements
        // Corner triangles
        doc.setFillColor(59, 130, 246);
        doc.triangle(8, 8, 20, 8, 8, 20, 'F'); // Top left
        doc.triangle(192, 77, 192, 65, 180, 77, 'F'); // Bottom right

        // Thank you message at bottom - moved lower
        doc.setFillColor(248, 250, 252);
        doc.rect(0, 79, 200, 6, 'F');
        doc.setFontSize(8);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(100, 100, 100);
        doc.text("Thank you for joining us! Present this ticket at the venue entrance.", 15, 83);

        // Star decorations
        doc.setFillColor(255, 215, 0); // Gold
        const drawStar = (x, y, size) => {
            doc.circle(x, y, size, 'F');
        };
        drawStar(185, 15, 1);
        drawStar(25, 25, 0.8);
        drawStar(190, 65, 0.7);

        // Download PDF
        doc.save(`${event.title.replace(/\s+/g, '_')}_Ticket.pdf`);
    };

    return (
        <button
            onClick={generateTicket}
            style={{
                padding: '12px 24px',
                background: 'linear-gradient(45deg, #3B82F6, #8B5CF6)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                marginTop: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: '500',
                fontSize: '14px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                transition: 'all 0.2s ease',
                transform: 'scale(1)'
            }}
            onMouseEnter={(e) => {
                e.target.style.background = 'linear-gradient(45deg, #2563EB, #7C3AED)';
                e.target.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
                e.target.style.background = 'linear-gradient(45deg, #3B82F6, #8B5CF6)';
                e.target.style.transform = 'scale(1)';
            }}
        >
            🎟️ Download Entry Ticket
        </button>
    );
}