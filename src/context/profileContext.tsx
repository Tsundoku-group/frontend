"use client";

import React, {createContext, useEffect, useState, useCallback, useRef} from "react";
import {useRouter} from "next/navigation";
import LoadingSkeleton from "@/components/loader/LoadingSkeleton";
import {Profile} from "@/models/Profile";
import {getProfileImageUrl} from "@/utils/profileImageUtils";

type ProfileContextType = {
    activeProfileInStorage: Profile | null;
    setActiveProfileInStorage: (profileData: Partial<Profile>, triggerLoading?: boolean) => void;
    isLoading: boolean;
    profileImageUrls: Record<string, string>;
    refreshProfileImage: (profileId: number, type: "profile" | "cover") => void
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

    const profileImageUrlsRef = useRef<Record<string, string>>({});

    useEffect(() => {
        profileImageUrlsRef.current = profileImageUrls;
    }, [profileImageUrls]);

    const loadProfileImages = useCallback(async (profileId: number) => {
        const currentUrls = profileImageUrlsRef.current;

        if (currentUrls[`${profileId}-profile`] && currentUrls[`${profileId}-cover`]) {
            return;
        }

        const cacheKeys = {
            profile: `profile-image-${profileId}-profile`,
            cover: `profile-image-${profileId}-cover`,
        };

        const cachedImages = {
            profile: localStorage.getItem(cacheKeys.profile),
            cover: localStorage.getItem(cacheKeys.cover),
        };

        setProfileImageUrls(prev => ({
            ...prev,
            ...(cachedImages.profile ? { [`${profileId}-profile`]: cachedImages.profile } : {}),
            ...(cachedImages.cover ? { [`${profileId}-cover`]: cachedImages.cover } : {})
        }));

        try {
            const urls = await getProfileImageUrl(profileId);

            for (const type of ["profile", "cover"] as const) {
                const url = urls[type];

                if (!url) {
                    continue;
                }

                const timestampedUrl = `${url}?t=${Date.now()}`;
                setProfileImageUrls((prev) => ({
                    ...prev,
                    [`${profileId}-${type}`]: timestampedUrl,
                }));

                localStorage.setItem(`profile-image-${profileId}-${type}`, timestampedUrl);
            }
        } catch (error) {
            setProfileImageUrls(prev => ({
                ...prev,
                [`${profileId}-profile`]: "",
                [`${profileId}-cover`]: "",
            }));
        }
    }, []);

    useEffect(() => {
        const storedProfile = localStorage.getItem("activeProfile");
        if (storedProfile) {
            const parsedProfile = JSON.parse(storedProfile) as Profile;
            setActiveProfileInStorageState(parsedProfile);

            void loadProfileImages(parsedProfile.id);
        }
        setInitialLoading(false);
    }, [loadProfileImages]);

    const setActiveProfileInStorage = (profileData: Partial<Profile>, triggerLoading: boolean = true) => {
        if (triggerLoading) {
            setIsLoading(true);
        }

        if (typeof profileData.id !== "number") {
            console.error("Le profil actif doit avoir un ID défini.");
            return;
        }

        const completeProfile: Profile = {
            id: profileData.id,
            firstName: profileData.firstName || "",
            lastName: profileData.lastName || "",
            username: profileData.username || "",
            status: profileData.status || 'offline',
            friendsCount: profileData.friendsCount || 0,
        };

        localStorage.setItem("activeProfile", JSON.stringify(completeProfile));
        setActiveProfileInStorageState(completeProfile);

        if (profileData.id) {
            void loadProfileImages(profileData.id);
        }

        if (triggerLoading) {
            router.refresh();
            setTimeout(() => setIsLoading(false), 3000);
        }
    };

    const refreshProfileImage = (profileId: number) => {
        const cacheKeys = {
            profile: `profile-image-${profileId}-profile`,
            cover: `profile-image-${profileId}-cover`,
        };

        localStorage.removeItem(cacheKeys.profile);
        localStorage.removeItem(cacheKeys.cover);

        void loadProfileImages(profileId);
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