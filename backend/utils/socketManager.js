let io = null;

export const setSocketIO = (socketInstance) => {
  io = socketInstance;
};

export const getSocketIO = () => {
  return io;
};

export const emitNotification = (userId, notification) => {
  if (io) {
    io.to(userId).emit("notification", notification);
  }
};