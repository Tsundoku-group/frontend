'use server';

import {fetchWithAuth} from "@/services/fetchWithAuth";
import {ChatConversation, ChatParticipant} from "@/models/ChatConversation";

const symfonyUrl = process.env.SYMFONY_URL;

export const fetchUserConversations = async (userId: unknown): Promise<ChatConversation[]> => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/conversation/get-all/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = response.data;

        if (data && data.conversations && Array.isArray(data.conversations)) {
            return data.conversations.flat();
        } else {
            return [];
        }
    } catch (error) {
        return [];
    }
};

export const fetchOneConversationById = async (conversationId: string): Promise<ChatParticipant[]> => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/conversation/get-one/${conversationId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = response.data;

        if (data && data.participants && Array.isArray(data.participants)) {
            return data.participants.map((participant: {
                id: any;
                userName: any;
                email: any;
                imageUrl: any;
            }) => ({
                id: participant.id,
                userName: participant.userName,
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
        const response = await fetchWithAuth(`${symfonyUrl}/api/message/get/${conversationId}?page=${page}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const messages = response.data;

        if (Array.isArray(messages)) {
            return messages.map(message => {
                if (message.image) {
                    message.imageUrl = `${symfonyUrl}${message.image}`;
                }

                return {
                    ...message,
                    hasImage: !!message.imageUrl,
                };
            });
        } else {
            console.error("La réponse des messages n'est pas au format attendu : ", messages);
            return [];
        }
    } catch (error) {
        console.error("Erreur lors du fetch des messages :", error);
        return [];
    }
};

export const sendMessage = async (payload: any, conversationId: string) => {
    try {
        return await fetchWithAuth(`${symfonyUrl}/api/message/send/${conversationId}`, {
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
        return await fetchWithAuth(`${symfonyUrl}/api/message/mark-messages-read/${conversationId}`, {
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
        title: "Nouvelle conversation",
        participants: [friendId],
        email: userEmail
    };

    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/conversation/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

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
        return await fetchWithAuth(`${symfonyUrl}/api/conversation/delete/${conversationId}`, {
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
        return await fetchWithAuth(`${symfonyUrl}/api/conversation/archive/${conversationId}`, {
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
        return await fetchWithAuth(`${symfonyUrl}/api/conversation/mute/${conversationId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({duration})
        });
    } catch (error) {
        throw error;
    }
}

export const handleUnmuteConversation = async (conversationId: string) => {
    try {
        return await fetchWithAuth(`${symfonyUrl}/api/conversation/unmute/${conversationId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        throw error;
    }
}
