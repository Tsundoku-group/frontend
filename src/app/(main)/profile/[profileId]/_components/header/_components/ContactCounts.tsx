import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {User} from "lucide-react";
import React from "react";

const ContactCounts = ({
                           lastTwoFriends,
                           friendsCount,
                           followersCount,
                           setActiveTab,
                       }: {
    lastTwoFriends: { friendId: number; profilePhotoUrl: string }[];
    friendsCount?: number;
    followersCount?: number;
    setActiveTab: (tab: string) => void;
}) => (
    <div className="flex items-center space-x-4 text-sm text-gray-200">
        <div onClick={() => setActiveTab("friends")} className="flex items-center space-x-[-12px] cursor-pointer hover:text-blue-500 transition">
            {lastTwoFriends.map((friend, i) => (
                <Avatar key={i} className="w-8 h-8 ring-2 ring-black">
                    <AvatarImage src={friend.profilePhotoUrl} alt={`Ami ${friend.friendId}`} />
                    <AvatarFallback>
                        <User />
                    </AvatarFallback>
                </Avatar>
            ))}
        </div>
        <span className="ml-2">{friendsCount} contacts</span>
        <div onClick={() => setActiveTab("followers")} className="flex items-center space-x-2 cursor-pointer hover:text-blue-500 transition">
            <User className="w-5 h-5" />
            <span>{followersCount} followers</span>
        </div>
    </div>
);

export default ContactCounts;