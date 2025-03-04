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

        if (response.status !== 200 || !response.data) {
            throw new Error("Failed to fetch articles");
        }

        console.log(response);

        return response.data.articles || [];
    } catch (error) {
        throw new Error("Failed to fetch articles : " + error);
    }
}

export const deleteArticle = async (articleId: string, editorId: string) => {
    if (!articleId) {
        throw new Error("Article id is missing");
    }

    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/post/${articleId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ editorId })
        });

        if (response.status !== 200) {
            throw new Error("Failed to delete article : " + response.error);
        }

        return { success: true, message: "Article deleted successfully" };
    } catch (error) {
        throw new Error("Failed to delete article : " + error);
    }
};