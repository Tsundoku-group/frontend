'use server'

import {fetchWithAuth} from "@/services/fetchWithAuth";

const symfonyUrl = process.env.SYMFONY_URL;

export const fetchUserProfiles = async (userId: number) => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/profile/${userId}/all`, {
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

export const setUserProfileStatus = async (profileId: number, status: string) => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/profile/${profileId}/update/status`, {
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

export const setActiveUserProfile = async (id: number, profileId: number) => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/profile/active`, {
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
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/profile/new`, {
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

export const fetchNotifications = async (profileId: number) => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/notification/${profileId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.response || 200 !== response.status) {
            throw new Error(response?.message);
        }

        const data = response?.data?.notifications;

        if (Array.isArray(data)) {
            return data;
        }
    } catch (error) {
        throw error;
    }
};

export const markAsReadNotifications = async (profileId: number) => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/notification/${profileId}/read`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.response || 200 !== response.status) {
            throw new Error(response?.message);
        }

        return response;
    } catch (error) {
        throw error;
    }
}
