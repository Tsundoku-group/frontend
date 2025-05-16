"use client";

import React from "react";
import CoverImage from "@/app/(main)/profile/[profileId]/_components/header/_components/CoverImage";
import ContactCounts from "@/app/(main)/profile/[profileId]/_components/header/_components/ContactCounts";
import ProfileAvatarWithDialog
    from "@/app/(main)/profile/[profileId]/_components/header/_components/ProfileAvatarWithDialog";
import SocialLinks from "@/app/(main)/profile/[profileId]/_components/header/_components/SocialLinks";
import ProfileInfo from "@/app/(main)/profile/[profileId]/_components/header/_components/ProfileInfo";
import LatestBadgesChallenges
    from "@/app/(main)/profile/[profileId]/_components/header/_components/LatestBadgesChallenges";

type ProfileHeaderProps = {
    id?: number;
    firstName?: string;
    lastName?: string;
    username?: string;
    friendsCount?: number;
    followersCount?: number;
    bio?: string;
    x?: string;
    instagram?: string;
    facebook?: string;
    profileImageUrl?: string;
    coverImageUrl?: string;
    lastTwoFriends: { friendId: number; profilePhotoUrl: string }[];
    setActiveTab: (tab: string) => void;
    isOwnProfile: boolean;
};

const ProfileHeader: React.FC<ProfileHeaderProps> = (props) => {
    return (
        <div className="max-w-6xl mx-auto relative">
            <div className="bg-gray-900 rounded-t-2xl text-white shadow-lg overflow-hidden">
                <CoverImage coverImageUrl={props.coverImageUrl} />
            </div>

            <div className="bg-gray-900 rounded-b-2xl text-white shadow-lg p-8 relative">
                <div className="flex items-center justify-center w-full px-8 -mt-20 relative">
                    <div className="absolute left-0 pt-4">
                        <ContactCounts
                            lastTwoFriends={props.lastTwoFriends}
                            friendsCount={props.friendsCount}
                            followersCount={props.followersCount}
                            setActiveTab={props.setActiveTab}
                        />
                    </div>

                    <div className="flex items-center justify-center relative z-10">
                        <ProfileAvatarWithDialog profileImageUrl={props.profileImageUrl} username={props.username} />
                    </div>

                    <div className="absolute right-36 pt-4">
                        <SocialLinks x={props.x} instagram={props.instagram} facebook={props.facebook} />
                    </div>
                </div>

                <ProfileInfo
                    firstName={props.firstName}
                    lastName={props.lastName}
                    username={props.username}
                    bio={props.bio}
                />

                <div className="my-4 border-t border-tertiary-black opacity-100 w-96 mx-auto" />
                <LatestBadgesChallenges />
            </div>
        </div>
    );
};

export default ProfileHeader;