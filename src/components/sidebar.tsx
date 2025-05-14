'use client';

import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {
    Home,
    User,
    Trophy,
    MessageCircle,
    Users,
    Search,
    LibraryBig,
    Pencil,
    Activity,
    MessageSquareText,
    Heart,
    Star
} from 'lucide-react';
import {useSocket} from "@/context/socketContext";
import {useProfileContext} from "@/context/profileContext";
import {Card} from "@/components/ui/card";
import Image from "next/image";

export default function Sidebar() {
    const [unreadMessages, setUnreadMessages] = useState(0);
    const [isClient, setIsClient] = useState(false);
    const {socket} = useSocket();
    const {activeProfileInStorage} = useProfileContext();
    const profileId = activeProfileInStorage?.id;
    const router = useRouter();

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
        <div className="fixed min-h-screen w-60 text-text-white flex flex-col px-5 py-6"
             style={{
                 background: 'linear-gradient(to bottom, #281f39 1%, #171C26 40%)'
             }}>
            <div className="flex items-center justify-center h-16">
                <div className="text-2xl font-extralight text-white">tsundoku</div>
            </div>

            <div className="px-4">
                <div className="flex items-center bg-secondary-black border-secondary-black border rounded-xl p-2">
                    <input
                        type="text"
                        placeholder="Explorer"
                        className="bg-transparent focus:outline-none text-text-white w-full placeholder:text-text-white"
                    />
                    <Search className="text-text-white"/>
                </div>

                <div className="flex gap-4 justify-center items-center mt-12">
                    <button
                        onClick={() => goTo('/home')}
                        className="w-11 h-11 bg-secondary-black rounded-xl flex items-center justify-center shadow-[0_2px_4px_rgba(0,0,0,0.25)] transition-all duration-150 ease-in-out hover:bg-tertiary-black active:scale-90 active:shadow-inner"
                    >
                        <Home className="text-text-white w-5 h-5"/>
                    </button>

                    <button
                        onClick={() => goTo(`/profile/${profileId}`)}
                        className="w-11 h-11 bg-secondary-black rounded-xl flex items-center justify-center shadow-[0_2px_4px_rgba(0,0,0,0.25)] transition-all duration-150 ease-in-out hover:bg-tertiary-black active:scale-90 active:shadow-inner"
                    >
                        <User className="text-text-white w-5 h-5"/>
                    </button>
                </div>
            </div>

            <nav className="flex px-5 mt-12 mb-16">
                <ul className="flex flex-col gap-y-8">
                    <li
                        onClick={() => goTo('/shelves')}
                        className="cursor-pointer flex items-center hover:text-white transition"
                    >
                        <LibraryBig className="mr-3 w-5 h-5"/>
                        <span className="text-text-white text-sm font-medium">Étagères</span>
                    </li>
                    <li
                        onClick={() => goTo('/challenges')}
                        className="cursor-pointer flex items-center hover:text-white transition"
                    >
                        <Trophy className="mr-3 w-5 h-5"/>
                        <span className="text-text-white text-sm font-medium">Défis</span>
                    </li>
                    <li
                        onClick={() => goTo('/conversations')}
                        className="cursor-pointer flex items-center hover:text-white transition relative"
                    >
                        <MessageCircle className="mr-3 w-5 h-5"/>
                        <span className="text-text-white text-sm font-medium">Messages</span>
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
                        <Users className="mr-3 w-5 h-5"/>
                        <span className="text-text-white text-sm font-medium">Clubs</span>
                    </li>
                    <li
                        onClick={() => goTo('/articles')}
                        className="cursor-pointer flex items-center hover:text-white transition"
                    >
                        <Pencil className="mr-3 w-5 h-5"/>
                        <span className="text-text-white text-sm font-medium">Articles</span>
                    </li>
                </ul>
            </nav>
            <div className="flex items-center mb-3 text-sm font-medium text-text-white justify-center">
                <Activity className="w-4 h-4 mr-2"/>
                Activité
            </div>
            <Card className="bg-tertiary-black p-4 space-y-2 rounded-3xl border border-secondary-black">
                <div className="flex items-center text-[10px] text-gray-300">
                    <MessageSquareText className="w-3 h-3 mr-2 mt-0.5 shrink-0" />
                    <div>
                        Vous avez commenté la publication de&nbsp;
                        <span className="text-green-highlight">Chat Potelé</span>
                    </div>
                </div>

                <div className="flex items-center text-[10px] text-gray-300">
                    <Heart className="w-3 h-3 mr-2 mt-0.5 shrink-0" />
                    <div>
                        Vous avez aimé la publication de&nbsp;
                        <span className="text-green-highlight">Alex Ception</span>
                    </div>
                </div>

                <div className="flex items-center text-[10px] text-gray-300">
                    <Pencil className="w-3 h-3 mr-2 mt-0.5 shrink-0" />
                    <div>
                        Vous avez publié l’article&nbsp;
                        <span className="text-green-highlight">Mes 10 auteurs préférés...</span>
                    </div>
                </div>

                <div className="flex items-center text-[10px] text-gray-300">
                    <Star className="w-3 h-3 mr-2 mt-0.5 shrink-0" />
                    <div>
                        Vous avez laissé un avis sur&nbsp;
                        <span className="text-green-highlight">La Cité Diaphane</span>
                    </div>
                </div>

                <div className="flex justify-center">
                    <Image
                        src="/reshot-illustration-nature-research.png"
                        alt=""
                        width={600}
                        height={400}
                        className="object-contain w-auto h-24"
                    />
                </div>

                <div className="pt-3 text-center text-gray-500 text-[10px] italic">
                    Plus rien à signaler !
                </div>
            </Card>
        </div>
    );
}