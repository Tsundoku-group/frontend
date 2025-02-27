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

    io.on("connection", (socket) => {
        console.log(`Un utilisateur est connecté : ${socket.id}`);

        socket.on("joinNotificationRoom", (profileId) => {
            socket.join(`notificationRoom:${profileId}`);
        });

        socket.on("sendNotification", (notificationData) => {
            const { receiverId } = notificationData;

            if (!receiverId) {
                return;
            }

            io.to(`notificationRoom:${receiverId}`).emit("newNotification", notificationData);
        });

        socket.on("disconnect", () => {
            console.log(`❌ Un utilisateur s'est déconnecté : ${socket.id}`);
        });

        socket.on("disconnect", () => {
            console.log(`❌ Un utilisateur s'est déconnecté : ${socket.id}`);
        });
    });

    httpServer.listen(port, (err) => {
        if (err) throw err;
        console.log(`> Serveur prêt sur http://${hostname}:${port}`);
    });
});