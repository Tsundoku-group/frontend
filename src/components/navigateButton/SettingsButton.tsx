'use client'

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {Settings} from "lucide-react";

const SettingsButton = () => {
    const router = useRouter();

    const handleNavigateProfilePage = () => {
        router.push(`/profileSettings`);
    }

    return (
        <Button onClick={handleNavigateProfilePage} className="flex items-center text-black bg-transparent outline-none focus:outline-none hover:bg-hover-bg-color">
            <Settings className="mr-2 w-4" />
            Paramètres
        </Button>
    );
}

export default SettingsButton;