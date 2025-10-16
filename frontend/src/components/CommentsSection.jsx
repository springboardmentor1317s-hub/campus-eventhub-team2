import React, { useState, useEffect } from "react";
import axios from "axios";

const CommentsSection = ({ eventId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadComments();
    }, [eventId]);

    const loadComments = async () => {
        try {
            const response = await axios.get(`/api/events/${eventId}/comments`);
            setComments(response.data);
        } catch (err) {
            console.error("Failed to load comments", err);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (newComment.trim() === "" || loading) return;

        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            await axios.post(`/api/events/${eventId}/comments`, {
                text: newComment
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setNewComment("");
            await loadComments(); // Refresh comments
        } catch (err) {
            console.error("Failed to add comment", err);
            alert("Failed to add comment");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ 
            marginTop: "12px", 
            padding: "0", 
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            overflow: "hidden"
        }}>
            {/* Header */}
            <div style={{
                padding: "12px 16px",
                background: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(10px)",
                borderBottom: "1px solid rgba(255,255,255,0.2)"
            }}>
                <h4 style={{
                    margin: "0",
                    color: "white",
                    fontSize: "16px",
                    fontWeight: "700",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                }}>
                    💬 Comments
                    <span style={{
                        marginLeft: "auto",
                        background: "rgba(255,255,255,0.3)",
                        padding: "2px 10px",
                        borderRadius: "12px",
                        fontSize: "12px",
                        fontWeight: "600"
                    }}>
                        {comments.length}
                    </span>
                </h4>
            </div>

            <div style={{ padding: "16px", background: "white" }}>
                <div style={{ 
                    maxHeight: "180px", 
                    overflowY: "auto", 
                    marginBottom: "12px",
                    paddingRight: "8px"
                }}>
                    {comments.length === 0 ? (
                        <div style={{
                            textAlign: "center",
                            padding: "20px 12px",
                            color: "#999"
                        }}>
                            <div style={{ fontSize: "32px", marginBottom: "6px" }}>💭</div>
                            <p style={{ fontSize: "13px", margin: "0" }}>No comments yet. Be the first!</p>
                        </div>
                    ) : (
                        comments.map((comment, index) => (
                            <div 
                                key={comment.id} 
                                style={{ 
                                    padding: "10px",
                                    marginBottom: "8px",
                                    background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                                    borderRadius: "8px",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                    cursor: "pointer",
                                    animation: `slideIn 0.5s ease-out ${index * 0.1}s both`
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "translateY(-2px)";
                                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.12)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "translateY(0)";
                                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
                                }}
                            >
                                <div style={{ display: "flex", gap: "10px" }}>
                                    <div style={{
                                        width: "32px",
                                        height: "32px",
                                        borderRadius: "50%",
                                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "white",
                                        fontSize: "14px",
                                        fontWeight: "bold",
                                        flexShrink: 0
                                    }}>
                                        👤
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ marginBottom: "4px" }}>
                                            <span style={{ fontWeight: "700", color: "#333", marginRight: "6px", fontSize: "13px" }}>{comment.user?.name || 'User'}</span>
                                            <small style={{ color: "#888", fontSize: "11px" }}>{new Date(comment.createdAt).toLocaleDateString()}</small>
                                        </div>
                                        <p style={{ 
                                            margin: "0", 
                                            color: "#555",
                                            lineHeight: "1.4",
                                            fontSize: "13px"
                                        }}>
                                            {comment.text}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                
                <div onSubmit={handleAddComment}>
                    <textarea
                        placeholder="Share your thoughts... ✍️"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        style={{ 
                            width: "100%", 
                            borderRadius: "8px", 
                            padding: "10px",
                            border: "2px solid #e0e0e0",
                            fontSize: "13px",
                            fontFamily: "inherit",
                            transition: "all 0.3s ease",
                            outline: "none",
                            resize: "vertical",
                            boxSizing: "border-box"
                        }}
                        rows={2}
                        onFocus={(e) => {
                            e.target.style.borderColor = "#667eea";
                            e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = "#e0e0e0";
                            e.target.style.boxShadow = "none";
                        }}
                    />
                    <button
                        type="button"
                        onClick={handleAddComment}
                        style={{
                            marginTop: "8px",
                            padding: "8px 16px",
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            border: "none",
                            color: "white",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: "700",
                            fontSize: "13px",
                            width: "100%",
                            boxShadow: "0 2px 8px rgba(102, 126, 234, 0.3)",
                            transition: "all 0.3s ease",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px"
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = "translateY(-1px)";
                            e.target.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.4)";
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = "translateY(0)";
                            e.target.style.boxShadow = "0 2px 8px rgba(102, 126, 234, 0.3)";
                        }}
                    >
                        {loading ? "Posting..." : "Post Comment 🚀"}
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default CommentsSection;