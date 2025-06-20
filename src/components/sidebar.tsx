'use client';

import React, {ReactNode, useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
=======
import {
    Search,
    Activity,
    MessageSquareText,
    Heart,
    Star,
    ChevronRight,
    ChevronDown, Pencil
} from 'lucide-react';
import {useSocket} from '@/context/socketContext';
import {useProfileContext} from '@/context/profileContext';
import {Card} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import ReshotIllustration from '@/assets/images/ReshotIllustration';
import IcBaselineWechat from '@/assets/icons/IcBaselineWechat';
import UsersFilled from '@/assets/icons/UsersFilled';
import TrophyFilled from '@/assets/icons/TrophyFilled';
import PencilFilled from '@/assets/icons/PencilFilled';
import LibraryFilled from '@/assets/icons/LibraryFilled';
import HomeRoundedFilled from '@/assets/icons/HomeRoundedFilled';
import UserFilled from '@/assets/icons/UserFilled';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from '@/components/ui/tooltip';
import {cn} from '@/lib/utils';
import OpenBook from "@/assets/icons/OpenBook";

interface SidebarCollapseItem {
    label: string;
    icon?: ReactNode;
    onClick?: () => void;
}

interface SidebarGroupsCollapsedProps {
    title: string;
    icon: ReactNode;
    items: SidebarCollapseItem[];
    isCollapsed: boolean;
}

export function SidebarGroupCollapse({
                                         title,
                                         icon,
                                         items,
                                         isCollapsed,
                                     }: SidebarGroupsCollapsedProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className={cn(
                            "group w-full flex items-center bg-transparent hover:bg-tertiary-black px-3 py-2.5 rounded-2xl transition-all",
                            isCollapsed ? "justify-center" : "justify-between"
                        )}
                    >
                        <div className="flex items-center gap-3">
                            {icon}
                            {!isCollapsed && (
                                <span className="text-white text-[13px] font-medium">{title}</span>
                            )}
                        </div>
                        {!isCollapsed &&
                            (isOpen ? (
                                <ChevronDown className="w-4 h-4 text-[#e1e1ec] transition-all" />
                            ) : (
                                <ChevronRight className="w-4 h-4 text-[#e1e1ec] transition-all" />
                            ))}
                    </button>
                </TooltipTrigger>

                {isCollapsed && (
                    <TooltipContent side="right" className="bg-tertiary-black border-secondary-black text-text-white">
                        {title}
                    </TooltipContent>
                )}
            </Tooltip>

            {!isCollapsed && (
                <ul
                    className={cn(
                        "pl-4 overflow-hidden transition-[max-height] duration-500 ease-in-out",
                        isOpen ? "max-h-60" : "max-h-0"
                    )}
                >
                    <div className="relative pl-4">
                        <div className="absolute left-1 top-0 h-full w-px bg-text-white opacity-30" />
                        {items.map((item, index) => (
                            <li key={index}>
                                <button
                                    onClick={item.onClick}
                                    className="group w-full flex items-center justify-between bg-transparent hover:bg-tertiary-black px-3 py-2 rounded-xl transition-all text-xs"
                                >
                                    <div>{item.label}</div>
                                    <ChevronRight className="w-3 h-3 text-white opacity-0 translate-x-[-4px] transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0" />
                                </button>
                            </li>
                        ))}
                    </div>
                </ul>
            )}
        </TooltipProvider>
    );
}

