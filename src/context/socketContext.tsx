'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useProfileContext } from "@/context/profileContext";
import { fetchNotifications } from "@/server-actions/navbar/actions";

interface Notification {
    id: string;
    actorFirstName: string;
    actorLastName: string;
    notificationType: string;
    resourceType: string;
    createdAt: string;
    isRead: boolean;
    actorCount?: number;
}

interface SocketContextType {
    socket: Socket | null;
    notifications: Notification[];
    setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
    addNotification: (notification: Notification) => void;
    onlineProfileIds: number[];
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    notifications: [],
    setNotifications: () => {},
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
            console.log("🟢 Profils connectés :", profileIds);
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

    useEffect(() => {
        const loadNotifications = async () => {
            if (!profileId) return;
            const result = await fetchNotifications(profileId);
            if (Array.isArray(result)) {
                const unique = Array.from(new Map(result.map(n => [n.id, n])).values());
                setNotifications(unique);
            }
        };

        void loadNotifications();
    }, [profileId]);

    const addNotification = (notification: Notification) => {
        setNotifications((prev) => [notification, ...prev]);
    };

    return (
        <SocketContext.Provider value={{
            socket: socketRef.current,
            notifications,
            setNotifications,
            addNotification,
            onlineProfileIds
        }}>
            {children}
        </SocketContext.Provider>
    );
}