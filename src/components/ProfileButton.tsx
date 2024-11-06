'use client'

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

type ProfileButtonProps = {
    userId: number;
};


const ProfileButton = ({userId}: ProfileButtonProps) => {
    const router = useRouter();

    const handleNavigateProfilePage = () => {
        router.push(`/profile/${userId}`);
    }

    return (
        <Button onClick={handleNavigateProfilePage} className="flex items-center text-black bg-transparent outline-none focus:outline-none hover:bg-hover-bg-color">
            <User className="mr-2 w-4" />
            Ma page profil
        </Button>
    );
}

export default ProfileButton;