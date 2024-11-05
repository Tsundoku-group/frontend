import {createServer} from "node:http";
import next from "next";
import {Server} from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({dev, hostname, port});
const handler = app.getRequestHandler();

app.prepare().then(() => {
    const httpServer = createServer(handler);

    const io = new Server(httpServer, {
        cors: {
            origin: `http://${hostname}:${port}`,
            methods: ["GET", "POST"],
            allowedHeaders: ["my-custom-header"],
            credentials: true,
        },
    });

    let roomUsers = {};
    let userSockets = {};
    let socketToUser = {};

    io.on("connection", (socket) => {
        console.log(`Un utilisateur est connecté : ${socket.id}`);

        socket.on("registerUser", (userId) => {
            socket.userId = userId;

            socketToUser[socket.id] = userId;

            if (!Array.isArray(userSockets[userId])) {
                userSockets[userId] = [];
            }

            userSockets[userId].push(socket.id);
            io.emit("user_status_update", {userId, status: "online"});
        });

        socket.on('lastMessageSend', (data) => {
            const {lastMessage} = data;
            const roomId = lastMessage.roomId;

            if (roomUsers[roomId] && roomUsers[roomId].size === 2) {
                lastMessage.isRead = true;
                io.to(roomId).emit('lastMessageUpdate', lastMessage);
            } else {
                io.to(roomId).emit('lastMessageUpdate', lastMessage);
            }
        });

        socket.on("joinRoom", ({roomId, userId}) => {

            socket.userId = userId;
            userSockets[userId] = socket.id;

            for (const [currentRoomId, users] of Object.entries(roomUsers)) {
                if (users.has(userId) && currentRoomId !== roomId) {
                    users.delete(userId);
                    socket.leave(currentRoomId);
                }
            }

            socket.userId = userId;

            if (!roomUsers[roomId]) {
                roomUsers[roomId] = new Set();
            }
            roomUsers[roomId].add(userId);
            socket.join(roomId);

            if (roomUsers[roomId].size === 2) {
                io.to(roomId).emit("bothInConversation", {roomId});
            }
        });

        socket.on("send_msg", (data) => {
            const parsedData = JSON.parse(data);
            const roomId = parsedData.roomId;
            const receiverData = parsedData.receiverData;

            const receiverSocketId = userSockets[receiverData.id];
            const isReceiverInRoom = roomUsers[roomId]?.has(receiverData.id);

            if (!isReceiverInRoom && receiverSocketId) {
                io.to(receiverSocketId).emit('messageAlert', {
                    roomId,
                    content: parsedData.content,
                    sender_email: parsedData.sender_email,
                    sent_by: parsedData.sent_by,
                    sent_at: parsedData.sent_at,
                });
            }

            io.to(roomId).emit("receive_msg", parsedData);
        });

        socket.on("markAsRead", ({conversationId, userId}) => {
            io.to(conversationId).emit("conversationRead", {conversationId, userId});
        });

        socket.on("typing", ({roomId, userId}) => {
            socket.to(roomId).emit("typing", {userId});
        });

        socket.on("stopTyping", ({roomId, userId}) => {
            socket.to(roomId).emit("stopTyping", {userId});
        });

        socket.on("disconnect", () => {
            const userId = socketToUser[socket.id];
            if (userId) {
                if (Array.isArray(userSockets[userId])) {
                    userSockets[userId] = userSockets[userId].filter((id) => id !== socket.id);
                } else {
                    userSockets[userId] = [];
                }

                delete socketToUser[socket.id];

                if (userSockets[userId].length === 0) {
                    delete userSockets[userId];
                    io.emit("user_status_update", { userId, status: "offline" });
                }
            }
        });
    });

    httpServer.listen(port, (err) => {
        if (err) throw err;
        console.log(`> Serveur prêt sur http://${hostname}:${port}`);
    });
});