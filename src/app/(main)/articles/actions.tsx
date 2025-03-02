'use server'

import { fetchWithAuth } from "@/services/fetchWithAuth";

const symfonyUrl = process.env.SYMFONY_URL;

export const fetchProfileArticles = async (profileId: string | undefined) => {
    if (!profileId) {
        throw new Error("Profile id is missing");
    }

    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/post/${profileId}/articles`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        if (!response || !response.data) {
            throw new Error("Failed to fetch articles");
        }

        return response.data.articles || [];
    } catch (error) {
        throw new Error("Failed to fetch articles : " + error);
    }
}