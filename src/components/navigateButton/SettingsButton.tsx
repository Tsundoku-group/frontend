'use client'

import React from "react";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import {Settings} from "lucide-react";

const SettingsButton = () => {
    const router = useRouter();

    const handleNavigateProfilePage = () => {
        router.push(`/profileSettings`);
    }

    return (
        <Button
            onClick={handleNavigateProfilePage}
            className="flex justify-between  text-white bg-transparent outline-none focus:outline-none hover:bg-hover-bg-color hover:bg-gray-700 hover:text-gray-200 transition-colors duration-200 rounded-lg">
            <div className="flex items-center">
                <Settings className=" mr-3 w-4"/>
                Paramètres
            </div>
        </Button>
    );
}

export default SettingsButton;