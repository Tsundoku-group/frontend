'use server'

import { fetchWithAuth } from "@/services/fetchWithAuth";
import { Profile, ProfileResult } from "@/models/Profile";
import { symfonyUrl } from "@/constants/symfonyUrl";

interface Friend {
    friendId: number;
    firstname: string;
    lastname: string;
    username: string;
}

interface Suggestion {
    friendId: number;
    firstname: string;
    lastname: string;
    username: string;
    commonFriendsCount: number;
}

interface Relation {
    friendshipId: number;
    friend: Friend;
}

export const fetchUserProfile = async (profileId: number): Promise<ProfileResult> => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/profiles/${profileId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response?.response || response.status !== 200 || !response.data) {
            return { error: 'Impossible de récupérer le profil.' };
        }

        return { data: response.data as Profile };
    } catch (error: any) {
        return { error: error.message || 'Erreur serveur inconnue.' };
    }
};

export const fetchFriendsListFromProfile = async (profileId?: number, limit?: number, offset?: number): Promise<Relation[]> => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/friendships/${profileId}/list?limit=${limit}&offset=${offset}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response?.response || response.status !== 200 || !response.data) {
            return [];
        }

        return response.data as Relation[];
    } catch {
        return [];
    }
};

export const fetchAddProfileFriend = async (profileId: number, friendId: number) => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/friendships/${profileId}/request`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ friendId }),
        });

        if (!response?.response) {
            return {
                message: "Échec de l'envoi de la requête.",
                status: 'error',
            };
        }

        if (response.status === 404) {
            return {
                message: "Le profil du demandeur ou du destinataire n'a pas été trouvé.",
                status: 'not_found',
            };
        }

        if (response.status === 409 && typeof response.data === 'string') {
            const messageMap: Record<string, string> = {
                pending: "Demande d'amitié déjà envoyée. Statut : en attente.",
                rejected: "La demande d'ami a été précédemment rejetée. Vous pouvez renvoyer la demande.",
                exists: "Vous êtes déjà ami avec cet utilisateur.",
                "request pending for you": "Cet utilisateur vous a déjà envoyé une demande. Veuillez l'accepter dans vos demandes en attente.",
            };

            const match = Object.keys(messageMap).find((key) =>
                response.data.includes(key)
            );

            if (match) {
                return {
                    message: messageMap[match],
                    status: match,
                };
            }
        }

        if (response.status === 201) {
            return {
                message: "Demande d'amitié envoyée avec succès.",
                status: 'success',
            };
        }

        return {
            message: "Réponse inattendue du serveur.",
            status: 'error',
        };
    } catch (error: any) {
        return {
            message: error?.message || "Une erreur est survenue. Veuillez réessayer plus tard.",
            status: 'error',
        };
    }
};

export const fetchRemoveFriend = async (friendshipId: number | null, profileId: number, friendId: number) => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/friendships/${friendshipId}/remove`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ requesterId: profileId, receiverId: friendId }),
        });

        if (!response?.response || response.status !== 200) {
            return [];
        }

        return response;
    } catch {
        return [];
    }
};

export const fetchFollowersListFromProfile = async (profileId?: number, limit?: number, offset?: number): Promise<Relation[]> => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/followers/${profileId}/followers?limit=${limit}&offset=${offset}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response?.response || response.status !== 200 || !response.data) {
            return [];
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
    } catch {
        return [];
    }
};

export const fetchFollowedListFromProfile = async (profileId?: number, limit?: number, offset?: number): Promise<Relation[]> => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/followers/${profileId}/followed?limit=${limit}&offset=${offset}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response?.response || response.status !== 200 || !response.data) {
            return [];
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
    } catch {
        return [];
    }
};

export const fetchSuggestedFriendListFromProfile = async (profileId?: number, limit?: number, offset?: number): Promise<Suggestion[]> => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/friendships/${profileId}/suggestions?limit=${limit}&offset=${offset}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response?.response || response.status !== 200 || !response.data?.suggestions) {
            return [];
        }

        return response.data.suggestions.map((item: any) => ({
            friendId: item.id,
            firstname: item.firstName,
            lastname: item.lastName,
            username: item.username,
            commonFriendsCount: item.commonFriendsCount,
        })) as Suggestion[];
    } catch {
        return [];
    }
};

export const fetchFollowProfile = async (profileId: number, followingId: number) => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/followers/follow/${profileId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ followingId }),
        });

        if (!response?.response || response.status !== 200) {
            return [];
        }

        return response;
    } catch {
        return [];
    }
};

export const fetchUnfollowProfile = async (friendshipId: number | null, profileId: number, friendId: number) => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/followers/unfollow/${friendshipId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ followerId: profileId, followingId: friendId }),
        });

        if (!response?.response || response.status !== 200) {
            return [];
        }

        return response;
    } catch {
        return [];
    }
};
