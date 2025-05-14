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
    Star, ChevronRight
} from 'lucide-react';
import {useSocket} from "@/context/socketContext";
import {useProfileContext} from "@/context/profileContext";
import {Card} from "@/components/ui/card";
import Image from "next/image";
import {Button} from "@/components/ui/button";

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
                <div className="text-[20px] tracking-wide font-extralight text-[#e1e1ec]">tsundoku</div>
            </div>

            <div className="px-4">
                <div className="flex items-center bg-secondary-black border border-secondary-black rounded-2xl px-3 py-2">
                    <input
                        type="text"
                        placeholder="Explorer"
                        className="bg-transparent focus:outline-none text-text-white w-full placeholder:text-[#cfcfe1] text-sm"
                    />
                    <Search className="text-[#cfcfe1] w-4 h-4 ml-2"/>
                </div>

                <div className="flex gap-4 justify-center items-center mt-12">
                    <button
                        onClick={() => goTo('/home')}
                        className="w-12 h-12 bg-secondary-black rounded-2xl flex items-center justify-center shadow-md transition-all duration-150 ease-in-out hover:bg-tertiary-black active:scale-95"
                    >
                        <Home className="text-[#e1e1ec] w-5 h-5"/>
                    </button>

                    <button
                        onClick={() => goTo(`/profile/${profileId}`)}
                        className="w-12 h-12 bg-secondary-black rounded-2xl flex items-center justify-center shadow-md transition-all duration-150 ease-in-out hover:bg-tertiary-black active:scale-95"
                    >
                        <User className="text-[#e1e1ec] w-5 h-5"/>
                    </button>
                </div>
            </div>

            <nav className="flex flex-col mt-12 mb-16 w-full">
                <ul className="flex flex-col gap-y-2 pl-[6px]">
                    {[{
                        path: '/shelves', icon: LibraryBig, label: 'Étagères'
                    }, {
                        path: '/challenges', icon: Trophy, label: 'Défis'
                    }, {
                        path: '/conversations', icon: MessageCircle, label: 'Messages'
                    }, {
                        path: '/clubs', icon: Users, label: 'Clubs'
                    }, {
                        path: '/articles', icon: Pencil, label: 'Articles'
                    }].map(({ path, icon: Icon, label }) => (
                        <li key={path} onClick={() => goTo(path)}>
                            <Button className="group w-full flex items-center justify-between bg-transparent hover:bg-tertiary-black px-3 py-2 rounded-2xl transition-all">
                                <div className="flex items-center gap-3">
                                    <Icon className="w-5 h-5 text-[#e1e1ec]"/>
                                    <span className="text-[#e1e1ec] text-[13px] font-medium">{label}</span>
                                    {label === 'Messages' && unreadMessages > 0 && (
                                        <span className="ml-1 bg-red-500 text-[10px] rounded-full h-4 w-4 flex items-center justify-center text-white font-semibold">
                                            {unreadMessages}
                                        </span>
                                    )}
                                </div>
                                <ChevronRight
                                    className="w-4 h-4 text-[#e1e1ec] opacity-0 translate-x-[-4px] transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0"
                                />
                            </Button>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="flex items-center mb-3 text-xs font-medium text-[#e1e1ec] justify-center">
                <Activity className="w-4 h-4 mr-2"/>
                Activité
            </div>

            <Card className="bg-tertiary-black p-3 space-y-2 rounded-2xl border border-secondary-black">
                {[{
                    icon: MessageSquareText, text: "Vous avez commenté la publication de", highlight: "Chat Potelé"
                }, {
                    icon: Heart, text: "Vous avez aimé la publication de", highlight: "Alex Ception"
                }, {
                    icon: Pencil, text: "Vous avez publié l’article", highlight: "Mes 10 auteurs préférés..."
                }, {
                    icon: Star, text: "Vous avez laissé un avis sur", highlight: "La Cité Diaphane"
                }].map(({ icon: Icon, text, highlight }, index) => (
                    <div key={index} className="flex items-center text-[10px] text-[#cfcfe1]">
                        <Icon className="w-3 h-3 mr-2 mt-0.5 shrink-0"/>
                        <div>
                            {text}&nbsp;
                            <span className="text-green-highlight">{highlight}</span>
                        </div>
                    </div>
                ))}

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
