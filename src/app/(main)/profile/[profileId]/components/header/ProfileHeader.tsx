import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Facebook, Instagram, Twitter, User } from "lucide-react";
import {Profile} from "@/models/Profile";
import {useProfileContext} from "@/context/profileContext";

const ProfileHeader: React.FC<Profile> = React.memo(({firstName, lastName, username, coverUrl, friendsCount, followersCount, bio, x, instagram, facebook}) => {
    const { activeProfileInStorage, profileImageUrls } = useProfileContext();

    return (
        <div className="max-w-6xl mx-auto relative">
            <div className="bg-gray-900 rounded-t-2xl text-white shadow-lg overflow-hidden">
                <div className="w-full h-24 bg-gray-700 rounded-t-2xl overflow-hidden">
                    {coverUrl ? (
                        <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-r from-indigo-600 to-purple-600"></div>
                    )}
                </div>
            </div>

            <div className="bg-gray-900 rounded-b-2xl text-white shadow-lg p-8 relative">
                <div className="flex items-center justify-center w-full px-8 -mt-20 relative">
                    <div className="absolute left-0 flex items-center space-x-6 pt-4 text-sm text-gray-200">
                        <div className="flex items-center space-x-2">
                            <User className="w-5 h-5"/>
                            <span>{friendsCount} amis</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <User className="w-5 h-5"/>
                            <span>{followersCount} followers</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-center relative z-10">
                        <div className="w-32 h-32 bg-gray-900 rounded-full flex items-center justify-center">
                            <Avatar className="w-28 h-28 border-white rounded-full">
                                <AvatarImage
                                    src={profileImageUrls[activeProfileInStorage?.id || ''] || ''}
                                    alt={activeProfileInStorage?.username || "Profile Image"}
                                    className="object-cover object-center"
                                />
                                <AvatarFallback>
                                    <User className="w-6 h-6 text-gray-500" />
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    </div>

                    <div className="absolute right-0 flex space-x-4 text-white pt-4">
                        {x || instagram || facebook ? (
                            <>
                                <a href={x} target="_blank" rel="noopener noreferrer">
                                    <Twitter className="w-6 h-6 hover:text-blue-400 transition-colors"/>
                                </a>
                                <a href={instagram} target="_blank" rel="noopener noreferrer">
                                    <Instagram className="w-6 h-6 hover:text-pink-400 transition-colors"/>
                                </a>
                                <a href={facebook} target="_blank" rel="noopener noreferrer">
                                    <Facebook className="w-6 h-6 hover:text-blue-700 transition-colors"/>
                                </a>
                            </>
                        ) : null}
                    </div>
                </div>

                <div className="flex flex-col items-center text-center mt-4">
                    <h5 className="text-2xl font-semibold">{firstName} {lastName}</h5>
                    <p className="text-sm text-gray-500">@{username}</p>
                    <p className="mt-2 text-sm text-gray-200">{bio}</p>
                </div>

                <div className="my-4 border-t border-gray-500 opacity-50 w-full"></div>

                <div className="mt-6 flex justify-center space-x-4">
                    <span className="w-6 h-6 bg-red-500 rounded-full"></span>
                    <span className="w-6 h-6 bg-green-500 rounded-full"></span>
                    <span className="w-6 h-6 bg-blue-500 rounded-full"></span>
                    <span className="w-6 h-6 bg-yellow-500 rounded-full"></span>
                </div>
            </div>
        </div>
    );
});

ProfileHeader.displayName = 'ProfileHeader';

export default ProfileHeader;