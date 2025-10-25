import React, { useState, useEffect } from "react";
import axios from "axios";

const CommentsSection = ({ eventId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [commentsLoading, setCommentsLoading] = useState(true);
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState("");
    const role = localStorage.getItem("role");

    useEffect(() => {
        loadComments();
    }, [eventId]);

    const loadComments = async () => {
        if (!eventId) return;
        
        setCommentsLoading(true);
        try {
            console.log(`Loading comments for event: ${eventId}`);
            const response = await axios.get(`/api/events/${eventId}/comments`);
            console.log("Comments response:", response.data);
            setComments(response.data || []);
        } catch (err) {
            console.error("Failed to load comments:", err.response?.data || err.message);
            setComments([]);
        } finally {
            setCommentsLoading(false);
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
            await loadComments();
        } catch (err) {
            console.error("Failed to add comment", err);
            alert("Failed to add comment");
        } finally {
            setLoading(false);
        }
    };

    const handleReply = async (commentId) => {
        if (replyText.trim() === "") return;

        try {
            const token = localStorage.getItem("token");
            await axios.post(`/api/events/${eventId}/comments/${commentId}/reply`, {
                text: replyText
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setReplyText("");
            setReplyingTo(null);
            await loadComments();
        } catch (err) {
            console.error("Failed to add reply", err);
            alert("Failed to add reply");
        }
    };

    const handlePinComment = async (commentId) => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(`/api/events/${eventId}/comments/${commentId}/pin`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            await loadComments();
        } catch (err) {
            console.error("Failed to pin comment", err);
            alert("Failed to pin comment");
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
                    {commentsLoading ? (
                        <div style={{
                            textAlign: "center",
                            padding: "20px 12px",
                            color: "#999"
                        }}>
                            <div style={{ fontSize: "32px", marginBottom: "6px" }}>🔄</div>
                            <p style={{ fontSize: "13px", margin: "0" }}>Loading comments...</p>
                        </div>
                    ) : comments.length === 0 ? (
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
                            <div key={comment._id || comment.id || index} style={{ marginBottom: "12px" }}>
                                {/* Main Comment */}
                                <div 
                                    style={{ 
                                        padding: "12px",
                                        background: comment.isPinned 
                                            ? "linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)" 
                                            : "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                                        borderRadius: "8px",
                                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                                        border: comment.isPinned ? "2px solid #f39c12" : "none",
                                        position: "relative"
                                    }}
                                >
                                    {comment.isPinned && (
                                        <div style={{
                                            position: "absolute",
                                            top: "-8px",
                                            right: "10px",
                                            background: "#f39c12",
                                            color: "white",
                                            padding: "2px 8px",
                                            borderRadius: "10px",
                                            fontSize: "0.7rem",
                                            fontWeight: "bold"
                                        }}>
                                            📌 PINNED
                                        </div>
                                    )}
                                    
                                    <div style={{ display: "flex", gap: "10px" }}>
                                        <div style={{
                                            width: "36px",
                                            height: "36px",
                                            borderRadius: "50%",
                                            background: comment.user?.role === "college_admin" 
                                                ? "linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)"
                                                : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            color: "white",
                                            fontSize: "14px",
                                            fontWeight: "bold",
                                            flexShrink: 0
                                        }}>
                                            {comment.user?.role === "college_admin" ? "👨‍💼" : "👤"}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ marginBottom: "6px", display: "flex", alignItems: "center", gap: "8px" }}>
                                                <span style={{ fontWeight: "700", color: "#333", fontSize: "14px" }}>
                                                    {comment.user?.name || 'User'}
                                                </span>
                                                {comment.user?.role === "college_admin" && (
                                                    <span style={{
                                                        background: "#e74c3c",
                                                        color: "white",
                                                        padding: "2px 6px",
                                                        borderRadius: "8px",
                                                        fontSize: "0.7rem",
                                                        fontWeight: "bold"
                                                    }}>
                                                        ADMIN
                                                    </span>
                                                )}
                                                <small style={{ color: "#888", fontSize: "11px" }}>
                                                    {new Date(comment.createdAt).toLocaleDateString()}
                                                </small>
                                            </div>
                                            <p style={{ 
                                                margin: "0 0 8px 0", 
                                                color: "#555",
                                                lineHeight: "1.4",
                                                fontSize: "13px"
                                            }}>
                                                {comment.text}
                                            </p>
                                            
                                            {/* Action Buttons */}
                                            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                                <button
                                                    onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
                                                    style={{
                                                        background: "transparent",
                                                        border: "none",
                                                        color: "#667eea",
                                                        fontSize: "0.75rem",
                                                        cursor: "pointer",
                                                        fontWeight: "600"
                                                    }}
                                                >
                                                    💬 Reply
                                                </button>
                                                
                                                {role === "college_admin" && (
                                                    <button
                                                        onClick={() => handlePinComment(comment._id)}
                                                        style={{
                                                            background: "transparent",
                                                            border: "none",
                                                            color: comment.isPinned ? "#f39c12" : "#718096",
                                                            fontSize: "0.75rem",
                                                            cursor: "pointer",
                                                            fontWeight: "600"
                                                        }}
                                                    >
                                                        📌 {comment.isPinned ? "Unpin" : "Pin"}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Reply Form */}
                                {replyingTo === comment._id && (
                                    <div style={{ marginTop: "8px", marginLeft: "46px" }}>
                                        <textarea
                                            placeholder="Write a reply..."
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            style={{
                                                width: "100%",
                                                padding: "8px",
                                                borderRadius: "6px",
                                                border: "1px solid #e2e8f0",
                                                fontSize: "12px",
                                                resize: "vertical",
                                                boxSizing: "border-box"
                                            }}
                                            rows={2}
                                        />
                                        <div style={{ marginTop: "6px", display: "flex", gap: "8px" }}>
                                            <button
                                                onClick={() => handleReply(comment._id)}
                                                style={{
                                                    padding: "6px 12px",
                                                    background: "#667eea",
                                                    color: "white",
                                                    border: "none",
                                                    borderRadius: "4px",
                                                    fontSize: "0.75rem",
                                                    cursor: "pointer",
                                                    fontWeight: "600"
                                                }}
                                            >
                                                Reply
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setReplyingTo(null);
                                                    setReplyText("");
                                                }}
                                                style={{
                                                    padding: "6px 12px",
                                                    background: "#e2e8f0",
                                                    color: "#4a5568",
                                                    border: "none",
                                                    borderRadius: "4px",
                                                    fontSize: "0.75rem",
                                                    cursor: "pointer"
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}
                                
                                {/* Replies */}
                                {comment.replies && comment.replies.length > 0 && (
                                    <div style={{ marginTop: "8px", marginLeft: "46px" }}>
                                        {comment.replies.map((reply) => (
                                            <div
                                                key={reply._id}
                                                style={{
                                                    padding: "8px",
                                                    background: "rgba(102, 126, 234, 0.05)",
                                                    borderRadius: "6px",
                                                    marginBottom: "6px",
                                                    borderLeft: "3px solid #667eea"
                                                }}
                                            >
                                                <div style={{ display: "flex", gap: "8px" }}>
                                                    <div style={{
                                                        width: "24px",
                                                        height: "24px",
                                                        borderRadius: "50%",
                                                        background: reply.user?.role === "college_admin" 
                                                            ? "linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)"
                                                            : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        color: "white",
                                                        fontSize: "10px",
                                                        fontWeight: "bold",
                                                        flexShrink: 0
                                                    }}>
                                                        {reply.user?.role === "college_admin" ? "👨‍💼" : "👤"}
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
                                                            <span style={{ fontWeight: "600", color: "#333", fontSize: "12px" }}>
                                                                {reply.user?.name || 'User'}
                                                            </span>
                                                            {reply.user?.role === "college_admin" && (
                                                                <span style={{
                                                                    background: "#e74c3c",
                                                                    color: "white",
                                                                    padding: "1px 4px",
                                                                    borderRadius: "6px",
                                                                    fontSize: "0.6rem",
                                                                    fontWeight: "bold"
                                                                }}>
                                                                    ADMIN
                                                                </span>
                                                            )}
                                                            <small style={{ color: "#888", fontSize: "10px" }}>
                                                                {new Date(reply.createdAt).toLocaleDateString()}
                                                            </small>
                                                        </div>
                                                        <p style={{
                                                            margin: "0",
                                                            color: "#555",
                                                            lineHeight: "1.3",
                                                            fontSize: "12px"
                                                        }}>
                                                            {reply.text}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
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