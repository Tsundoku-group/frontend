"use server";

import {fetchWithAuth} from "@/services/fetchWithAuth";
import {ChatConversation} from "@/models/ChatConversation";
import { symfonyUrl } from "@/constants/symfonyUrl";

export const fetchArchivedConversations = async (userId: string): Promise<ChatConversation[]> => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/conversations/${userId}/archived`, {
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

export const handleUnarchiveConversation = async (conversationId: string) => {
    try {
        return await fetchWithAuth(`${symfonyUrl}/api/v1/conversations/${conversationId}/unarchive`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        throw error;
    }
};

export const handleUnarchiveAllConversations = async (userId: string) => {
    try {
        return await fetchWithAuth(`${symfonyUrl}/api/v1/conversations/${userId}/unarchive/all`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({userId}),
        });

    } catch (error) {
        throw error;
    }
};
