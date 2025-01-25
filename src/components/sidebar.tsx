import React, {useEffect, useState} from 'react';
import {Home, User, BookOpen, Trophy, MessageCircle, Users, PenTool} from 'lucide-react';
import {useAuthContext} from "@/context/authContext";
import {useSocket} from "@/context/socketContext";

export default function Sidebar() {
    const [unreadMessages, setUnreadMessages] = useState(0);
    const [isClient, setIsClient] = useState(false);
    const socket = useSocket();
    const {user} = useAuthContext();
    const userId = user?.userId;

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (isClient) {
            const savedCount = localStorage.getItem('unreadMessages');
            setUnreadMessages(savedCount ? parseInt(savedCount, 10) : 0);
        }
    }, [isClient]);

    useEffect(() => {
        if (socket && isClient) {
            socket.on('messageAlert', () => {
                setUnreadMessages((prevCount) => {
                    const newCount = prevCount + 1;
                    localStorage.setItem('unreadMessages', newCount.toString());
                    return newCount;
                });
            });

            socket.on('conversationRead', () => {
                setUnreadMessages(0);
                localStorage.setItem('unreadMessages', '0');
            });

            return () => {
                socket.off('messageAlert');
                socket.off('conversationRead');
            };
        }
    }, [userId, socket, isClient]);

    return (
        <div className="fixed min-h-screen bg-secondary-black text-text-white flex flex-col">
            <div className="flex items-center justify-center h-20">
                <h1 className="text-2xl">tsundoku</h1>
            </div>

            <div className="px-6 py-4">
                <div className="flex items-center bg-gray-800 rounded-lg">
                    <input
                        type="text"
                        placeholder="Explorer"
                        className="ml-3 bg-transparent focus:outline-none text-text-white p-1"
                    />
                </div>
                <div className="flex items-center justify-around mb-4 mt-4">
                    <a href="/home">
                        <div className="bg-tertiary-black p-3 rounded-lg cursor-pointer -mr-5">
                            <Home className="text-text-white"/>
                        </div>
                    </a>
                    <a href={`/profile/${user?.userId}`}>
                        <div className="bg-tertiary-black p-3 rounded-lg cursor-pointer -ml-5">
                            <User className="text-text-white"/>
                        </div>
                    </a>
                </div>
            </div>

            <nav className="flex-grow px-6 mt-6">
                <ul className="space-y-4">
                    <li>
                        <a href="#" className="flex items-center text-text-white hover:text-white">
                            <BookOpen className="mr-3"/>
                            <span>Étagères</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" className="flex items-center text-text-white hover:text-white">
                            <Trophy className="mr-3"/>
                            <span>Défis</span>
                        </a>
                    </li>
                    <li>
                        <a href="/conversations" className="flex items-center text-text-white hover:text-white">
                            <MessageCircle className="mr-3"/>
                            <span>Messages</span>
                            {unreadMessages > 0 && (
                                <span className="ml-auto bg-red-500 text-xs rounded-full h-4 w-4 flex items-center justify-center text-white">
                                    {unreadMessages}
                                </span>
                            )}
                        </a>
                    </li>
                    <li>
                        <a href="#" className="flex items-center text-text-white hover:text-white">
                            <Users className="mr-3"/>
                            <span>Clubs</span>
                        </a>
                    </li>
                    <li>
                        <a href="/articles" className="flex items-center text-text-white hover:text-white">
                            <PenTool className="mr-3"/>
                            <span>Articles</span>
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    );
}
