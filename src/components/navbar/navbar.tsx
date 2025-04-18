'use client'

import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, User, UserPen } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import LogoutButton from '@/components/navigateButton/logoutButton';
import ProfileButton from '@/components/navigateButton/ProfileButton';
import SettingsButton from '@/components/navigateButton/SettingsButton';
import { useAuthContext } from '@/context/authContext';
import { Button } from '@/components/ui/button';
import { fetchUserProfiles, setActiveUserProfile, setUserProfileStatus } from '@/server-actions/navbar/actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { truncateString } from '@/utils/string-utils';
import { ShowToast } from '@/components/ShowToast';
import AddProfileButton from '@/components/AddProfileButton';
import { useProfileContext } from '@/context/profileContext';
import NotificationDropdown from '@/components/navbar/component/NotificationDropdown';
import Image from "next/image";

type UserProfile = {
    id: number;
    username: string;
    activeProfile: boolean;
};

function CustomDropDown(props: {
    dropdownContent: React.JSX.Element;
    firstName: string | undefined;
    lastName: string;
    isDropdownOpen: boolean;
    status: 'online' | 'do_not_disturb' | 'away' | 'offline';
    setIsDropdownOpen: (isOpen: boolean) => void;
}) {
    const { dropdownContent, firstName, lastName, status, isDropdownOpen, setIsDropdownOpen } = props;
    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
    const { profileImageUrls, activeProfileInStorage } = useProfileContext();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger onClick={toggleDropdown}>
                <div className="flex items-center bg-tertiary-black p-2 rounded-lg cursor-pointer relative">
                    <div className="relative">
                        <Avatar>
                            <AvatarImage
                                src={profileImageUrls[`${activeProfileInStorage?.id}-profile`] || ''}
                                alt={activeProfileInStorage?.username || 'Profile Image'}
                                className="object-cover object-center"
                            />
                            <AvatarFallback>
                                <User className="w-6 h-6 text-gray-500" />
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute bottom-0 left-6 w-5 h-5 rounded-full border-2 border-tertiary-black flex items-center justify-center">
                            {status === 'online' && <div className="w-full h-full rounded-full bg-green-500" />}
                            {status === 'do_not_disturb' && <Image src="/icons/status/minus-red-circle.svg" alt="Do not disturb" className="w-full h-full" />}
                            {status === 'away' && <Image src="/icons/status/yellow-moon.svg" alt="Away" className="w-full h-full" />}
                            {status === 'offline' && (
                                <div className="w-full h-full flex items-center justify-center bg-gray-500 rounded-full">
                                    <div className="w-2/4 h-2/4 bg-gray-900 rounded-full" />
                                </div>
                            )}
                        </div>
                    </div>
                    <span className="ml-2 text-text-white">{truncateString(`${firstName} ${lastName}`, 15)}</span>
                    <ChevronDown className="text-text-white ml-2" />
                </div>
            </DropdownMenuTrigger>
            {isDropdownOpen && dropdownContent}
        </DropdownMenu>
    );
}

