// frontend/src/socket.js
import { io } from "socket.io-client";

export const socket = io("http://localhost:5000");

// Join user room for notifications when user logs in
export const joinUserNotifications = (userId) => {
  socket.emit("joinUser", userId);
};

// Listen for notifications
export const onNotification = (callback) => {
  socket.on("notification", callback);
};

export const offNotification = () => {
  socket.off("notification");
};