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

export async function fetchActiveProfilePictureUrl(profileId: string): Promise<ProfilePicture> {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/profile-photo/get-active-photo/${profileId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        console.log('response :', response)
        if (!response.response || 200 !== response.status) {
            throw new Error('Invalid response from the server');
        }

        return response.data as ProfilePicture;
    } catch (error) {
        throw new Error('Failed to fetch active profile picture');
    }
}

export async function fetchUploadImageProfile(userId: number, profileId: string, imageUrl: string, type: string): Promise<ProfilePicture> {
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