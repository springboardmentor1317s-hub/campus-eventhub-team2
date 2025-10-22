import React, { useState } from "react";
import axios from "axios";

const FeedbackForm = ({ eventId }) => {
    const [form, setForm] = useState({
        rating: "",
        message: ""
    });
    const [submitState, setSubmitState] = useState({ loading: false, message: "" });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.rating || !form.message) {
            alert("Please provide both rating and message");
            return;
        }
        
        setSubmitState({ loading: true, message: "" });
        
        try {
            const token = localStorage.getItem("token");
            await axios.post("/api/feedback/submit", {
                rating: parseInt(form.rating),
                message: form.message
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setSubmitState({ loading: false, message: "Thank you for your feedback!" });
            setForm({ rating: "", message: "" });
        } catch (err) {
            setSubmitState({ loading: false, message: "Error submitting feedback" });
        }
    };

    return (
        <form className="feedback-form" onSubmit={handleSubmit} style={{
            background: "white", padding: 24, borderRadius: 12, boxShadow: "0 2px 12px #d0d0f6", maxWidth: 420
        }}>
            <h3>Platform Feedback</h3>
            <div>
                <label>How would you rate our platform?</label>
                <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <label key={star} style={{ cursor: 'pointer' }}>
                            <input type="radio" name="rating" value={star}
                                checked={form.rating === String(star)}
                                onChange={handleChange}
                                style={{ marginRight: 4 }}
                            /> {star}⭐
                        </label>
                    ))}
                </div>
            </div>
            <div style={{ marginTop: 16 }}>
                <label>Your Comments/Suggestions</label>
                <textarea
                    name="message"
                    value={form.message}
                    rows={4}
                    onChange={handleChange}
                    style={{ width: "100%", resize: "vertical", marginTop: 8, padding: 8, borderRadius: 4, border: "1px solid #ddd" }}
                    placeholder="Share your thoughts about the platform..."
                    required
                />
            </div>
            <button
                style={{
                    marginTop: 18, background: "#0996e6", color: "#fff",
                    border: "none", borderRadius: 6, padding: "8px 20px",
                    fontWeight: 600, cursor: "pointer"
                }}
                type="submit"
                disabled={submitState.loading}
            >
                {submitState.loading ? "Submitting..." : "Submit"}
            </button>
            {submitState.message && (
                <div style={{ marginTop: 10, color: "#31ab52", fontWeight: 500 }}>{submitState.message}</div>
            )}
        </form>
    );
};

export default FeedbackForm;