import {DropdownMenu, DropdownMenuContent, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {ChevronDown, ChevronLeft, ChevronRight, User, UserPen} from "lucide-react";
import {ProfileStatus} from "./UserStatusBadge";
import {truncateString} from "@/utils/string-utils";
import ProfileButton from "@/components/navigateButton/ProfileButton";
import {Button} from "@/components/ui/button";
import SettingsButton from "@/components/navigateButton/SettingsButton";
import LogoutButton from "@/components/navigateButton/logoutButton";
import {RadioGroup} from "@/components/ui/radio-group";
import {fetchUserProfiles, setActiveUserProfile, setUserProfileStatus} from "@/server-actions/navbar/actions";
import {ShowToast} from "@/components/ShowToast";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useAuthContext} from "@/context/authContext";
import {useProfileContext} from "@/context/profileContext";
import {ProfileList} from "@/components/navbar/component/ProfileList";
import {StatusList} from "@/components/navbar/component/StatusList";
import {profileStatusConfig} from "@/types/ProfileStatus";

type UserProfile = {
    id: number;
    username: string;
    activeProfile: boolean;
};

interface Props {
    id?: number;
    firstName: string | undefined;
    lastName: string;
    isDropdownOpen: boolean;
    setIsDropdownOpen: (isOpen: boolean) => void;
    status: ProfileStatus;
    username?: string;
    email?: string;
}

function getProfileImageUrl(profileImageUrls: Record<string, string>, id?: number) {
    return profileImageUrls[`${id}-profile`] || '';
}

