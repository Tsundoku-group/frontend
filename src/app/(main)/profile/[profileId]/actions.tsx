'use server'

import {fetchWithAuth} from "@/services/fetchWithAuth";
import {Profile} from "@/models/Profile";

const symfonyUrl = process.env.SYMFONY_URL;

export const fetchUserProfile = async (profileId: number): Promise<Profile> => {
    const response = await fetchWithAuth(`${symfonyUrl}/api/profile/${profileId}`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    });

    if (!response.response) {
        throw new Error('Failed to fetch profile');
    }

    return response.data as Profile;
};