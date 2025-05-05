'use client';

import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {
    Home,
    User,
    BookOpen,
    Trophy,
    MessageCircle,
    Users,
    PenTool, Search
} from 'lucide-react';
import {useSocket} from "@/context/socketContext";
import {useProfileContext} from "@/context/profileContext";
import Link from "next/link";

export default function Sidebar() {
    const [unreadMessages, setUnreadMessages] = useState(0);
    const [isClient, setIsClient] = useState(false);
    const {socket} = useSocket();
    const {activeProfileInStorage} = useProfileContext();
    const profileId = activeProfileInStorage?.id;
    const router = useRouter();
    const [search, setSearch] = useState<string>('');

    useEffect(() => setIsClient(true), []);

    useEffect(() => {
        if (isClient) {
            const savedCount = localStorage.getItem('unreadMessages');
            setUnreadMessages(savedCount ? parseInt(savedCount, 10) : 0);
        }
    }, [isClient]);

    useEffect(() => {
        if (socket && isClient) {
            socket.on('messageAlert', () => {
                setUnreadMessages((prev) => {
                    const newCount = prev + 1;
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
    }, [socket, isClient]);

    const goTo = (path: string) => router.push(path);

    return (
        <div
            className="fixed min-h-screen w-60 bg-gradient-to-b from-[#281f39] via-[#1D2330] to-secondary-black text-text-white flex flex-col px-5 py-6">
            <div className="flex items-center justify-center h-16">
                <div className="text-2xl font-extralight text-white">tsundoku</div>
            </div>

            <div className="px-4">
                <div className="flex items-center bg-gray-800 rounded-lg p-2">
                    <input
                        type="text"
                        placeholder="Explorer"
                        className="bg-transparent focus:outline-none text-text-white w-full placeholder:text-text-white"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <button onClick={() => {
                        goTo('/search?term=' + search)
                        setSearch('')
                    }}>
                        <Search className="text-text-white"/>
                    </button>
                </div>

                <div className="flex gap-4 justify-center items-center mt-8">
                    <button
                        onClick={() => goTo('/home')}
                        className="w-11 h-11 bg-[#1C1F2B] rounded-xl flex items-center justify-center shadow-[0_2px_4px_rgba(0,0,0,0.25)] transition"
                    >
                        <Home className="text-[#e1e1ec] w-5 h-5"/>
                    </button>
                    <button
                        onClick={() => goTo(`/profile/${profileId}`)}
                        className="w-11 h-11 bg-[#1C1F2B] rounded-xl flex items-center justify-center shadow-[0_2px_4px_rgba(0,0,0,0.25)] transition"
                    >
                        <User className="text-[#e1e1ec] w-5 h-5"/>
                    </button>
                </div>
            </div>

            <nav className="flex-grow px-6 mt-10">
                <ul className="flex flex-col gap-y-8">
                    <li
                        onClick={() => goTo('/shelves')}
                        className="cursor-pointer flex items-center hover:text-white transition"
                    >
                        <BookOpen className="mr-3"/>
                        <span className="text-[#D8D8E0] font-medium">Étagères</span>
                    </li>
                    <li
                        onClick={() => goTo('/challenges')}
                        className="cursor-pointer flex items-center hover:text-white transition"
                    >
                        <Trophy className="mr-3"/>
                        <span className="text-[#D8D8E0] font-medium">Défis</span>
                    </li>
                    <li
                        onClick={() => goTo('/conversations')}
                        className="cursor-pointer flex items-center hover:text-white transition relative"
                    >
                        <MessageCircle className="mr-3"/>
                        <span className="text-[#D8D8E0] font-medium">Messages</span>
                        {unreadMessages > 0 && (
                            <span
                                className="ml-2 bg-red-500 text-xs rounded-full h-4 w-4 flex items-center justify-center text-white">
                    {unreadMessages}
                </span>
                        )}
                    </li>
                    <li
                        onClick={() => goTo('/clubs')}
                        className="cursor-pointer flex items-center hover:text-white transition"
                    >
                        <Users className="mr-3"/>
                        <span className="text-[#D8D8E0] font-medium">Clubs</span>
                    </li>
                    <li
                        onClick={() => goTo('/articles')}
                        className="cursor-pointer flex items-center hover:text-white transition"
                    >
                        <PenTool className="mr-3"/>
                        <span className="text-[#D8D8E0] font-medium">Articles</span>
                    </li>
                </ul>
            </nav>
        </div>
    );
}