export function CustomDropDown({
                                   id,
                                   firstName,
                                   lastName,
                                   isDropdownOpen,
                                   setIsDropdownOpen,
                                   status,
                                   email
                               }:
                               Props
) {
    const [activeProfile, setActiveProfile] = useState<number | null>(null);
    const [activeStatus, setActiveStatus] = useState<ProfileStatus>(ProfileStatus.Offline);
    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
    const [isSwitching, setIsSwitching] = useState<'main' | 'profiles' | 'status'>('main');
    const {activeProfileInStorage, setActiveProfileInStorage, profileImageUrls} = useProfileContext();
    const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
    const {user} = useAuthContext();
    const userId = user?.userId as number;

    useEffect(() => {
        const active = userProfiles.find((profile) => profile.activeProfile);
        if (active) setActiveProfile(active.id);
    }, [userProfiles]);

    useEffect(() => {
        if (!userId || userProfiles.length > 0) return;
        fetchUserProfiles(userId).then(({ profiles }) => {
            setUserProfiles((prev) => {
                const prevIds = new Set(prev.map(p => p.id));
                const nextIds = new Set(profiles.map(p => p.id));
                return prevIds.size !== nextIds.size ? profiles : prev;
            });
        }).catch(() => {
            ShowToast('destructive', 'Erreur lors de la récupération des profils', 'Erreur');
        });
    }, [userId, userProfiles.length]);

    useEffect(() => {
        if (!id || activeStatus !== ProfileStatus.Offline) return;

        const currentStatus = status as ProfileStatus;
        const preserve = [ProfileStatus.DoNotDisturb, ProfileStatus.Away];

        if (!preserve.includes(currentStatus)) {
            void handleStatusProfileChange(id, ProfileStatus.Online);
            setActiveStatus(ProfileStatus.Online);
        } else {
            setActiveStatus(currentStatus);
        }
    }, [id, activeStatus, status]);

    const handleProfileChange = useCallback(async (profileId: number) => {
        if (!userId || !profileId) return;
        try {
            const profileData = await setActiveUserProfile(userId, profileId);
            setActiveProfileInStorage(profileData.data);
            setActiveProfile(profileData.data?.id);
            setUserProfiles(prev => prev.map(p => ({...p, activeProfile: p.id === profileId})));
            setIsDropdownOpen(false);
            ShowToast('default', 'Vous allez être redirigé vers votre autre profil');
        } catch {
            ShowToast('destructive', 'Erreur lors du changement de profil', 'Erreur');
        }
    }, [userId, setActiveProfileInStorage]);

    const handleStatusProfileChange = useCallback(async (profileId: number, status: string) => {
        if (!userId || !status) return;
        try {
            const { success } = await setUserProfileStatus(profileId, status);
            if (success) {
                setActiveStatus(status as ProfileStatus);
                setActiveProfileInStorage({ ...activeProfileInStorage, status }, false);
            }
        } catch {
            ShowToast('destructive', 'Erreur lors du changement de statut', 'Erreur');
        }
    }, [userId, setActiveProfileInStorage, activeProfileInStorage]);

    const currentValue = useMemo(() => {
        return isSwitching === 'profiles' ? (activeProfile?.toString() ?? '') : activeStatus;
    }, [isSwitching, activeProfile, activeStatus]);

    return (
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger
                onClick={toggleDropdown}
                aria-expanded={isDropdownOpen}
                aria-label="Menu de profil"
                tabIndex={0}
            >
                <div
                    className="flex items-center bg-secondary-black border-tertiary-black border-2 px-5 py-2 rounded-2xl cursor-pointer relative mr-4 hover:bg-tertiary-black transition-colors duration-300 ease-in-out">
                    <div className="relative">
                        <Avatar>
                            <AvatarImage
                                src={getProfileImageUrl(profileImageUrls, id)}
                                alt={firstName || 'Profile'}
                                className="object-cover object-center"
                            />
                            <AvatarFallback>
                                <User className="w-6 h-6 text-gray-500"/>
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute bottom-0 left-6 w-5 h-5 rounded-full border-2 border-tertiary-black flex items-center justify-center">
                            {status in profileStatusConfig ? profileStatusConfig[status].icon : null}
                        </div>
                    </div>
                    <span className="ml-2 text-text-white text-sm">
                        {truncateString(`${firstName} ${lastName}`, 15)}
                      </span>
                    <ChevronDown className="text-text-white ml-2"/>
                </div>
            </DropdownMenuTrigger>
                <DropdownMenuContent
                    className="overflow-hidden w-64 mt-2 bg-secondary-black border-tertiary-black shadow-xl mr-6">
                    <div
                        className="flex transition-transform duration-200 ease-in-out"
                        style={{
                            transform: isSwitching === 'status' ? 'translateX(-50%)' : isSwitching === 'profiles' ? 'translateX(-50%)' : 'translateX(0%)',
                            width: '200%'
                        }}
                    >
                        <div className="w-1/2 p-2 flex flex-col space-y-2">
                            <ProfileButton
                                profileId={id!}
                                email={email}
                                onClose={() => setIsDropdownOpen(false)}
                            />
                            <Button onClick={() => setIsSwitching('profiles')}
                                    className="flex justify-between w-full text-white bg-tertiary-black hover:bg-gray-700">
                                <div className="flex items-center">
                                    <UserPen className="mr-2 w-4"/>
                                    Changer de profil
                                </div>
                                <ChevronRight className="w-4"/>
                            </Button>
                            <Button onClick={() => setIsSwitching('status')}
                                    className="flex justify-between w-full text-white  bg-tertiary-black hover:bg-gray-700">
                                <div className="flex items-center space-x-2">
                          <span>
                            {{
                                online: "Actif",
                                do_not_disturb: "Ne pas déranger",
                                away: "Absent",
                                offline: "Hors ligne"
                            }[activeStatus]}
                          </span>
                                </div>
                                <ChevronRight className="w-4"/>
                            </Button>
                            <SettingsButton onClose={() => setIsDropdownOpen(false)}/>
                            <div className="my-2 border-t border-text-white opacity-30"/>
                            <LogoutButton onClose={() => setIsDropdownOpen(false)}/>
                        </div>
                        <div className="w-1/2 p-2 flex flex-col">
                            <div
                                className="text-xs text-gray-400 mb-1">{isSwitching === 'profiles' ? 'Changer de profil' : 'Changer de statut'}</div>
                            <RadioGroup
                                value={currentValue}
                                onValueChange={(val) => {
                                    if (isSwitching === 'profiles') {
                                        void handleProfileChange(parseInt(val));
                                    } else {
                                        activeProfile && handleStatusProfileChange(activeProfile, val);
                                    }
                                }}
                                className="space-y-2"
                            >
                                {isSwitching === 'profiles' ? (
                                    <ProfileList
                                        profiles={userProfiles}
                                        profileImageUrls={profileImageUrls}
                                        getProfileImageUrl={getProfileImageUrl}
                                    />
                                ) : (
                                    <StatusList activeStatus={activeStatus} />
                                )}
                            </RadioGroup>
                            <Button onClick={() => setIsSwitching('main')} className="flex text-white mt-2">
                                <ChevronLeft className="w-4 h-4"/> <span>Retour</span>
                            </Button>
                        </div>
                    </div>
                </DropdownMenuContent>
        </DropdownMenu>
    );
}