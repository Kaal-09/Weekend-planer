import { Server } from 'socket.io';

let io;
const onlineUsers = new Map(); // userId -> socketId

export const initSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: { origin: process.env.CLIENT_URL, credentials: true }
    });

    io.on('connection', (socket) => {
        const userId = socket.handshake.query.userId;
        console.log('User connected to socket with userID: ', userId);
        if (userId) onlineUsers.set(userId, socket.id);

        socket.on('sendMessage', ({ receiverId, message }) => {
            const receiverSocketId = onlineUsers.get(receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('newMessage', message);
            }
        });

        socket.on('disconnect', () => {
            onlineUsers.forEach((sid, uid) => {
                if (sid === socket.id) onlineUsers.delete(uid);
            });
        });
    });
};

export const getIO = () => io;