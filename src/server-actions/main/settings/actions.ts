'use server';

import { fetchWithAuth } from "@/services/fetchWithAuth";
import { Profile, ProfilePicture } from "@/models/Profile";
import { symfonyUrl } from "@/constants/symfonyUrl";

export async function fetchUserProfileData(profileId: number): Promise<{
    data: Profile | null;
    success: boolean;
    message: string;
}> {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/profiles/${profileId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response || !response.data) {
            return { data: null, success: false, message: 'Invalid response from the server' };
        }

        return { data: response.data as Profile, success: true, message: 'OK' };
    } catch {
        return { data: null, success: false, message: 'Failed to fetch user profile data' };
    }
}

export async function updateUserProfileData(profileId: number, profileData: Partial<Profile>): Promise<{
    data: Profile | null;
    success: boolean;
    message: string;
}> {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/profiles/${profileId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(profileData),
        });

        if (!response || !response.data) {
            return { data: null, success: false, message: 'Invalid response from the server' };
        }

        return { data: response.data as Profile, success: true, message: 'OK' };
    } catch {
        return { data: null, success: false, message: 'Failed to update user profile data' };
    }
}

export async function fetchActiveProfilePictures(profileId: number): Promise<{
    data: Record<string, ProfilePicture>;
    success: boolean;
    message: string;
}> {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/profile/photo/${profileId}/active`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.status === 404) {
            return { data: {}, success: true, message: 'No images found' };
        }

        if (!response.response || response.status !== 200) {
            return { data: {}, success: false, message: 'Invalid response from the server' };
        }

        return { data: response.data as Record<string, ProfilePicture>, success: true, message: 'OK' };
    } catch {
        return { data: {}, success: false, message: 'Impossible de récupérer les photos actives.' };
    }
}

export async function fetchUploadImageProfile(userId: number, profileId: number, imageUrl: string, type: string): Promise<{
    data: ProfilePicture | null;
    success: boolean;
    message: string;
}> {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/profile/photo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: userId, profileId, url: imageUrl, type })
        });

        if (!response.response || !response.data) {
            return { data: null, success: false, message: 'Invalid response from the server' };
        }

        return { data: response.data as ProfilePicture, success: true, message: 'OK' };
    } catch {
        return { data: null, success: false, message: 'Failed to fetch upload image' };
    }
}

export async function deleteUserProfilePictureUrl(id: number, profileId: number, url: string, type: string): Promise<{
    success: boolean;
    status: number;
    message: string;
    data?: any;
    error?: any;
}> {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/profile/photo`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, profileId, url, type })
        });

        if (!response.response || response.status !== 200) {
            return { success: false, status: response.status, message: 'Invalid response from the server', error: response.data };
        }

        return { success: true, status: response.status, message: 'Deleted successfully', data: response.data };
    } catch (error) {
        return { success: false, status: 500, message: 'Failed to delete profile picture', error };
    }
}

export async function fetchVerifyPwd(currentPassword: string): Promise<{
    success: boolean;
    status: number;
    message: string;
}> {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/users/password/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ currentPassword })
        });

        if (!response.response) {
            return { success: false, status: response?.status || 500, message: 'Erreur lors de la vérification du mot de passe.' };
        }

        return { success: true, status: response.status, message: 'Mot de passe vérifié' };
    } catch (error) {
        return { success: false, status: 500, message: 'Erreur interne serveur' };
    }
}

export async function fetchUpdatePwd({ newPassword, captchaToken }: { newPassword: string; captchaToken: string }): Promise<{
    success: boolean;
    status: number;
    message: string;
}> {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/users/password/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ newPassword, captchaToken })
        });

        if (!response.response) {
            return { success: false, status: response?.status || 500, message: 'Erreur lors de la vérification du nouveau mot de passe.' };
        }

        return { success: true, status: response.status, message: 'Mot de passe mis à jour' };
    } catch {
        return { success: false, status: 500, message: 'Erreur interne' };
    }
}

export async function fetchDeletePwd(userId: string): Promise<{
    success: boolean;
    status: number;
    message: string;
}> {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/users/${userId}/delete/request`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.response) {
            return { success: false, status: response?.status || 500, message: 'Erreur lors de la suppression du compte.' };
        }

        return { success: true, status: response.status, message: 'Compte supprimé avec succès' };
    } catch {
        return { success: false, status: 500, message: 'Erreur serveur interne' };
    }
}
