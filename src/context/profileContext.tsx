"use client";

import React, { createContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import LoadingSkeleton from "@/components/loader/LoadingSkeleton";
import { Profile } from "@/models/Profile";
import { getProfileImageUrl } from "@/utils/profileImageUtils";

type ProfileContextType = {
    activeProfileInStorage: Profile | null;
    setActiveProfileInStorage: (profileData: Partial<Profile>, triggerLoading?: boolean) => void;
    isLoading: boolean;
    profileImageUrls: Record<string, string>;
    refreshProfileImage: (profileId: number, type: "profile" | "cover") => void;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
    const [activeProfileInStorage, setActiveProfileInStorageState] = useState<Profile | null>(null);
    const [profileImageUrls, setProfileImageUrls] = useState<Record<string, string>>({});
    const [initialLoading, setInitialLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const loadProfileImages = useCallback(async (profileId: number) => {
        const cache = (type: "profile" | "cover") => localStorage.getItem(`profile-image-${profileId}-${type}`);
        const hasCached = cache("profile") && cache("cover");

        if (hasCached) {
            setProfileImageUrls(prev => ({
                ...prev,
                [`${profileId}-profile`]: cache("profile")!,
                [`${profileId}-cover`]: cache("cover")!
            }));
            return;
        }

        try {
            const urls = await getProfileImageUrl(profileId);
            const timestamped = (url: string) => `${url}?t=${Date.now()}`;

            const updated = {
                [`${profileId}-profile`]: urls.profile ? timestamped(urls.profile) : "",
                [`${profileId}-cover`]: urls.cover ? timestamped(urls.cover) : ""
            };

            setProfileImageUrls(prev => ({ ...prev, ...updated }));

            Object.entries(updated).forEach(([key, val]) => {
                localStorage.setItem(`profile-image-${key}`, val);
            });
        } catch {
            setProfileImageUrls(prev => ({
                ...prev,
                [`${profileId}-profile`]: "",
                [`${profileId}-cover`]: ""
            }));
        }
    }, []);

    useEffect(() => {
        const stored = localStorage.getItem("activeProfile");
        if (stored) {
            const profile = JSON.parse(stored) as Profile;
            setActiveProfileInStorageState(profile);
            void loadProfileImages(profile.id);
        }
        setInitialLoading(false);
    }, [loadProfileImages]);

    const setActiveProfileInStorage = async (
        profileData: Partial<Profile>,
        triggerLoading = true
    ) => {
        if (typeof profileData.id !== "number") {
            console.error("Le profil actif doit avoir un ID défini.");
            return;
        }

        const profile: Profile = {
            id: profileData.id,
            firstName: profileData.firstName || "",
            lastName: profileData.lastName || "",
            username: profileData.username || "",
            status: profileData.status || "offline",
            friendsCount: profileData.friendsCount || 0
        };

        localStorage.setItem("activeProfile", JSON.stringify(profile));
        setActiveProfileInStorageState(profile);

        if (triggerLoading) {
            setIsLoading(true);
            await loadProfileImages(profile.id);
            router.refresh();
            setTimeout(() => setIsLoading(false), 2000);
        } else {
            void loadProfileImages(profile.id);
        }
    };

    const refreshProfileImage = (profileId: number) => {
        ["profile", "cover"].forEach(type =>
            localStorage.removeItem(`profile-image-${profileId}-${type}`)
        );
        void loadProfileImages(profileId);
    };

    if (initialLoading) return <LoadingSkeleton />;

    return (
        <ProfileContext.Provider
            value={{
                activeProfileInStorage,
                setActiveProfileInStorage,
                isLoading,
                profileImageUrls,
                refreshProfileImage
            }}
        >
            {isLoading ? <LoadingSkeleton /> : children}
        </ProfileContext.Provider>
    );
};

export const useProfileContext = () => {
    const context = React.useContext(ProfileContext);
    if (!context) throw new Error("useProfile must be used within a ProfileProvider");
    return context;
};