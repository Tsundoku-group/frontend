import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

const profileSockets = {};
const socketToProfile = {};
const roomUsers = {};

app.prepare().then(() => {
    const httpServer = createServer(handler);

    const io = new Server(httpServer, {
        cors: {
            origin: `http://${hostname}:${port}`,
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        console.log(`✅ Connexion : ${socket.id}`);

        // Auth middleware (à faire plus tard)
        // socket.use((packet, next) => { ... });

        socket.on("registerProfile", (profileId) => {
            console.log(`🟢 [registerProfile] Tentative d'enregistrement du profil : ${profileId} via socket ${socket.id}`);

            if (!profileId || typeof profileId !== "number") {
                console.warn(`⚠️ [registerProfile] ID de profil invalide : ${profileId}`);
                return;
            }

            socket.profileId = profileId;
            socketToProfile[socket.id] = profileId;

            if (!Array.isArray(profileSockets[profileId])) {
                profileSockets[profileId] = [];
                console.log(`➕ [registerProfile] Création d'un tableau de sockets pour le profil ${profileId}`);
            }

            if (!profileSockets[profileId].includes(socket.id)) {
                profileSockets[profileId].push(socket.id);
                console.log(`✅ [registerProfile] Socket ${socket.id} enregistré pour le profil ${profileId}`);
            }

            const connectedProfiles = Object.keys(profileSockets).map(id => Number(id));
            io.emit("all_profiles_online", connectedProfiles);

            console.log(`📢 [registerProfile] Émission du statut "online" pour le profil ${profileId}`);
            io.emit("profile_status_update", {
                profileId,
                status: "online"
            });
        });
        socket.on("joinNotificationRoom", (profileId) => {
            socket.join(`notificationRoom:${profileId}`);
        });

        socket.on("sendNotification", ({ receiverId, ...rest }) => {
            if (!receiverId) return;
            io.to(`notificationRoom:${receiverId}`).emit("newNotification", { receiverId, ...rest });
        });

        socket.on("joinRoom", ({ roomId, profileId }) => {
            socket.profileId = profileId;
            socketToProfile[socket.id] = profileId;

            for (const [currentRoomId, users] of Object.entries(roomUsers)) {
                if (users.has(profileId) && currentRoomId !== roomId) {
                    users.delete(profileId);
                    socket.leave(currentRoomId);
                }
            }

            if (!roomUsers[roomId]) {
                roomUsers[roomId] = new Set();
            }

            roomUsers[roomId].add(profileId);
            socket.join(roomId);

            if (roomUsers[roomId].size === 2) {
                io.to(roomId).emit("bothInConversation", { roomId });
            }
        });

        socket.on("send_msg", (data) => {
            const parsedData = JSON.parse(data);

            const { roomId, receiverData } = parsedData;
            if (!receiverData || !receiverData.id) {
                console.error("❌ receiverData est manquant ou invalide :", receiverData);
                return;
            }
            const receiverSocketId = profileSockets[receiverData.id];
            const isReceiverInRoom = roomUsers[roomId]?.has(receiverData.id);

            if (!isReceiverInRoom && receiverSocketId) {
                io.to(receiverSocketId).emit("messageAlert", parsedData);
            }

            io.to(roomId).emit("receive_msg", parsedData);
        });

        socket.on("lastMessageSend", ({ lastMessage }) => {
            const { roomId } = lastMessage;
            if (roomUsers[roomId]?.size === 2) {
                lastMessage.isRead = true;
            }
            io.to(roomId).emit("lastMessageUpdate", lastMessage);
        });

        socket.on("markAsRead", ({ conversationId, profileId }) => {
            io.to(conversationId).emit("conversationRead", { conversationId, profileId });
        });

        socket.on("typing", ({ roomId, profileId }) => {
            socket.to(roomId).emit("typing", { profileId });
        });

        socket.on("stopTyping", ({ roomId, profileId }) => {
            socket.to(roomId).emit("stopTyping", { profileId });
        });

        socket.on("disconnect", () => {
            const profileId = socketToProfile[socket.id];
            console.log(`🔌 [disconnect] Socket déconnecté : ${socket.id} (profil : ${profileId ?? 'inconnu'})`);

            if (profileId) {
                profileSockets[profileId] = (profileSockets[profileId] || []).filter(id => id !== socket.id);

                delete socketToProfile[socket.id];

                if (profileSockets[profileId].length === 0) {
                    delete profileSockets[profileId];

                    console.log(`📴 [disconnect] Plus aucun socket actif pour le profil ${profileId}, émission du statut "offline"`);

                    const connectedProfiles = Object.keys(profileSockets).map(id => Number(id));
                    io.emit("all_profiles_online", connectedProfiles);

                    io.emit("profile_status_update", {
                        profileId,
                        status: "offline"
                    });
                } else {
                    console.log(`ℹ️ [disconnect] ${profileSockets[profileId].length} socket(s) restants pour le profil ${profileId}`);
                }
            } else {
                console.warn(`⚠️ [disconnect] Socket ${socket.id} déconnecté sans profil associé.`);
            }
        });
    });

    httpServer.listen(port, () => {
        console.log(`🚀 Serveur socket prêt sur http://${hostname}:${port}`);
    });
});