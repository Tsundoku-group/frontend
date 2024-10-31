'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { socket as initializeSocket } from '@/socket';
import { useAuthContext } from "@/context/authContext";

interface SocketProviderProps {
    children: React.ReactNode;
}

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ children }: SocketProviderProps) {
    const [socket, setSocket] = useState<Socket | null>(null);
    const { user } = useAuthContext();
    const userId = user?.userId;

    useEffect(() => {
        const socketInstance = initializeSocket("http://localhost:3000");

        socketInstance.on('connect', () => {
            setSocket(socketInstance);
            if (userId) {
                socketInstance.emit("registerUser", userId);
            }
        });

        socketInstance.on('connect_error', (err) => {
            console.error('Erreur de connexion au serveur:', err);
        });

        socketInstance.on('disconnect', () => {
            console.log('Déconnecté du serveur');
            setSocket(null);
        });

        return () => {
            if (socketInstance) {
                socketInstance.disconnect();
            }
        };
    }, [userId]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
}