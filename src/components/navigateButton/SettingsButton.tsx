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
        <Button onClick={handleNavigateProfilePage} className="flex text-white bg-transparent outline-none focus:outline-none hover:bg-gray-700 hover:text-gray-200 transition-colors duration-200 rounded-lg">
            <Settings className="mr-2 w-4" />
            Paramètres
        </Button>
    );
}

export default SettingsButton;