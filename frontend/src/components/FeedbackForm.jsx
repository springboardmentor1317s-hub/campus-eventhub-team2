import React, { useState } from "react";

const FeedbackForm = ({ eventId }) => {
    const [form, setForm] = useState({
        rating: "",
        experience: "",
        comments: "",
        name: "",
        email: "",
    });
    const [submitState, setSubmitState] = useState({ loading: false, message: "" });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitState({ loading: true, message: "" });

        // TODO: Add API call here (fetch/axios)
        setTimeout(() => {
            setSubmitState({ loading: false, message: "Thank you for your feedback!" });
            setForm({ rating: "", experience: "", comments: "", name: "", email: "" });
        }, 1200);
    };

    return (
        <form className="feedback-form" onSubmit={handleSubmit} style={{
            background: "white", padding: 24, borderRadius: 12, boxShadow: "0 2px 12px #d0d0f6", maxWidth: 420
        }}>
            <h3>Event Feedback</h3>
            <div>
                <label>How would you rate this event?</label>
                <div style={{ display: 'flex', gap: 6 }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <label key={star}>
                            <input type="radio" name="rating" value={star}
                                checked={form.rating === String(star)}
                                onChange={handleChange}
                            /> {star}⭐
                        </label>
                    ))}
                </div>
            </div>
            <div style={{ marginTop: 12 }}>
                <label>How was your experience?</label>
                <select name="experience" value={form.experience} onChange={handleChange} style={{ width: "100%" }}>
                    <option value="">Select</option>
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="average">Average</option>
                    <option value="poor">Poor</option>
                </select>
            </div>
            <div style={{ marginTop: 12 }}>
                <label>Your Comments/Suggestions</label>
                <textarea
                    name="comments"
                    value={form.comments}
                    rows={3}
                    onChange={handleChange}
                    style={{ width: "100%", resize: "vertical" }}
                    placeholder="Share your thoughts..."
                />
            </div>
            <div style={{ marginTop: 12 }}>
                <label>Your Name (optional)</label>
                <input
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    style={{ width: "100%" }}
                />
            </div>
            <div style={{ marginTop: 12 }}>
                <label>Your Email (optional)</label>
                <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    style={{ width: "100%" }}
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
