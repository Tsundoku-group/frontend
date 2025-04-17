'use client'

import React from 'react';
import {deleteSession} from "@/services/auth/session";
import {useAuthContext} from "@/context/authContext";
import {Button} from "@/components/ui/button";
import {Plug} from "lucide-react";
import {useProfileContext} from "@/context/profileContext";
import {setUserProfileStatus} from "@/components/navbar/actions";

type LogoutButtonProps = {
    onClose: () => void;
}

const LogoutButton = ({onClose}: LogoutButtonProps) => {
    const {setIsAuthenticated, setUser} = useAuthContext();
    const {activeProfileInStorage} = useProfileContext();

    const handleLogout = async () => {
        try {
            if (activeProfileInStorage) {
                await setUserProfileStatus(activeProfileInStorage.id, "offline");
            }
            await deleteSession();
            setIsAuthenticated(false);
            setUser(null);
            onClose();
        } catch (error) {
            throw new Error('Failed to Logout');
        }
    };

    return (
            <Button
                onClick={handleLogout}
                className="flex justify-between text-white bg-transparent outline-none focus:outline-none hover:bg-hover-bg-color hover:bg-gray-700 hover:text-gray-200 transition-colors duration-200 rounded-lg">
                <div className="flex items-center">
                    <Plug className="mr-2 w-4"/>
                    Se déconnecter
                </div>
            </Button>
    );
};

export default LogoutButton;