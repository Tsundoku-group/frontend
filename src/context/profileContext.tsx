"use client";

import React, {createContext, useEffect, useState, useCallback} from "react";
import {useRouter} from "next/navigation";
import LoadingSkeleton from "@/components/loader/LoadingSkeleton";
import {Profile} from "@/models/Profile";
import {getProfileImageUrl} from "@/utils/profileImageUtils";

type ProfileContextType = {
    activeProfileInStorage: Profile | null;
    setActiveProfileInStorage: (profileData: Partial<Profile>, triggerLoading?: boolean) => void;
    isLoading: boolean;
    profileImageUrls: Record<string, string>;
    refreshProfileImage: (profileId: string) => void;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({children}: { children: React.ReactNode }) => {
    const [activeProfileInStorage, setActiveProfileInStorageState] = useState<Profile | null>(() => {
        if (typeof window !== "undefined") {
            const storedProfile = localStorage.getItem("activeProfile");
            return storedProfile ? (JSON.parse(storedProfile) as Profile) : null;
        }
        return null;
    });

    const [profileImageUrls, setProfileImageUrls] = useState<Record<string, string>>({});
    const [initialLoading, setInitialLoading] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();

    const loadProfileImage = useCallback(async (profileId: string) => {
        const cacheKey = `profile-image-${profileId}`;
        const cachedImage = localStorage.getItem(cacheKey);

        if (cachedImage) {
            setProfileImageUrls(prev => ({...prev, [profileId]: cachedImage}));
        } else {
            try {
                const url = await getProfileImageUrl(profileId, '');
                const timestampedUrl = `${url}?t=${Date.now()}`;
                setProfileImageUrls(prev => ({...prev, [profileId]: timestampedUrl}));

                localStorage.setItem(cacheKey, timestampedUrl);
            } catch (error) {
                setProfileImageUrls(prev => ({...prev, [profileId]: ''}));
            }
        }
    }, []);

    useEffect(() => {
        const storedProfile = localStorage.getItem("activeProfile");
        if (storedProfile) {
            const parsedProfile = JSON.parse(storedProfile) as Profile;
            setActiveProfileInStorageState(parsedProfile);

            loadProfileImage(parsedProfile.id);
        }
        setInitialLoading(false);
    }, [loadProfileImage]);

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

        localStorage.setItem("activeProfile", JSON.stringify(completeProfile));
        setActiveProfileInStorageState(completeProfile);

        if (profileData.id) {
            loadProfileImage(profileData.id);
        }

        if (triggerLoading) {
            router.refresh();
            setTimeout(() => setIsLoading(false), 3000);
        }
    };

    const refreshProfileImage = (profileId: string) => {
        localStorage.removeItem(`profile-image-${profileId}`);
        loadProfileImage(profileId);
    };

    if (initialLoading) {
        return <LoadingSkeleton/>;
    }

    return (
        <ProfileContext.Provider
            value={{
                activeProfileInStorage,
                setActiveProfileInStorage,
                isLoading,
                profileImageUrls,
                refreshProfileImage,
            }}
        >
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