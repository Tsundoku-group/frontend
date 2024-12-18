'use client';

import React, { Suspense, useEffect } from 'react';
import ProfileHeader from "@/app/(main)/profile/[profileId]/components/header/ProfileHeader";
import Body from "@/app/(main)/profile/[profileId]/components/body/Body";
import RightbarWrapper from "@/app/(main)/profile/[profileId]/components/rightbar/RightbarWrapper";
import { Profile } from "@/models/Profile";
import { fetchUserProfile } from "@/app/(main)/profile/[profileId]/actions";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {useRouter} from "next/navigation";
import {useProfile} from "@/context/profileContext";

type Props = {
    params: {
        profileId: string;
    };
};

const ProfilePage = React.memo(({ params: { profileId } }: Props) => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const {activeProfileInStorage} = useProfile();

    useEffect(() => {
        if (activeProfileInStorage?.id && activeProfileInStorage.id.toString() !== profileId) {
            router.replace(`/profile/${activeProfileInStorage.id}`);
        }
    }, [profileId, activeProfileInStorage, router]);

    const { data: profile, isLoading, isError } = useQuery<Profile>({
        queryKey: ['userProfile', profileId],
        queryFn: () => fetchUserProfile(profileId),
        initialData: () => queryClient.getQueryData(['userProfile', profileId]) as Profile,
        staleTime: 1000 * 60 * 60,
    });

    if (isLoading) return <div>Chargement du profil...</div>;
    if (isError || !profile) return <div>Profil introuvable.</div>;

    return (
        <div className="min-h-screen grid grid-cols-12 grid-rows-[auto,1fr] gap-8 pt-8">
            <div className="col-span-8 row-span-1">
                <ProfileHeader
                    id={profile.id}
                    firstName={profile.firstName}
                    lastName={profile.lastName}
                    username={profile.username}
                    avatarUrl="https://github.com/shadcn.png"
                    friendsCount={142}
                    followersCount={503}
                    bio={profile.bio}
                    x={profile.x}
                    instagram={profile.instagram}
                    facebook={profile.facebook}

                />
            </div>

            <Suspense fallback={<div>Chargement du contenu...</div>}>
                <div className="col-span-8 row-start-2">
                    <Body />
                </div>
            </Suspense>

            <Suspense fallback={<div>Chargement de la sidebar...</div>}>
                <div className="col-span-4 row-span-full row-start-1">
                    <RightbarWrapper />
                </div>
            </Suspense>
        </div>
    );
});

ProfilePage.displayName = 'ProfilePage';

export default ProfilePage;