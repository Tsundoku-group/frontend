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

export const fetchAddProfileFriend = async (profileId: string, friendId: string) => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/friendship/request/${profileId}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({friendId: friendId})
        });

        if (!response.response) {
            throw new Error('Failed to fetch profile');
        }

        return response;
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

export const fetchFollowersListFromProfile = async (profileId: string) => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/followers/${profileId}/followers`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        })
        if(!response.response) {
            throw new Error('Failed to fetch followers');
        }

        return response.data.map((item: any) => ({
            friendshipId: item.friendshipId,
            friend: {
                friendId: item.followerId,
                firstname: item.following.followingFirstname,
                lastname: item.following.followingLastname,
                username: item.following.followingUsername,
            },
        })) as Relation[];
    } catch (error) {
        return [];
    }
}

export const fetchFollowedListFromProfile = async (profileId: string) => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/followers/${profileId}/followed`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        })
        if (!response.response) {
            throw new Error('Failed to fetch followed');
        }

        return response.data.map((item: any) => ({
            friendshipId: item.friendshipId,
            friend: {
                friendId: item.followerId,
                firstname: item.following.followingFirstname,
                lastname: item.following.followingLastname,
                username: item.following.followingUsername,
            },
        })) as Relation[];
    } catch (error) {
        return [];
    }
}

export const fetchFollowProfile = async (profileId: string, followingId: string) => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/followers/follow/${profileId}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({'followingId': followingId}),
        })

        if (!response.response) {
            throw new Error('Failed to fetch profile');
        }

        return response;
    } catch (error) {
        return [];
    }
}

export const fetchUnfollowProfile = async (friendshipId: string, profileId: string, friendId: string) => {
    {
        try {
            const response = await fetchWithAuth(`${symfonyUrl}/api/followers/unfollow/${friendshipId}`, {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({'followerId': profileId, 'followingId': friendId}),
            })

            if (!response.response) {
                throw new Error('Failed to fetch unfollow profile');
            }
            
            return response;
        } catch (error) {
            return [];
        }
    }
}