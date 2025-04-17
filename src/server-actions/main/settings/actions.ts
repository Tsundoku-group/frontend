'use server';

import {fetchWithAuth} from "@/services/fetchWithAuth";
import {Profile, ProfilePicture} from "@/models/Profile";

const symfonyUrl = process.env.SYMFONY_URL;

export async function fetchUserProfileData(profileId: number): Promise<Profile> {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/profile/${profileId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response || !response.data) {
            throw new Error('Invalid response from the server');
        }

        return response.data as Profile;
    } catch (error) {
        throw new Error('Failed to fetch user profile data');
    }
}

export async function updateUserProfileData(profileId: number, profileData: Partial<Profile>): Promise<Profile> {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/profile/${profileId}/edit`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(profileData),
        });

        if (!response || !response.data) {
            throw new Error('Invalid response from the server');
        }

        return response.data as Profile;
    } catch (error) {
        throw new Error('Failed to update user profile data');
    }
}

export async function fetchActiveProfilePictures(profileId: number): Promise<Record<string, ProfilePicture>> {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/profile/photo/${profileId}/active`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (404 === response.status) {
            return {};
        }

        if (!response.response || response.status !== 200) {
            throw new Error('Invalid response from the server');
        }

        return response.data as Record<string, ProfilePicture>;
    } catch (error) {
        throw new Error('Impossible de récupérer les photos actives.');
    }
}

export async function fetchUploadImageProfile(userId: number, profileId: number, imageUrl: string, type: string): Promise<ProfilePicture> {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/profile/photo/upload`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({id: userId, profileId: profileId, url: imageUrl, type})
        });

        if (!response.response || !response.data) {
            throw new Error('Invalid response from the server');
        }

        return response.data as ProfilePicture;
    } catch (error) {
        throw new Error('Failed to fetch upload image');
    }
}

export async function deleteUserProfilePictureUrl(id: number, profileId: number, url: string, type: string): Promise<{ response: boolean; status: number; data: any } | { response: boolean; status: number; message: string; error: any }> {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/profile/photo/remove`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({id, profileId, url, type})
        });

        if (!response.response || 200 !== response.status) {
            throw new Error('Invalid response from the server');
        }

        return response;
    } catch (error) {
        throw new Error('Failed to delete profile picture');
    }
}

export async function fetchVerifyPwd(currentPassword: string) {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/users/password/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({currentPassword})
        });

        if (!response.response) {
            throw new Error("Erreur lors de la vérification du mot de passe.");
        }

        return response;
    } catch (error) {
        throw error;
    }
}

export async function fetchUpdatePwd({ newPassword, captchaToken }: { newPassword: string; captchaToken: string }) {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/users/password/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                newPassword: newPassword,
                captchaToken: captchaToken,
            })
        });

        if (!response.response) {
            throw new Error("Erreur lors de la vérification du nouveau mot de passe.")
        }

        return response;
    } catch (error) {
        throw error;
    }
}

export async function fetchDeletePwd(userId: string) {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/users/${userId}/delete/request`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.response) {
            throw new Error("Erreur lors de la suppression du compte.")
        }

        return response;
    } catch (error) {
        throw error;
    }
}