'use server'

import { fetchWithAuth } from "@/services/fetchWithAuth";

const symfonyUrl = process.env.SYMFONY_URL;

export const fetchMembersFromGroup = async (groupId: string) => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/group/private/${groupId}/members`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        if (!response || 200 !== response.status) {
            throw new Error("Not Found");
        }

        return response.data;
    } catch (error) {
        return error;
    }
}