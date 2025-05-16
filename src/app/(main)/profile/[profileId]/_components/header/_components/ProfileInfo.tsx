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
        <h5 className="text-2xl font-semibold">{firstName} {lastName}</h5>
        <p className="text-sm text-gray-500">@{username}</p>
        <p className="mt-2 text-sm text-gray-200">{bio}</p>
    </div>
);

export default ProfileInfo;