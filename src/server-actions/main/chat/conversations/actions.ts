'use server';

import {fetchWithAuth} from "@/services/fetchWithAuth";
import {ChatConversation, ChatParticipant} from "@/models/ChatConversation";

const symfonyUrl = process.env.SYMFONY_URL;

export const fetchUserConversations = async (userId: unknown): Promise<ChatConversation[]> => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/conversation/${userId}/all`, {
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

export const fetchOneConversationById = async (conversationId: string): Promise<ChatParticipant[]> => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/conversation/${conversationId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = response.data;

        if (data && data.participants && Array.isArray(data.participants)) {
            return data.participants.map((participant: {
                id: any;
                username: any;
                email: any;
                imageUrl: any;
            }) => ({
                id: participant.id,
                username: participant.username,
                email: participant.email,
                imageUrl: participant.imageUrl,
            }));
        } else {
            return [];
        }
    } catch (error) {
        return [];
    }
};

export const fetchMessagesFromConversationId = async (conversationId: string, page = 1, limit = 20) => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/message/${conversationId}?page=${page}&limit=${limit}`, {
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

export const sendMessage = async (payload: any, conversationId: string) => {
    try {
        return await fetchWithAuth(`${symfonyUrl}/api/v1/message/${conversationId}/send`, {
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

export const fetchMarkMessagesAsRead = async (conversationId: string, userEmail: string) => {
    try {
        return await fetchWithAuth(`${symfonyUrl}/api/v1/message/${conversationId}/mark/read`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({userEmail}),
        });
    } catch (error) {
        throw error;
    }
};

export const startNewConversation = async (userEmail: string, friendId: string) => {
    const body = {
        participants: [friendId],
        email: userEmail
    };

    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/conversation/create`, {
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

export const handleDeleteConversation = async (conversationId: string) => {
    try {
        return await fetchWithAuth(`${symfonyUrl}/api/v1/conversation/${conversationId}/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        throw error;
    }
};

export const handleArchiveConversation = async (conversationId: string) => {
    try {
        return await fetchWithAuth(`${symfonyUrl}/api/v1/conversation/${conversationId}/archive`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        throw error;
    }
};

export const handleMuteConversationDuration = async (conversationId: string, duration: any) => {
    try {
        return await fetchWithAuth(`${symfonyUrl}/api/v1/conversation/${conversationId}/mute`, {
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

export const handleUnmuteConversation = async (conversationId: string) => {
    try {
        return await fetchWithAuth(`${symfonyUrl}/api/v1/conversation/${conversationId}/unmute`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        throw error;
    }
}
