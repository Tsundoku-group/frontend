import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useProfileContext } from "@/context/profileContext";

interface Notification {
    id: string;
    actorFirstName: string;
    actorLastName: string;
    notificationType: string;
    resourceType: string;
    createdAt: string;
    isRead: boolean;
}

interface SocketContextType {
    socket: Socket | null;
    notifications: Notification[];
    addNotification: (notification: Notification) => void;
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    notifications: [],
    addNotification: () => {},
});

export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ children }: { children: React.ReactNode }) {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const { activeProfileInStorage } = useProfileContext();
    const profileId = activeProfileInStorage?.id;

    useEffect(() => {
        if (!profileId || socket) return;

        const socketInstance = io("http://localhost:3000");

        socketInstance.on('connect', () => {
            console.log("✅ Connecté à WebSocket");
            setSocket(socketInstance);
            socketInstance.emit("joinNotificationRoom", profileId);
        });

        socketInstance.on("newNotification", (notification: Notification) => {
            setNotifications((prev) => [notification, ...prev]);
        });

        socketInstance.on('connect_error', (err) => console.error('❌ Erreur WebSocket:', err));
        socketInstance.on('disconnect', () => {
            console.log('❌ Déconnecté du WebSocket');
            setSocket(null);
        });

        return () => {
            socketInstance.off("newNotification");
            socketInstance.disconnect();
        };
    }, [profileId, socket]);

    const addNotification = (notification: Notification) => {
        setNotifications((prev) => [notification, ...prev]);
    };

    return (
        <SocketContext.Provider value={{ socket, notifications, addNotification }}>
            {children}
        </SocketContext.Provider>
    );
}