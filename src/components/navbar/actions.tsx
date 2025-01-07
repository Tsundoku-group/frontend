'use server'

import {fetchWithAuth} from "@/services/fetchWithAuth";

const symfonyUrl = process.env.SYMFONY_URL;

export const fetchUserProfiles = async (userId: number) => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/profile/all/${userId}`, {
            method: 'GET',
        });

        if (!response.response || 200 !== response.status) {
            throw new Error('Failed to fetch profiles');
        }

        const {profiles} = response.data;

        if (Array.isArray(profiles)) {
            return profiles;
        } else {
            return [];
        }
    } catch (error) {
        throw error;
    }
};

export const setUserProfileStatus = async (profileId: string, status: string) => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/profile/update-status/${profileId}`, {
            method: 'PUT',
            body: JSON.stringify({
                status: status,
            })
        });

        if (!response.response || 200 !== response.status) {
            throw new Error(response.message);
        }

        return {success: true};
    } catch (error) {
        throw error;
    }
}

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

        if (!response.response || 201 !== response.status || !response.data) {
            if (400 === response.status) {
                throw new Error(response?.message || 'Vous ne pouvez pas avoir plus de 5 profils');
            }
            throw new Error(response?.message || "Une erreur est survenue lors de la création du profil.");
        }

        return response.data;
    } catch (error) {
        throw error;
    }
};
