'use client';

import React, {Suspense, useEffect, useState} from 'react';
import ProfileHeader from "@/app/(main)/profile/[profileId]/components/header/ProfileHeader";
import Body from "@/app/(main)/profile/[profileId]/components/body/Body";
import RightbarWrapper from "@/app/(main)/profile/[profileId]/components/rightbar/RightbarWrapper";
import {ProfileResult} from "@/models/Profile";
import {fetchUserProfile} from "@/server-actions/main/profile/actions";
import {getProfileImageUrl} from "@/utils/profileImageUtils";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {useProfileContext} from "@/context/profileContext";
import {useRouter} from "next/navigation";

type Props = {
    params: {
        profileId: number;
    };
};

const ProfilePage = React.memo(({params: {profileId}}: Props) => {
    const [activeTab, setActiveTab] = useState<string>("shelves");
    const queryClient = useQueryClient();
    const {activeProfileInStorage, profileImageUrls} = useProfileContext();
    const [imagesOtherProfiles, setImagesOtherProfiles] = useState<{ profileImageUrl: string; coverImageUrl: string } | null>(null);
    const router = useRouter();

    const isOwnProfile = activeProfileInStorage?.id === profileId;

    const {data: result, isLoading} = useQuery<ProfileResult>({
        queryKey: ['userProfile', profileId],
        queryFn: () => fetchUserProfile(profileId),
        initialData: () => queryClient.getQueryData<ProfileResult>(['userProfile', profileId]),
        staleTime: 1000 * 60 * 60,
    });

    useEffect(() => {
        if (!isOwnProfile && profileId) {
            getProfileImageUrl(profileId).then((images) => {
                setImagesOtherProfiles({
                    profileImageUrl: images.profile || "",
                    coverImageUrl: images.cover || "",
                })
            }).catch(() => {
                setImagesOtherProfiles({ profileImageUrl: "", coverImageUrl: "" });
            });
        }
    }, [isOwnProfile, profileId]);

    if (isLoading) return <div>Chargement du profil...</div>;

    if (result?.error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center">
                <h1 className="text-4xl font-bold text-red-highlight mb-4">Profil introuvable</h1>
                <p className="text-lg text-gray-600 mb-6">
                    Le profil que vous cherchez n&apos;existe pas ou a été supprimé.
                </p>
                <button
                    onClick={() => router.push('/')}
                    className="px-6 py-3 bg-tertiary-black text-white rounded-lg shadow hover:bg-secondary-black"
                >
                    Retour à l&apos;accueil
                </button>
            </div>
        );
    }
    const profile = result?.data;

    const profileImageUrl = isOwnProfile
        ? profileImageUrls[`${activeProfileInStorage?.id || ""}-profile`] || ''
        : imagesOtherProfiles?.profileImageUrl || profile?.profileImageUrl;

    const coverImageUrl = isOwnProfile
        ? profileImageUrls[`${activeProfileInStorage?.id || ""}-cover`] || ''
        : imagesOtherProfiles?.coverImageUrl || profile?.coverImageUrl;

    return (
        <div className="min-h-screen grid grid-cols-12 grid-rows-[auto,1fr] gap-8 pt-8">
            <div className="col-span-8 row-span-1">
                <ProfileHeader
                    id={profile?.id}
                    firstName={profile?.firstName}
                    lastName={profile?.lastName}
                    username={profile?.username}
                    friendsCount={profile?.friendsCount || 0}
                    followersCount={profile?.followersCount || 0}
                    bio={profile?.bio}
                    x={profile?.x}
                    instagram={profile?.instagram}
                    facebook={profile?.facebook}
                    profileImageUrl={profileImageUrl}
                    coverImageUrl={coverImageUrl}
                    lastTwoFriends={profile?.lastTwoFriends || []}
                    setActiveTab={setActiveTab}
                    isOwnProfile={isOwnProfile}
                />
            </div>

            <Suspense fallback={<div>Chargement du contenu...</div>}>
                <div className="col-span-8 row-start-2">
                    <Body profileId={profile?.id} activeTab={activeTab} setActiveTab={setActiveTab}
                          isOwnProfile={isOwnProfile}/>
                </div>
            </Suspense>

            <Suspense fallback={<div>Chargement de la sidebar...</div>}>
                <div className="col-span-4 row-span-full row-start-1">
                    <RightbarWrapper/>
                </div>
            </Suspense>
        </div>
    );
});

ProfilePage.displayName = 'ProfilePage';

export default ProfilePage;