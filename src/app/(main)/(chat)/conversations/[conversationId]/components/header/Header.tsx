import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { useSocket } from "@/context/socketContext";

type Props = {
    imageUrl?: string;
    name: string;
    otherParticipantId: number;
};

const Header = ({ imageUrl, name, otherParticipantId }: Props) => {
    const {socket} = useSocket();
    const [isOnline, setIsOnline] = useState(false);

    useEffect(() => {
        if (socket && otherParticipantId) {
            socket.on("user_status_update", ({ userId, status }) => {
                if (otherParticipantId === userId) {
                    setIsOnline(status === "online");
                }
            });

            return () => {
                socket.off("user_status_update");
            };
        }
    }, [socket, otherParticipantId]);

    return (
        <Card className="w-full flex items-center p-4 justify-start gap-3 bg-transparent border-none shadow-none">
            <div className="relative">
                <Avatar className="w-10 h-10">
                    <AvatarImage src={imageUrl} alt={name}/>
                    <AvatarFallback>
                        <User/>
                    </AvatarFallback>
                </Avatar>
                {isOnline && (
                    <span
                        className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                )}
            </div>

            <div className="flex flex-col">
                <h1 className="font-semibold text-black">{name}</h1>
                <span className={`text-sm ${isOnline ? 'text-green-500' : 'text-gray-500'}`}>
                    {isOnline ? "En ligne" : "Hors ligne"}
                </span>
            </div>
        </Card>
    );
};

export default Header;