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
        throw error;
    }
};

export const addNewUserProfile = async (payload: any) => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/profile/new`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
        console.log(response)
        if (!response.response || 201 !== response.status) {
            if (400 === response.status) {
                throw new Error (response?.message || 'Vous ne pouvez pas avoir plus de 5 profils');
            }
            throw new Error(response?.message || "Une erreur est survenue lors de la création du profil.");
        }

        return response;
    } catch (error) {
        console.error('Error adding new user profile:', error);
        throw error;
    }
};
