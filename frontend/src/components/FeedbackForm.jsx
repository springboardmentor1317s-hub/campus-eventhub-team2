import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";

const FeedbackForm = ({ eventId }) => {
    const [form, setForm] = useState({ rating: 0, message: "" });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }, []);

    const handleStarClick = (star) => setForm({ ...form, rating: star });
    const handleChange = (e) => setForm({ ...form, message: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.rating || !form.message) {
            alert("Please provide both rating and message");
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            await axios.post(
                "/api/feedback/submit",
                {
                    rating: parseInt(form.rating),
                    message: form.message,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setLoading(false);
            setSubmitted(true);
            setForm({ rating: 0, message: "" });
        } catch (err) {
            setLoading(false);
            alert("Error submitting feedback");
        }
    };

    const emojis = ["😡", "😞", "😐", "😊", "🤩"];
    const colors = ["#ff3b30", "#ff9500", "#ffcc00", "#34c759", "#007aff"];

    return (
        <div
            style={{
                minHeight: "0vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                    "linear-gradient(-45deg, #74ABE2, #5563DE, #7EE8FA, #EEC0C6)",
                backgroundSize: "400% 400%",
                animation: "gradient 12s ease infinite",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Animated background gradient keyframes */}
            <style>
                {`
          @keyframes gradient {
            0% {background-position: 0% 50%;}
            50% {background-position: 100% 50%;}
            100% {background-position: 0% 50%;}
          }
        `}
            </style>

            <AnimatePresence>
                {submitted && (
                    <Confetti
                        width={windowSize.width}
                        height={windowSize.height}
                        recycle={false}
                        numberOfPieces={300}
                    />
                )}
            </AnimatePresence>

            <motion.form
                onSubmit={handleSubmit}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 80 }}
                style={{
                    backdropFilter: "blur(20px)",
                    background: "rgba(255, 255, 255, 0.15)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    borderRadius: 20,
                    padding: "40px ",
                    width: "100%",
                    maxWidth: 460,
                    boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
                    color: "#fff",
                    textAlign: "center",
                    fontFamily: "'Poppins', sans-serif",
                }}
            >
                <motion.h2
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    style={{
                        fontSize: 28,
                        fontWeight: 700,
                        marginBottom: 8,
                        textShadow: "0 2px 8px rgba(0,0,0,0.3)",
                    }}
                >
                    We Value Your Feedback 💬
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    style={{
                        marginBottom: 25,
                        fontSize: 15,
                        opacity: 0.9,
                    }}
                >
                    Your opinion helps us improve and grow 🚀
                </motion.p>

                {/* Animated Stars */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: 14,
                        marginBottom: 10,
                    }}
                >
                    {[1, 2, 3, 4, 5].map((star, i) => (
                        <motion.span
                            key={i}
                            whileHover={{ scale: 1.4, rotate: 10 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleStarClick(star)}
                            style={{
                                fontSize: 40,
                                cursor: "pointer",
                                color: form.rating >= star ? colors[star - 1] : "#ccc",
                                filter:
                                    form.rating >= star
                                        ? "drop-shadow(0 0 10px rgba(255,255,255,0.6))"
                                        : "none",
                                transition: "all 0.3s ease",
                            }}
                        >
                            ★
                        </motion.span>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ fontSize: 36, marginBottom: 10 }}
                >
                    {form.rating ? emojis[form.rating - 1] : "🙂"}
                </motion.div>

                {/* Message Box */}
                <motion.textarea
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={4}
                    maxLength={300}
                    placeholder="Share your thoughts..."
                    style={{
                        width: "100%",
                        border: "none",
                        borderRadius: 10,
                        padding: "14px 16px",
                        fontSize: 15,
                        outline: "none",
                        resize: "none",
                        background: "rgba(255,255,255,0.9)",
                        color: "#333",
                    }}
                />

                <div
                    style={{
                        fontSize: 13,
                        marginTop: 6,
                        color: "#f2f2f2",
                        opacity: 0.9,
                    }}
                >
                    {form.message.length}/300 characters
                </div>

                {/* Submit Button */}
                <motion.button
                    whileHover={{ scale: 1.07 }}
                    whileTap={{ scale: 0.96 }}
                    disabled={loading}
                    type="submit"
                    style={{
                        marginTop: 22,
                        background:
                            "linear-gradient(90deg, #ff6a00 0%, #ee0979 100%)",
                        color: "#fff",
                        border: "none",
                        borderRadius: 12,
                        padding: "12px 28px",
                        cursor: "pointer",
                        fontWeight: 600,
                        fontSize: 16,
                        boxShadow: "0 6px 20px rgba(255, 80, 120, 0.3)",
                        transition: "0.3s",
                    }}
                >
                    {loading ? "Submitting..." : "Send Feedback"}
                </motion.button>

                {/* Thank You Message */}
                {submitted && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 120 }}
                        style={{
                            marginTop: 20,
                            color: "#fff",
                            fontWeight: 600,
                            background: "rgba(255,255,255,0.15)",
                            borderRadius: 12,
                            padding: 12,
                            backdropFilter: "blur(10px)",
                        }}
                    >
                        🎉 Thank you for your feedback!
                    </motion.div>
                )}
            </motion.form>
        </div>
    );
};

export default FeedbackForm;