export default function Sidebar({isCollapsed}: { isCollapsed: boolean }) {
    const [unreadMessages, setUnreadMessages] = useState(0);
    const [isClient, setIsClient] = useState(false);
    const { socket } = useSocket();
    const { activeProfileInStorage } = useProfileContext();
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
                setUnreadMessages(prev => {
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

    const navItems = [
        {path: '/shelves', icon: LibraryFilled, label: 'Étagères'},
        {path: '/challenges', icon: TrophyFilled, label: 'Défis'},
        {path: '/conversations', icon: IcBaselineWechat, label: 'Messages'},
        {path: '/articles', icon: PencilFilled, label: 'Articles'},
    ];
    return (
        <>
            <div
                className={cn(
                    'fixed min-h-screen transition-all duration-500 flex flex-col py-6 px-5 text-text-white z-50',
                    isCollapsed ? 'w-20 items-center' : 'w-60'
                )}
                style={{background: 'linear-gradient(to bottom, #281f39 1%, #171C26 40%)'}}
            >
                <div
                    className={cn(
                        "flex items-center justify-center h-16 transition-all duration-500",
                        isCollapsed ? " scale-90 pointer-events-none" : "opacity-100 scale-100"
                    )}
                >
                    {!isCollapsed ? (
                        <div className="text-[20px] tracking-wide font-extralight text-[#e1e1ec] text-center">
                            tsundoku
                        </div>
                    ) : (
                        <OpenBook className="w-10 h-auto"/>
                    )}
                </div>

                <div
                    className={cn(
                        "px-4 transition-all duration-500",
                        isCollapsed ? "opacity-0 scale-95 h-0 overflow-hidden" : "opacity-100 scale-100 h-auto"
                    )}
                >
                    <div
                        className="flex items-center bg-secondary-black border border-secondary-black rounded-2xl px-3 py-2">
                        <input
                            type="text"
                            placeholder="Explorer"
                            className="bg-transparent focus:outline-none text-white w-full placeholder:text-[#cfcfe1] text-sm"
                        />
                                           <button onClick={() => {
                        goTo('/search?term=' + search)
                        setSearch('')
                    }}>
                        <Search className="text-[#cfcfe1] w-4 h-4 ml-2"/>
                    </button>
                    </div>

                    <div className="flex gap-4 justify-center items-center mt-12">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        onClick={() => goTo('/home')}
                                        className="w-12 h-12 bg-secondary-black rounded-2xl flex items-center justify-center shadow-md transition-all duration-150 ease-in-out hover:bg-tertiary-black active:scale-95"
                                    >
                                        <HomeRoundedFilled className="text-text-white w-5 h-5"/>
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent
                                    side="top"
                                    className="bg-tertiary-black border border-secondary-black px-3 py-2 rounded-lg text-text-white text-xs"
                                >
                                    Accueil
                                </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        onClick={() => goTo(`/profile/${profileId}`)}
                                        className="w-12 h-12 bg-secondary-black rounded-2xl flex items-center justify-center shadow-md transition-all duration-150 ease-in-out hover:bg-tertiary-black active:scale-95"
                                    >
                                        <UserFilled className="text-text-white w-5 h-5"/>
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent
                                    side="top"
                                    className="bg-tertiary-black border border-secondary-black px-3 py-2 rounded-lg text-text-white text-xs"
                                >
                                    Profil
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
                <nav
                    className={cn(
                        "transition-[max-height,opacity,transform] duration-500 ease-in-out mt-12 mb-12 w-full",
                        isCollapsed ? "max-h-0 scale-y-95" : "max-h-[600px] scale-y-100"
                    )}
                >
                    <ul className="flex flex-col gap-y-2 pl-[6px]">
                        {navItems.map(({ path, icon: Icon, label }) => (
                            <li key={path}>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                onClick={() => goTo(path)}
                                                className={cn(
                                                    "group w-full flex items-center bg-transparent hover:bg-tertiary-black px-3 py-2.5 rounded-2xl transition-all",
                                                    isCollapsed ? "justify-center" : "justify-between"
                                                )}
                                            >
                                                <div className="flex items-center">
                                                    <Icon className="w-5 h-5 shrink-0" />
                                                    <div
                                                        className={cn(
                                                            "transition-all duration-300 transform origin-top",
                                                            isCollapsed
                                                                ? "opacity-0 scale-y-0 -translate-y-4 h-0 w-0"
                                                                : "opacity-100 scale-y-100 translate-y-0 w-auto ml-3"
                                                        )}
                                                    >
                                                        {label}
                                                    </div>
                                                    {label === 'Messages' && unreadMessages > 0 && (
                                                        <span className="ml-1 bg-red-highlight text-[10px] rounded-full h-4 w-4 flex items-center justify-center text-white font-semibold">
                                                      {unreadMessages}
                                                    </span>
                                                    )}
                                                </div>
                                                {!isCollapsed && (
                                                    <ChevronRight className="w-4 h-4 text-[#e1e1ec] opacity-0 translate-x-[-4px] transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0" />
                                                )}
                                            </Button>
                                        </TooltipTrigger>
                                        {isCollapsed &&
                                            <TooltipContent side="right" className="bg-tertiary-black border-secondary-black text-text-white">
                                                {label}
                                            </TooltipContent>
                                        }
                                    </Tooltip>
                                </TooltipProvider>
                            </li>
                        ))}
                        <SidebarGroupCollapse
                            title="Clubs"
                            icon={<UsersFilled className="w-5 h-5 text-white" />}
                            isCollapsed={isCollapsed}
                            items={[
                                { label: 'Mes clubs', onClick: () => goTo('/clubs') },
                                { label: 'Explorer', onClick: () => goTo('/clubs/explore') },
                                { label: 'Créer un club', onClick: () => goTo('/clubs/new') },
                            ]}
                        />
                    </ul>
                </nav>
                <div
                    className={cn(
                        "transition-all duration-500",
                        isCollapsed ? "opacity-0 scale-95 h-0 overflow-hidden" : "opacity-100 scale-100 h-auto"
                    )}
                >
                    <div className="flex items-center mb-3 text-xs font-medium text-[#e1e1ec] justify-center">
                        <Activity className="w-4 h-4 mr-2"/> Activité
                    </div>
                    <Card className="bg-tertiary-black p-3 space-y-2 rounded-2xl border border-secondary-black">
                        {[{
                            icon: MessageSquareText,
                            text: "Vous avez commenté la publication de",
                            highlight: "Chat Potelé"
                        }, {
                            icon: Heart, text: "Vous avez aimé la publication de", highlight: "Alex Ception"
                        }, {
                            icon: Pencil, text: "Vous avez publié l’article", highlight: "Mes 10 auteurs préférés..."
                        }, {
                            icon: Star, text: "Vous avez laissé un avis sur", highlight: "La Cité Diaphane"
                        }].map(({icon: Icon, text, highlight}, i) => (
                            <div key={i} className="flex items-center text-[10px] text-[#cfcfe1]">
                                <Icon className="w-3 h-3 mr-2"/>
                                <span>{text} <span className="text-green-highlight">{highlight}</span></span>
                            </div>
                        ))}
                        <div className="flex justify-center">
                            <ReshotIllustration/>
                        </div>
                        <div className="pt-3 text-center text-gray-500 text-[10px] italic">
                            Plus rien à signaler !
                        </div>
                    </Card>
                </div>
            </div>
        </>
    );
}
