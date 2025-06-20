import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {User} from "lucide-react";
import React from "react";
import UserFilled from "@/assets/icons/UserFilled";

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
    <div className="flex items-center space-x-2 text-sm text-gray-200 mt-1">
        <div onClick={() => setActiveTab("friends")} className="flex items-center space-x-[-12px] cursor-pointer hover:text-blue-500 transition pl-6">
            {lastTwoFriends.map((friend, i) => (
                <Avatar
                    key={i}
                    className="w-7 h-7 ring-2 ring-black"
                    style={{ zIndex: lastTwoFriends.length - i }}
                >
                    <AvatarImage src={friend.profilePhotoUrl} alt={`Ami ${friend.friendId}`} />
                    <AvatarFallback>
                        <User />
                    </AvatarFallback>
                </Avatar>
            ))}
        </div>
        <div className="text-xs">{friendsCount} contacts</div>
        <div onClick={() => setActiveTab("followers")} className="flex items-center space-x-1 cursor-pointer hover:text-blue-500 transition pl-4">
            <UserFilled className="w-7 h-7 text-text-white" />
            <div className="text-xs">{followersCount} suivies</div>
        </div>
    </div>
);

export default ContactCounts;