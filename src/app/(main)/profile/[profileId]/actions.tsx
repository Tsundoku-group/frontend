'use server'

import {fetchWithAuth} from "@/services/fetchWithAuth";
import {Profile, ProfileResult} from "@/models/Profile";

interface Friend {
    friendId: string;
    firstname: string;
    lastname: string;
    username: string;
}

interface Suggestion {
    friendId: string;
    firstname: string;
    lastname: string;
    username: string;
    commonFriendsCount: number;
}

interface Relation {
    friendshipId: string;
    friend: Friend;
}

const symfonyUrl = process.env.SYMFONY_URL;

export const fetchUserProfile = async (profileId: string): Promise<ProfileResult> => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/profile/${profileId}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        });

        if (!response.response) {
            return { error: "Impossible de récupérer le profil." };
        }

        if (404 === response.status) {
            return { error: "Profil introuvable." };
        }

        return { data: response.data as Profile };
    } catch (error) {
        throw error;
    }
}

export const fetchFriendsListFromProfile = async (profileId?: string, limit?: number, offset?: number): Promise<Relation[]> => {
    try {
        const response = await fetchWithAuth(
            `${symfonyUrl}/api/friendship/list/${profileId}?limit=${limit}&offset=${offset}`,
            {
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

        if (404 === response.status) {
            return {
                message: "Le profil du demandeur ou du destinataire n'a pas été trouvé.",
                status: "not found",
            }
        }

        if (409 === response.status) {
            if (response.data.includes('pending'))
                return {
                    message: "Demande d'amitié déjà envoyée. Statut : en attente.",
                    status: 'pending',
                };
            if (response.data.includes('rejected')) {
                return {
                    message: "La demande d'ami a été précédemment rejetée. Vous pouvez renvoyer la demande.",
                    status: 'rejected',
                };
            }

            if (response.data.includes('exists')) {
                return {
                    message: "Vous êtes déjà ami avec cet utilisateur",
                    status: 'exists',
                }
            }

            if (response.data.includes('request pending for you')) {
                return {
                    message: "Cet utilisateur vous a déjà envoyé une demande. Veuillez l'accepter dans vos demandes en attente.",
                    status: 'pendingForYou',
                }
            }
        }
        if (201 === response.status) {
            return {
                message: "Demande d'amitié envoyée avec succès.",
                status: 'success',
            };
        }
    } catch (error) {
        return {
            message: "Une erreur est survenue. Veillez réessayer plus tard.",
            status: 'error',
        };
    }
}

export const fetchRemoveFriend = async (friendshipId: string | null, profileId: string, friendId: string) => {
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

export const fetchFollowersListFromProfile = async (profileId?: string, limit?: number, offset?: number) => {
    try {
        const response = await fetchWithAuth(`
        ${symfonyUrl}/api/followers/${profileId}/followers?limit=${limit}&offset=${offset}`,
            {
                method: 'GET',
                headers: {'Content-Type': 'application/json'},
            })
        if (!response.response) {
            throw new Error('Failed to fetch followers');
        }

        return response.data.map((item: any) => ({
            friendshipId: item.friendshipId,
            friend: {
                friendId: item.follower.followerId,
                firstname: item.follower.followerFirstname,
                lastname: item.follower.followerLastname,
                username: item.follower.followerUsername,
            },
        })) as Relation[];
    } catch (error) {
        return [];
    }
}

export const fetchFollowedListFromProfile = async (profileId?: string, limit?: number, offset?: number) => {
    try {
        const response = await fetchWithAuth(
            `${symfonyUrl}/api/followers/${profileId}/followed?limit=${limit}&offset=${offset}`,
            {
                method: 'GET',
                headers: {'Content-Type': 'application/json'},
            })
        if (!response.response) {
            throw new Error('Failed to fetch followed');
        }

        return response.data.map((item: any) => ({
            friendshipId: item.friendshipId,
            friend: {
                friendId: item.following.followingId,
                firstname: item.following.followingFirstname,
                lastname: item.following.followingLastname,
                username: item.following.followingUsername,
            },
        })) as Relation[];
    } catch (error) {
        return [];
    }
}

export const fetchSuggestedFriendListFromProfile = async (profileId?: string, limit?: number, offset?: number) => {
    try {
        const response = await fetchWithAuth(
            `${symfonyUrl}/api/friendship/${profileId}/suggestions?limit=${limit}&offset=${offset}`,
            {
                method: 'GET',
                headers: {'Content-Type': 'application/json'},
            }
        );

        if (!response.response) {
            throw new Error('Failed to fetch friends suggestions');
        }

        return response.data.suggestions.map((item: any) => ({
            friendId: item.id,
            firstname: item.firstName,
            lastname: item.lastName,
            username: item.username,
            commonFriendsCount: item.commonFriendsCount,
        })) as Suggestion[];
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

export const fetchUnfollowProfile = async (friendshipId: string | null, profileId: string, friendId: string) => {
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
