'use client'

import React, {useMemo, useState} from "react";
import {Bell, ChevronDown, ChevronLeft, ChevronRight, User, UserPen} from "lucide-react";
import {DropdownMenu, DropdownMenuContent, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import LogoutButton from "@/components/navigateButton/logoutButton";
import ProfileButton from "@/components/navigateButton/ProfileButton";
import SettingsButton from "@/components/navigateButton/SettingsButton";
import {useAuthContext} from "@/context/authContext";
import {Button} from "@/components/ui/button";
import {fetchUserProfiles, setActiveUserProfile} from "@/components/navbar/actions";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {truncateString} from "@/utils/string-utils";
import {ShowToast} from "@/components/ShowToast";
import AddProfileButton from "@/components/AddProfileButton";
import {useProfile} from "@/context/profileContext";

type UserProfile = {
    id: number;
    username: string;
    activeProfile: boolean;
};

function CustomDropDown(props: {
    dropdownContent: React.JSX.Element;
    firstName: string;
    lastName: string;
    isDropdownOpen: boolean;
    setIsDropdownOpen: (isOpen: boolean) => void;
}) {
    const { dropdownContent, firstName, lastName, isDropdownOpen, setIsDropdownOpen } = props;

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger onClick={toggleDropdown}>
                <div className="flex items-center bg-tertiary-black p-2 rounded-lg cursor-pointer">
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" alt="" />
                        <AvatarFallback>
                            <User className="w-6 h-6 text-gray-500" />
                        </AvatarFallback>
                    </Avatar>
                    <span className="ml-2 text-text-white">{truncateString(`${firstName} ${lastName}`, 15)}</span>
                    <ChevronDown className="text-text-white ml-2" />
                </div>
            </DropdownMenuTrigger>
            {isDropdownOpen && dropdownContent}
        </DropdownMenu>
    );
}

export default function Navbar() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSwitchingProfiles, setIsSwitchingProfiles] = useState(false);
    const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [activeProfile, setActiveProfile] = useState<string | null>(
        userProfiles.find((profile) => profile.activeProfile)?.id.toString() || null
    );

    const {user} = useAuthContext();
    const userId = user?.userId as number;
    const {activeProfileInStorage, setActiveProfileInStorage} = useProfile()

    const fetchProfiles = async () => {
        if (userProfiles.length > 0) return;

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

    const handleSwitchProfiles = async () => {
        if (!isSwitchingProfiles) {
            setIsSwitchingProfiles(true);
            await fetchProfiles();
        }
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
                            <AvatarImage src="https://github.com/shadcn.png" alt={profile.username}/>
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

    const dropdownContent = useMemo(() => {
        return (
            <DropdownMenuContent
                className="overflow-hidden w-64 relative mt-2 bg-tertiary-black border-tertiary-black flex flex-col items-center justify-center space-y-4">
                <div
                    className={`flex transition-transform duration-300 ease-in-out ${
                        isSwitchingProfiles ? "translate-x-[-100%]" : "translate-x-0"
                    }`}
                    style={{width: "100%"}}
                >
                    <div className="w-full p-2 flex flex-col justify-center space-y-2 flex-shrink-0">
                        <ProfileButton userId={userId} email={user?.email}/>
                        <Button
                            className="flex justify-between w-full text-white bg-transparent outline-none focus:outline-none hover:bg-hover-bg-color hover:bg-gray-700 hover:text-gray-200 transition-colors duration-200 rounded-lg"
                            onClick={handleSwitchProfiles}
                        >
                            <div className="flex items-center">
                                <UserPen className="mr-2 w-4"/>
                                Changer de profil
                            </div>
                            <ChevronRight className="w-4"/>
                        </Button>
                        <SettingsButton/>
                        <LogoutButton/>
                    </div>
                    <div className="w-full p-1 flex-shrink-0">
                        {loading ? (
                            <div className="text-center text-white">Chargement...</div>
                        ) : (
                            <>
                                <div className="text-xs text-gray-400 leading-tight tracking-tight mb-1 pb-1">
                                    Changer de profil
                                </div>
                                <RadioGroup
                                    value={activeProfile || ""}
                                    onValueChange={handleProfileChange}
                                    className="space-y-2"
                                >
                                    {profileItems}
                                </RadioGroup>
                                {userProfiles.length < 5 && <AddProfileButton/>}
                            </>
                        )}
                        <Button
                            className="flex space-x-2 text-left text-white w-full mt-2 bg-transparent outline-none focus:outline-none hover:bg-hover-bg-color"
                            onClick={() => setIsSwitchingProfiles(false)}
                        >
                            <ChevronLeft className="w-4 h-4"/>
                            <span>Retour</span>
                        </Button>
                    </div>
                </div>
            </DropdownMenuContent>
        );
    }, [isSwitchingProfiles, profileItems, activeProfile, loading, fetchProfiles]);

    return (
        <div className="h-16 flex justify-between items-center">
            <div className="text-text-white text-lg">
                Bienvenue, <span
                className="text-green-highlight">{activeProfileInStorage?.firstName}{activeProfileInStorage?.lastName}</span> !
            </div>
            <div className="flex items-center">
                <Bell className="text-text-white mr-4"/>
                <CustomDropDown
                    dropdownContent={dropdownContent}
                    firstName={activeProfileInStorage?.firstName || "Utilisateur"}
                    lastName={activeProfileInStorage?.lastName || ""}
                    isDropdownOpen={isDropdownOpen}
                    setIsDropdownOpen={setIsDropdownOpen}
                />
            </div>
        </div>
    );
};
