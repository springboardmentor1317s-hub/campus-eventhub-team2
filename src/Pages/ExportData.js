import "./ExportData.css";

export default function ExportData() {
    const handleExport = () => {
        alert("Event data exported successfully!");
    };

    return (
        <div className="export-container">
            <h2>📤 Export Event Data</h2>
            <button className="export-btn" onClick={handleExport}>
                Download Data
            </button>
        </div>
    );
}
