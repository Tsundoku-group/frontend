'use server'

import {fetchWithAuth} from "@/services/fetchWithAuth";
import {Profile} from "@/models/Profile";

interface Friend {
    friendId: string;
    firstname: string;
    lastname: string;
    username: string;
}

interface Relation {
    friendshipId: string;
    friend: Friend;
}

const symfonyUrl = process.env.SYMFONY_URL;

export const fetchUserProfile = async (profileId: string): Promise<Profile> => {
    const response = await fetchWithAuth(`${symfonyUrl}/api/profile/${profileId}`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    });

    if (!response.response) {
        throw new Error('Failed to fetch profile');
    }

    return response.data as Profile;
}

export const fetchFriendsListFromProfile = async (profileId: string): Promise<Relation[]> => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/friendship/list/${profileId}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        });

        if (!response.response) {
            throw new Error('Failed to fetch profile');
        }

        return response.data as Relation[];
    } catch (error) {
        return [];
    }
}

export const fetchRemoveFriend = async (friendshipId: string, profileId: string, friendId: string) => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/friendship/remove/${friendshipId}`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({'requesterId': profileId, 'receiverId': friendId}),
        });

        if (!response.response) {
            throw new Error('Failed to fetch friendship');
        }

        return response;
    } catch (error) {
        return [];
    }
}
