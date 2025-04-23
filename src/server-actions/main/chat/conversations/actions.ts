'use server';

import {fetchWithAuth} from "@/services/fetchWithAuth";
import {ChatConversation, ChatParticipant} from "@/models/ChatConversation";
import { symfonyUrl } from "@/constants/symfonyUrl";

export const fetchUserConversations = async (profileId: number): Promise<ChatConversation[]> => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/conversations/${profileId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = response.data;

        if (data && data.conversations && typeof data.conversations === 'object') {
            const conversationsArray = Object.values(data.conversations);
            return conversationsArray as ChatConversation[];
        } else {
            return [];
        }
    } catch (error) {
        return [];
    }
};

export const fetchOneConversationById = async (
    conversationId: number
): Promise<ChatParticipant[]> => {
    try {
        const response = await fetchWithAuth(
            `${symfonyUrl}/api/v1/conversations/${conversationId}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        const data = response.data;

        if (data?.participants && Array.isArray(data.participants)) {
            return data.participants.map((participant: any): ChatParticipant => ({
                id: participant.id,
                username: participant.username,
                imageUrl: participant.imageUrl ?? null,
            }));
        }

        return [];
    } catch (error) {
        return [];
    }
};

export const fetchMessagesFromConversationId = async (conversationId: number, page = 1, limit = 20) => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/messages/${conversationId}?page=${page}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const messages = response.data;

        return Array.isArray(messages) ? messages : [];
    } catch (error) {
        console.error("Erreur lors du fetch des messages :", error);
        return [];
    }
};

export const sendMessage = async (payload: any, conversationId: number) => {
    try {
        return await fetchWithAuth(`${symfonyUrl}/api/v1/messages/${conversationId}/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
    } catch (error) {
        throw error;
    }
};

export const fetchMarkMessagesAsRead = async (conversationId: number, profileId: number) => {
    try {
        return await fetchWithAuth(`${symfonyUrl}/api/v1/messages/${conversationId}/mark/read`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({profileId: profileId}),
        });
    } catch (error) {
        throw error;
    }
};

export const startNewConversation = async (username: string, friendId: number) => {
    const body = {
        participants: [friendId],
        username: username
    };

    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/conversations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (409 === response.status) {
            return {
                success: false,
                error: "La conversations existe déjà.",
            };
        }

        return {
            success: true,
            conversationId: response.data.conversationId,
        };
    } catch (error) {
        return {
            success: false,
            error: "Erreur inconnue. Veuillez réessayer plus tard.",
        };
    }
};

export const handleDeleteConversation = async (conversationId: number) => {
    try {
        return await fetchWithAuth(`${symfonyUrl}/api/v1/conversations/${conversationId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        throw error;
    }
};

export const handleArchiveConversation = async (conversationId: number) => {
    try {
        return await fetchWithAuth(`${symfonyUrl}/api/v1/conversations/${conversationId}/archive`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        throw error;
    }
};

export const handleMuteConversationDuration = async (conversationId: number, duration: any) => {
    try {
        return await fetchWithAuth(`${symfonyUrl}/api/v1/conversations/${conversationId}/mute`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({duration}),
        });
    } catch (error) {
        throw error;
    }
}

export const handleUnmuteConversation = async (conversationId: number) => {
    try {
        return await fetchWithAuth(`${symfonyUrl}/api/v1/conversations/${conversationId}/unmute`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        throw error;
    }
}
