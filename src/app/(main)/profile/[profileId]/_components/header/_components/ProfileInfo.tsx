import React from "react";

const ProfileInfo = ({
                         firstName,
                         lastName,
                         username,
                         bio,
                     }: {
    firstName?: string;
    lastName?: string;
    username?: string;
    bio?: string;
}) => (
    <div className="flex flex-col items-center text-center mt-4">
        <div className="text-xl text-text-white font-medium">{firstName} {lastName}</div>
        <div className="text-sm text-gray-400 font-thin">@{username}</div>
        <div className="mt-6 text-sm font-medium text-gray-200">{bio}</div>
    </div>
);

export default ProfileInfo;