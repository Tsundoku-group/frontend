'use server'

import {fetchWithAuth} from "@/services/fetchWithAuth";

const symfonyUrl = process.env.SYMFONY_URL;

export const fetchUserProfiles = async (userId: number) => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/profile/all/${userId}`, {
            method: 'GET',
        });

        if (!response.response || response.status !== 200) {
            throw new Error('Failed to fetch profiles');
        }

        const { profiles } = response.data;

        if (Array.isArray(profiles)) {
            return profiles;
        } else {
            return [];
        }
    } catch (error) {

        throw error;
    }
};

export const setActiveUserProfile = async (id: number, profileId: string) => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/profile/set-active`, {
            method: 'POST',
            body: JSON.stringify({
                id,
                profileId,
            })
        });

        if (!response.response || 200 !== response.status) {
            throw new Error(response?.message || "Impossible de définir le profil actif.");
        }

        return response.data;
    } catch (error) {
        console.error('Error setting active user profiles:', error);
        throw error;
    }
};
