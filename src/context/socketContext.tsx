'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useProfileContext } from "@/context/profileContext";

interface SocketContextType {
    socket: Socket | null;
    notifications: Notification[];
    addNotification: (notification: Notification) => void;
    onlineProfileIds: number[];
}

interface Notification {
    id: string;
    actorFirstName: string;
    actorLastName: string;
    notificationType: string;
    resourceType: string;
    createdAt: string;
    isRead: boolean;
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    notifications: [],
    addNotification: () => {},
    onlineProfileIds: [],
});

export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ children }: { children: React.ReactNode }) {
    const socketRef = useRef<Socket | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [onlineProfileIds, setOnlineProfileIds] = useState<number[]>([]);
    const { activeProfileInStorage } = useProfileContext();
    const profileId = activeProfileInStorage?.id;

    useEffect(() => {
        if (!profileId) return;

        const socket = io("http://localhost:3000", {
            transports: ['websocket'],
        });

        socketRef.current = socket;

        const register = () => {
            console.log(`[SOCKET] Enregistrement du profil #${profileId}`);
            socket.emit("registerProfile", profileId);
            socket.emit("joinNotificationRoom", profileId);
        };

        socket.on('connect', () => {
            console.log("✅ Connecté à WebSocket");
            register();
        });

        socket.on("newNotification", (notification: Notification) => {
            setNotifications((prev) => [notification, ...prev]);
        });

        socket.on("all_profiles_online", (profileIds: number[]) => {
            console.log("🟢 Profils actuellement connectés :", profileIds);
            setOnlineProfileIds(profileIds);
        });

        socket.on('connect_error', (err) => console.error('❌ Erreur WebSocket:', err));
        socket.on('disconnect', () => {
            console.log('❌ Déconnecté du WebSocket');
            socketRef.current = null;
        });

        return () => {
            socket.off("connect");
            socket.off("newNotification");
            socket.off("all_profiles_online");
            socket.disconnect();
        };
    }, [profileId]);

    const addNotification = (notification: Notification) => {
        setNotifications((prev) => [notification, ...prev]);
    };

    return (
        <SocketContext.Provider value={{
            socket: socketRef.current,
            notifications,
            addNotification,
            onlineProfileIds,
        }}>
            {children}
        </SocketContext.Provider>
    );
}