'use client'

import React, {useEffect, useState} from 'react';
import {useAuthContext} from '@/context/authContext';
import {useProfileContext} from '@/context/profileContext';
import NotificationDropdown from '@/components/navbar/component/NotificationDropdown';
import {CustomDropDown} from '@/components/navbar/component/CustomDropDown';
import {ProfileStatus} from '@/types/ProfileStatus';

export default function Navbar() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isNavbarVisible, setIsNavbarVisible] = useState(true);
    const [hasScrolled, setHasScrolled] = useState(false);

    const {user} = useAuthContext();
    const {activeProfileInStorage} = useProfileContext();

    useEffect(() => {
        const handleScroll = () => {
            const nearTop = window.scrollY <= 100;
            setHasScrolled(!nearTop);
            setIsNavbarVisible(nearTop);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            {hasScrolled && (
                <div
                    onMouseEnter={() => setIsNavbarVisible(true)}
                    className="fixed top-0 right-0 w-[calc(100%-16.66%)] h-4 z-50"
                />
            )}

            <div
                className={`fixed top-0 right-0 w-[calc(100%-14%)] transition-transform duration-300 z-40 px-12 ${
                    isNavbarVisible ? 'translate-y-0' : '-translate-y-full'
                } ${hasScrolled ? 'bg-secondary-black/90 backdrop-blur-sm shadow-md' : 'bg-transparent'}`}
                onMouseLeave={() => {
                    if (hasScrolled && !isDropdownOpen) {
                        setIsNavbarVisible(false);
                    }
                }}
            >
                <div className="h-28 flex justify-between items-center">
                    <div className="cursor-default text-text-white text-xl font-extralight ml-12">
                        Bienvenue,{' '}
                        <span className="text-green-highlight">
                          {activeProfileInStorage?.firstName && activeProfileInStorage?.lastName
                              ? `${activeProfileInStorage.firstName} ${activeProfileInStorage.lastName}`
                              : activeProfileInStorage?.username}
                        </span>{' '}
                        !
                    </div>

                    <div className="flex items-center">
                        <div className="flex mr-4">
                            <NotificationDropdown/>
                        </div>
                        <CustomDropDown
                            id={activeProfileInStorage?.id}
                            firstName={activeProfileInStorage?.firstName || activeProfileInStorage?.username}
                            lastName={activeProfileInStorage?.lastName || ''}
                            isDropdownOpen={isDropdownOpen}
                            setIsDropdownOpen={setIsDropdownOpen}
                            status={activeProfileInStorage?.status as ProfileStatus}
                            username={activeProfileInStorage?.username}
                            email={user?.email}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}