'use client'

import React, {useEffect, useMemo, useState} from "react";
import {Bell, ChevronDown, ChevronLeft, ChevronRight, User, UserPen} from "lucide-react";
import {DropdownMenu, DropdownMenuContent, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import LogoutButton from "@/components/navigateButton/logoutButton";
import ProfileButton from "@/components/navigateButton/ProfileButton";
import SettingsButton from "@/components/navigateButton/SettingsButton";
import {useAuthContext} from "@/context/authContext";
import {Button} from "@/components/ui/button";
import {fetchUserProfiles, setActiveUserProfile, setUserProfileStatus} from "@/components/navbar/actions";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {truncateString} from "@/utils/string-utils";
import {ShowToast} from "@/components/ShowToast";
import AddProfileButton from "@/components/AddProfileButton";
import {useProfileContext} from "@/context/profileContext";

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
    const {dropdownContent, firstName, lastName, status, isDropdownOpen, setIsDropdownOpen} = props;
    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
    const {profileImageUrls, activeProfileInStorage} = useProfileContext();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger onClick={toggleDropdown}>
                <div className="flex items-center bg-tertiary-black p-2 rounded-lg cursor-pointer relative">
                    <div className="relative">
                        <Avatar>
                            <AvatarImage
                                src={profileImageUrls[`${activeProfileInStorage?.id}-profile`] || ''}
                                alt={activeProfileInStorage?.username || "Profile Image"}
                                className="object-cover object-center"
                            />
                            <AvatarFallback>
                                <User className="w-6 h-6 text-gray-500"/>
                            </AvatarFallback>
                        </Avatar>
                        <div
                            className="absolute bottom-0 left-6 w-5 h-5 rounded-full border-2 border-tertiary-black flex items-center justify-center">
                            {status === "online" && (
                                <div className="w-full h-full rounded-full bg-green-500"/>
                            )}
                            {status === "do_not_disturb" && (
                                <img
                                    src="/icons/status/minus-red-circle.svg"
                                    alt="Do not disturb"
                                    className="w-full h-full"
                                />
                            )}
                            {status === "away" && (
                                <img
                                    src="/icons/status/yellow-moon.svg"
                                    alt="Away"
                                    className="w-full h-full"
                                />
                            )}
                            {status === "offline" && (
                                <div
                                    className="w-full h-full flex items-center justify-center bg-gray-500 rounded-full"
                                >
                                    <div className="w-2/4 h-2/4 bg-gray-900 rounded-full"/>
                                </div>
                            )}
                        </div>
                    </div>
                    <span className="ml-2 text-text-white">{truncateString(`${firstName} ${lastName}`, 15)}</span>
                    <ChevronDown className="text-text-white ml-2"/>
                </div>
            </DropdownMenuTrigger>
            {isDropdownOpen && dropdownContent}
        </DropdownMenu>
    );
}

