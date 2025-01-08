'use server';

import {fetchWithAuth} from "@/services/fetchWithAuth";
import {Profile, ProfilePicture} from "@/models/Profile";

const symfonyUrl = process.env.SYMFONY_URL;

export async function fetchUserProfileData(profileId: string): Promise<Profile> {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/profile/${profileId}`, {
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

export async function updateUserProfileData(profileId: string, profileData: Partial<Profile>): Promise<Profile> {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/profile/${profileId}/edit`, {
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

export async function fetchActiveProfilePictures(profileId: string): Promise<Record<string, ProfilePicture>> {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/profile-photo/get-active-photo/${profileId}`,
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

export async function fetchUploadImageProfile(userId: string, profileId: string, imageUrl: string, type: string): Promise<ProfilePicture> {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/profile-photo/add-photo`, {
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

export async function deleteUserProfilePictureUrl(id: string, profileId: string, url: string, type: string): Promise<{ response: boolean; status: number; data: any } | { response: boolean; status: number; message: string; error: any }> {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/profile-photo/remove-photo`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({id, profileId, url, type})
        });
        console.log(response);
        if (!response.response || 200 !== response.status) {
            throw new Error('Invalid response from the server');
        }

        return response;
    } catch (error) {
        throw new Error('Failed to delete profile picture');
    }
}
