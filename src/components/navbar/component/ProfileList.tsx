import { memo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { truncateString } from "@/utils/string-utils";

interface Props {
    profiles: { id: number; username: string; activeProfile: boolean }[];
    profileImageUrls: Record<string, string>;
    getProfileImageUrl: (urls: Record<string, string>, id?: number) => string;
}

function ProfileListComponent({ profiles, profileImageUrls, getProfileImageUrl }: Props) {
    return (
        <>
            {profiles.map((profile) => (
                <div
                    key={profile.id}
                    className={`flex items-center space-x-1 text-white w-full hover:bg-gray-700 p-1 rounded-lg transition ${
                        profile.activeProfile ? 'bg-gray-800 border border-green-500' : ''
                    }`}
                >
                    <label htmlFor={`profile-${profile.id}`} className="flex items-center w-full cursor-pointer">
                        <div className="relative">
                            <Avatar className="w-12 h-12">
                                <AvatarImage
                                    src={getProfileImageUrl(profileImageUrls, profile.id)}
                                    alt={profile.username}
                                />
                                <AvatarFallback>
                                    <User className="w-6 h-6 text-gray-500" />
                                </AvatarFallback>
                            </Avatar>
                            {profile.activeProfile && (
                                <div className="absolute top-9 -right-1 w-3.5 h-3.5 bg-green-highlight rounded-full border-2 border-gray-800" />
                            )}
                        </div>
                        <span className="text-sm ml-4">{truncateString(profile.username, 10)}</span>
                    </label>
                    <RadioGroupItem
                        value={profile.id.toString()}
                        id={`profile-${profile.id}`}
                        className="h-5 w-5 border-gray-400 checked:bg-green-highlight"
                    />
                </div>
            ))}
        </>
    );
}

export const ProfileList = memo(ProfileListComponent);