export default function Navbar() {
    const [isSwitching, setIsSwitching] = useState<"profiles" | "status" | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [activeProfile, setActiveProfile] = useState<string | null>(
        userProfiles.find((profile) => profile.activeProfile)?.id.toString() || null
    );
    const [activeStatus, setActiveStatus] = useState('offline');
    const [visibleItems, setVisibleItems] = useState<"profiles" | "status">("profiles");

    const {user} = useAuthContext();
    const userId = user?.userId as number;
    const {activeProfileInStorage, setActiveProfileInStorage, profileImageUrls} = useProfileContext()

    const fetchProfiles = async () => {
        if (!userId || userProfiles.length > 0) return;

        setLoading(true);
        try {
            const data = await fetchUserProfiles(userId);
            setUserProfiles(data);
        } catch (error) {
            ShowToast('destructive', 'Erreur lors de la récupération des profils', 'Erreur');
        } finally {
            setLoading(false);
        }
    };

    const handleProfileChange = async (profileId: string) => {
        try {
            if (!userId || !profileId) return;

            const profileData = await setActiveUserProfile(userId, profileId);
            setActiveProfileInStorage(profileData);
            setActiveProfile(profileData);
            setUserProfiles((prevProfiles) =>
                prevProfiles.map((profile) => ({
                    ...profile,
                    activeProfile: profile.id.toString() === profileId,
                }))
            );

            setIsDropdownOpen(false);
            ShowToast('default', 'Vous allez être redirigé vers votre autre profil');
        } catch (error) {
            ShowToast('destructive', 'Erreur lors du changement de profil', 'Erreur');
        }
    };

    useEffect(() => {
        fetchProfiles();
    }, []);

    const handleStatusProfileChange = async (profileId: string, status: string) => {
        try {
            if (!userId || !status) return;

            const {success} = await setUserProfileStatus(profileId, status);

            if (success) {
                setActiveStatus(status);
                setActiveProfileInStorage({
                    ...activeProfileInStorage,
                    status: status,
                }, false);
            }
        } catch (error) {
            ShowToast('destructive', 'Erreur lors du changement de statut', 'Erreur');
        }
    }

    const handleSwitch = async (value: string, type: "profiles" | "status") => {
        if (isSwitching === type) {
            return;
        }

        setIsSwitching(type);
        setTimeout(() => {
            setVisibleItems(type);
        }, 20);
        setLoading(true);

        if (type === "profiles" && userProfiles.length === 0) {
            await fetchProfiles()
        }

        setLoading(false);
    };

    const profileItems = useMemo(() => {
        return userProfiles.map((profile) => (
            <div
                key={profile.id}
                className={`flex items-center space-x-1 text-white w-full hover:bg-gray-700 p-1 rounded-lg transition ease-in delay-100 ${
                    profile.activeProfile ? "bg-gray-800 border border-green-500" : ""
                }`}
            >
                <label htmlFor={`profile-${profile.id}`} className="flex items-center w-full cursor-pointer relative">
                    <div className="relative">
                        <Avatar className="w-12 h-12">
                            <AvatarImage
                                src={profileImageUrls[`${profile.id}-profile`] || ''}
                                alt={activeProfileInStorage?.username || "Profile Image"}
                                className="object-cover object-center"
                            />
                            <AvatarFallback>
                                <User className="w-6 h-6 text-gray-500"/>
                            </AvatarFallback>
                        </Avatar>
                        {profile.activeProfile && (
                            <div
                                className="absolute top-9 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-gray-800"></div>
                        )}
                    </div>
                    <span className="text-sm ml-4">{truncateString(profile.username, 10)}</span>
                </label>
                <RadioGroupItem
                    value={profile.id.toString()}
                    id={`profile-${profile.id}`}
                    className="h-5 w-5 border-gray-400 checked:bg-green-500"
                />
            </div>
        ));
    }, [userProfiles]);

    const statusItems = useMemo(() => {
        const statuses = ["online", "do_not_disturb", "away", "offline"];
        const statusTranslations: Record<string, string> = {
            online: "Actif",
            do_not_disturb: "Ne pas déranger",
            away: "Absent",
            offline: "Hors ligne",
        };

        return statuses.map((status) => (
            <div
                key={status}
                className={`flex items-center p-2 text-white w-full hover:bg-gray-700 rounded-lg transition ease-in delay-100 ${
                    activeStatus === status ? "bg-gray-800 border border-green-500" : ""
                }`}
                onClick={() => handleStatusProfileChange(activeProfileInStorage?.id as string, status)}
            >
                <label htmlFor="status" className="flex items-center w-full cursor-pointer relative">
                    <div className="w-4 h-4 rounded-full flex items-center justify-center">
                        {status === "online" && <div className="w-full h-full bg-green-500 rounded-full"/>}
                        {status === "do_not_disturb" && (
                            <img
                                src="/icons/status/minus-red-circle.svg"
                                alt="Do not disturb"
                                className="w-full h-full"
                            />
                        )}
                        {status === "away" && (
                            <img
                                src="/icons/status/yellow-moon.svg"
                                alt="Away"
                                className="w-full h-full"
                            />
                        )}
                        {status === "offline" && (
                            <div className="w-full h-full bg-gray-400 rounded-full flex items-center justify-center">
                                <div className="w-2/4 h-2/4 bg-gray-900 rounded-full"/>
                            </div>
                        )}
                    </div>
                    <span className="ml-4">
                        {statusTranslations[status] || "Statut inconnu"}
                    </span>
                </label>
                <RadioGroupItem
                    value={status}
                    id={`status-${status}`}
                    className="h-5 w-5 border-gray-400 checked:bg-green-500"
                />
            </div>
        ));
    }, [activeStatus, activeProfile, handleStatusProfileChange]);

    const handleProfileAdded = () => {
        fetchProfiles();
    }

    const dropdownContent = useMemo(() => {
        const items = visibleItems === "profiles" ? profileItems : statusItems;
        const currentValue = visibleItems === "profiles" ? activeProfile || "" : activeStatus || "";
        const profileId = activeProfileInStorage?.id || "";

        return (
            <DropdownMenuContent
                className="overflow-hidden w-64 relative mt-2 bg-tertiary-black border-tertiary-black flex flex-col items-center justify-center space-y-4"
            >
                <div
                    className={`flex transition-transform duration-300 ease-in-out ${
                        isSwitching ? "translate-x-[-100%]" : "translate-x-0"
                    }`}
                    style={{width: "100%"}}
                >
                    <div className="w-full p-2 flex flex-col justify-center space-y-2 flex-shrink-0">
                        <ProfileButton profileId={profileId} email={user?.email}
                                       onClose={() => setIsDropdownOpen(false)}/>
                        <Button
                            className="flex justify-between w-full text-white bg-transparent outline-none focus:outline-none hover:bg-hover-bg-color hover:bg-gray-700 hover:text-gray-200 transition-colors duration-200 rounded-lg"
                            onClick={() => handleSwitch("", "profiles")}
                        >
                            <div className="flex items-center">
                                <UserPen className="mr-2 w-4"/>
                                Changer de profil
                            </div>
                            <ChevronRight className="w-4"/>
                        </Button>
                        <Button
                            className="flex justify-between w-full text-white bg-transparent outline-none focus:outline-none hover:bg-hover-bg-color hover:bg-gray-700 hover:text-gray-200 transition-colors duration-200 rounded-lg"
                            onClick={() => handleSwitch("", "status")}
                        >
                            <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 rounded-full flex items-center justify-center">
                                    {activeStatus === "online" &&
                                        <div className="w-full h-full bg-green-500 rounded-full"></div>}
                                    {activeStatus === "do_not_disturb" &&
                                        <img src="/icons/status/minus-red-circle.svg" alt="Do not disturb"
                                             className="w-full h-full"/>}
                                    {activeStatus === "away" &&
                                        <img src="/icons/status/yellow-moon.svg" alt="Away" className="w-full h-full"/>}
                                    {activeStatus === "offline" && (
                                        <div
                                            className="w-full h-full bg-gray-400 rounded-full flex items-center justify-center">
                                            <div className="w-2/3 h-2/3 bg-black rounded-full"></div>
                                        </div>
                                    )}
                                </div>
                                <span className="capitalize">
                                    {activeStatus === "online" && "Actif"}
                                    {activeStatus === "do_not_disturb" && "Ne pas déranger"}
                                    {activeStatus === "away" && "Absent"}
                                    {activeStatus === "offline" && "Hors ligne"}
                                </span>
                            </div>
                            <ChevronRight className="w-4"/>
                        </Button>
                        <SettingsButton onClose={() => setIsDropdownOpen(false)}/>
                        <LogoutButton onClose={() => setIsDropdownOpen(false)}/>
                    </div>
                    <div className="w-full p-1 flex-shrink-0">
                        {loading ? (
                            <div className="text-center text-white">Chargement...</div>
                        ) : (
                            <>
                                <div className="text-xs text-gray-400 leading-tight tracking-tight mb-1 pb-1">
                                    {visibleItems === "profiles" ? "Changer de profil" : "Changer de statut"}
                                </div>
                                <RadioGroup
                                    value={currentValue}
                                    onValueChange={(value) => {
                                        if (visibleItems === "profiles") {
                                            handleProfileChange(value);
                                        } else if (visibleItems === "status") {
                                            if (activeProfile) {
                                                handleStatusProfileChange(activeProfile, value);
                                            }
                                        }
                                    }}
                                    className="space-y-2"
                                >
                                    {items}
                                </RadioGroup>
                                {visibleItems === "profiles" && userProfiles.length < 5 &&
                                    <AddProfileButton onProfileAdded={handleProfileAdded}
                                                      onClose={() => setIsDropdownOpen(false)}/>}
                            </>
                        )}
                        <Button
                            className="flex space-x-2 text-left text-white w-full mt-2 bg-transparent outline-none focus:outline-none hover:bg-hover-bg-color"
                            onClick={() => setIsSwitching(null)}
                        >
                            <ChevronLeft className="w-4 h-4"/>
                            <span>Retour</span>
                        </Button>
                    </div>
                </div>
            </DropdownMenuContent>
        );
    }, [activeProfileInStorage?.id, visibleItems, profileItems, statusItems, activeProfile, activeStatus, isSwitching, user?.email, loading, userProfiles.length, handleSwitch, handleProfileChange, handleStatusProfileChange]);

    useEffect(() => {
        if (activeProfileInStorage) {
            setActiveStatus(activeProfileInStorage.status || "offline");
        }
    }, [activeProfileInStorage]);

    return (
        <div className="h-16 flex justify-between items-center">
            <div className="text-text-white text-lg">
                Bienvenue, <span className="text-green-highlight">
                {activeProfileInStorage?.firstName && activeProfileInStorage?.lastName
                    ? `${activeProfileInStorage.firstName} ${activeProfileInStorage.lastName}`
                    : activeProfileInStorage?.username}
            </span> !
            </div>
            <div className="flex items-center">
                <Bell className="text-text-white mr-4"/>
                <CustomDropDown
                    dropdownContent={dropdownContent}
                    firstName={activeProfileInStorage?.firstName || activeProfileInStorage?.username}
                    lastName={activeProfileInStorage?.lastName || ""}
                    isDropdownOpen={isDropdownOpen}
                    setIsDropdownOpen={setIsDropdownOpen}
                    status={activeStatus as 'online' | 'do_not_disturb' | 'away' | 'offline'}
                />
            </div>
        </div>
    );
};
