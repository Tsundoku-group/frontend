'use client'

import React from "react";
import {useRouter} from "next/navigation";
import {Avatar, AvatarImage, AvatarFallback} from "@/components/ui/avatar";
import {Edit2, User} from "lucide-react";

type ProfileButtonProps = {
    userId: number;
    email: string;
    imageUrl?: string;
    name?: string;
};

const ProfileButton = ({userId, email, imageUrl, name}: ProfileButtonProps) => {
    const router = useRouter();

    const handleNavigateProfilePage = () => {
        router.push(`/profile/${userId}`);
    };

    return (
        <div className="relative flex flex-col items-center cursor-pointer" onClick={handleNavigateProfilePage}>
            <Avatar className="w-16 h-16 relative">
                <AvatarImage src="https://github.com/shadcn.png" alt={name}/>
                <AvatarFallback>
                    <User className="w-8 h-8 text-gray-500"/>
                </AvatarFallback>
            </Avatar>
            <Edit2
                className="absolute top-10 right-1 w-6 h-6 bg-white rounded-full p-1 text-gray-500 cursor-pointer z-10"
            />

            <div className="text-xs text-gray-500">{email}</div>
        </div>
    );
};

export default ProfileButton;