"use server";

import {fetchWithAuth} from "@/services/fetchWithAuth";
import {ChatConversation} from "@/models/ChatConversation";
import { symfonyUrl } from "@/constants/symfonyUrl";

export const fetchArchivedConversations = async (profileId: number): Promise<ChatConversation[]> => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/conversations/${profileId}/archived`, {
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

export const handleUnarchiveConversation = async (conversationId: number) => {
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

export const handleUnarchiveAllConversations = async (profileId: number) => {
    try {
        return await fetchWithAuth(`${symfonyUrl}/api/v1/conversations/${profileId}/unarchive/all`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({profileId}),
        });

    } catch (error) {
        throw error;
    }
};
