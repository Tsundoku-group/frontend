"use client";

import React, {createContext, useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import LoadingSkeleton from "@/components/loader/LoadingSkeleton";
import {Profile} from "@/models/Profile";

type ProfileContextType = {
    activeProfileInStorage: Profile | null;
    setActiveProfileInStorage: (profileData: Partial<Profile>, triggerLoading?: boolean ) => void;
    isLoading: boolean;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
    const [activeProfileInStorage, setActiveProfileInStorageState] = useState<Profile | null>(() => {
        if (typeof window !== "undefined") {
            const storedProfile = localStorage.getItem("activeProfile");
            return storedProfile ? (JSON.parse(storedProfile) as Profile) : null;
        }
        return null;
    });
    const [initialLoading, setInitialLoading] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        const storedProfile = localStorage.getItem("activeProfile");
        if (storedProfile) {
            const parsedProfile = JSON.parse(storedProfile) as Profile;
            setActiveProfileInStorageState(parsedProfile);
        }
        setInitialLoading(false);
    }, []);

    const setActiveProfileInStorage = (profileData: Partial<Profile>, triggerLoading: boolean = true) => {
        if (triggerLoading) {
            setIsLoading(true);
        }

        const completeProfile: Profile = {
            id: profileData.id as string,
            firstName: profileData.firstName || "",
            lastName: profileData.lastName || "",
            username: profileData.username || "",
            status: profileData.status || 'offline',
        };

        localStorage.setItem("activeProfile", JSON.stringify(profileData));
        setActiveProfileInStorageState(completeProfile);

        if (triggerLoading) {
            router.refresh();
            setTimeout(() => setIsLoading(false), 3000);
        }
    };

    if (initialLoading) {
        return <LoadingSkeleton />;
    }

    return (
        <ProfileContext.Provider value={{ activeProfileInStorage, setActiveProfileInStorage, isLoading }}>
            {children}
        </ProfileContext.Provider>
    );
};

export const useProfileContext = () => {
    const context = React.useContext(ProfileContext);
    if (context === undefined) {
        throw new Error("useProfile must be used within a ProfileProvider");
    }
    return context;
};