export default function Navbar() {
    const [isSwitching, setIsSwitching] = useState<'main' | 'profiles' | 'status'>('main');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeProfile, setActiveProfile] = useState<number | null>(null);
    const [activeStatus, setActiveStatus] = useState('offline');
    const { user } = useAuthContext();
    const userId = user?.userId as number;
    const { activeProfileInStorage, setActiveProfileInStorage, profileImageUrls } = useProfileContext();

    useEffect(() => {
        const active = userProfiles.find((profile) => profile.activeProfile);
        if (active) setActiveProfile(active.id);
    }, [userProfiles]);

    useEffect(() => {
        if (!userId || userProfiles.length > 0) return;
        setLoading(true);
        fetchUserProfiles(userId).then((data) => {
            setUserProfiles(data.profiles);
            setLoading(false);
        }).catch(() => {
            ShowToast('destructive', 'Erreur lors de la récupération des profils', 'Erreur');
            setLoading(false);
        });
    }, [userId, userProfiles.length]);

    const handleProfileChange = async (profileId: number) => {
        if (!userId || !profileId) return;
        try {
            const profileData = await setActiveUserProfile(userId, profileId);
            setActiveProfileInStorage(profileData.data);
            setActiveProfile(profileData.data?.id);
            setUserProfiles(prev => prev.map(p => ({ ...p, activeProfile: p.id === profileId })));
            setIsDropdownOpen(false);
            ShowToast('default', 'Vous allez être redirigé vers votre autre profil');
        } catch {
            ShowToast('destructive', 'Erreur lors du changement de profil', 'Erreur');
        }
    };

    const handleStatusProfileChange = async (profileId: number, status: string) => {
        if (!userId || !status) return;
        try {
            const { success } = await setUserProfileStatus(profileId, status);
            if (success) {
                setActiveStatus(status);
                setActiveProfileInStorage({ ...activeProfileInStorage, status }, false);
            }
        } catch {
            ShowToast('destructive', 'Erreur lors du changement de statut', 'Erreur');
        }
    };

    const profileItems = useMemo(() => userProfiles.map((profile) => (
        <div key={profile.id} className={`flex items-center space-x-1 text-white w-full hover:bg-gray-700 p-1 rounded-lg transition ${profile.activeProfile ? 'bg-gray-800 border border-green-500' : ''}`}>
            <label htmlFor={`profile-${profile.id}`} className="flex items-center w-full cursor-pointer">
                <div className="relative">
                    <Avatar className="w-12 h-12">
                        <AvatarImage src={profileImageUrls[`${profile.id}-profile`] || ''} alt={activeProfileInStorage?.username || 'Profile Image'} />
                        <AvatarFallback><User className="w-6 h-6 text-gray-500" /></AvatarFallback>
                    </Avatar>
                    {profile.activeProfile && <div className="absolute top-9 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-gray-800"></div>}
                </div>
                <span className="text-sm ml-4">{truncateString(profile.username, 10)}</span>
            </label>
            <RadioGroupItem value={profile.id.toString()} id={`profile-${profile.id}`} className="h-5 w-5 border-gray-400 checked:bg-green-500" />
        </div>
    )), [userProfiles, profileImageUrls, activeProfileInStorage]);

    const statusItems = useMemo(() => {
        const statuses = ['online', 'do_not_disturb', 'away', 'offline'];
        const labels: Record<string, string> = {
            online: 'Actif',
            do_not_disturb: 'Ne pas déranger',
            away: 'Absent',
            offline: 'Hors ligne'
        };
        return statuses.map((status) => (
            <div key={status} className={`flex items-center p-2 text-white w-full hover:bg-gray-700 rounded-lg transition ${activeStatus === status ? 'bg-gray-800 border border-green-500' : ''}`}>
                <label htmlFor={`status-${status}`} className="flex items-center w-full cursor-pointer">
                    <div className="w-4 h-4 rounded-full flex items-center justify-center">
                        {status === 'online' && <div className="w-full h-full bg-green-500 rounded-full" />}
                        {status === 'do_not_disturb' && (
                            <Image
                                src="/icons/status/minus-red-circle.svg"
                                alt="Do not disturb"
                                width={20}
                                height={20}
                                className="w-full h-full"
                            />
                        )}
                        {status === 'away' && (
                            <Image
                                src="/icons/status/yellow-moon.svg"
                                alt="Away"
                                width={20}
                                height={20}
                                className="w-full h-full"
                            />
                        )}
                        {status === 'offline' && <div className="w-full h-full bg-gray-400 rounded-full flex items-center justify-center"><div className="w-2/4 h-2/4 bg-gray-900 rounded-full" /></div>}
                    </div>
                    <span className="ml-4">{labels[status]}</span>
                </label>
                <RadioGroupItem value={status} id={`status-${status}`} className="h-5 w-5 border-gray-400 checked:bg-green-500" />
            </div>
        ));
    }, [activeStatus]);

    const currentValue = isSwitching === 'profiles' ? (activeProfile?.toString() ?? '') : activeStatus;
    const items = isSwitching === 'profiles' ? profileItems : statusItems;

    const dropdownContent = (
        <DropdownMenuContent className="overflow-hidden w-64 mt-2 bg-tertiary-black border-tertiary-black">
            <div
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: isSwitching === 'status' ? 'translateX(-50%)' : isSwitching === 'profiles' ? 'translateX(-50%)' : 'translateX(0%)', width: '200%' }}
            >
                <div className="w-1/2 p-2 flex flex-col space-y-2">
                    <ProfileButton profileId={activeProfileInStorage?.id!} email={user?.email} onClose={() => setIsDropdownOpen(false)} />
                    <Button onClick={() => setIsSwitching('profiles')} className="flex justify-between w-full text-white hover:bg-gray-700">
                        <div className="flex items-center"><UserPen className="mr-2 w-4" />Changer de profil</div>
                        <ChevronRight className="w-4" />
                    </Button>
                    <Button onClick={() => setIsSwitching('status')} className="flex justify-between w-full text-white hover:bg-gray-700">
                        <div className="flex items-center space-x-2"><span className="capitalize">{activeStatus}</span></div>
                        <ChevronRight className="w-4" />
                    </Button>
                    <SettingsButton onClose={() => setIsDropdownOpen(false)} />
                    <LogoutButton onClose={() => setIsDropdownOpen(false)} />
                </div>
                <div className="w-1/2 p-2 flex flex-col">
                    <div className="text-xs text-gray-400 mb-1">{isSwitching === 'profiles' ? 'Changer de profil' : 'Changer de statut'}</div>
                    <RadioGroup value={currentValue} onValueChange={(val) => {
                        if (isSwitching === 'profiles') {
                            void handleProfileChange(parseInt(val));
                        } else {
                            activeProfile && handleStatusProfileChange(activeProfile, val);
                        }
                    }} className="space-y-2">
                        {items}
                    </RadioGroup>
                    {isSwitching === 'profiles' && userProfiles.length < 5 && loading && (
                        <AddProfileButton
                            onProfileAdded={async () => {
                                const result = await fetchUserProfiles(userId);
                                if (result.success) {
                                    setUserProfiles(result.profiles);
                                } else {
                                    ShowToast('destructive', result.message, 'Erreur');
                                }
                            }}
                            onClose={() => setIsDropdownOpen(false)}
                        />
                    )}
                    <Button onClick={() => setIsSwitching('main')} className="flex text-white mt-2">
                        <ChevronLeft className="w-4 h-4" /> <span>Retour</span>
                    </Button>
                </div>
            </div>
        </DropdownMenuContent>
    );

    return (
        <div className="h-16 flex justify-between items-center">
            <div className="text-text-white text-lg">
                Bienvenue, <span className="text-green-highlight">{activeProfileInStorage?.firstName && activeProfileInStorage?.lastName ? `${activeProfileInStorage.firstName} ${activeProfileInStorage.lastName}` : activeProfileInStorage?.username}</span> !
            </div>
            <div className="flex items-center">
                <div className="flex mr-6">
                    <NotificationDropdown />
                </div>
                <CustomDropDown
                    dropdownContent={dropdownContent}
                    firstName={activeProfileInStorage?.firstName || activeProfileInStorage?.username}
                    lastName={activeProfileInStorage?.lastName || ''}
                    isDropdownOpen={isDropdownOpen}
                    setIsDropdownOpen={setIsDropdownOpen}
                    status={activeStatus as 'online' | 'do_not_disturb' | 'away' | 'offline'}
                />
            </div>
        </div>
    );
}