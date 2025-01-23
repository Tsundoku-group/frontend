'use client'

import React from "react";
import {useRouter} from "next/navigation";
import {Avatar, AvatarImage, AvatarFallback} from "@/components/ui/avatar";
import {Edit2, User} from "lucide-react";
import {useProfileContext} from "@/context/profileContext";

type ProfileButtonProps = {
    profileId: string;
    email: string;
    onClose: () => void;
};

const ProfileButton = ({profileId, email, onClose}: ProfileButtonProps) => {
    const router = useRouter();
    const { profileImageUrls } = useProfileContext();

    const handleNavigateProfilePage = () => {
        router.push(`/profile/${profileId}`);
        onClose();
    };

    return (
        <div className="relative flex flex-col items-center cursor-pointer" onClick={handleNavigateProfilePage}>
            <Avatar className="w-16 h-16 relative">
                <AvatarImage
                    src={profileImageUrls[`${profileId}-profile`] || ''}
                    alt="Profile Image"
                    className="object-cover object-center"
                />
                <AvatarFallback>
                    <User className="w-6 h-6 text-gray-500" />
                </AvatarFallback>
            </Avatar>
            <Edit2
                className="absolute top-10 ml-10 w-6 h-6 bg-white rounded-full p-1 text-gray-500 cursor-pointer z-10"
            />

            <div className="text-xs text-gray-500">{email}</div>
        </div>
    );
};

export default ProfileButton;