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

        return response.data.articles || [];
    } catch (error) {
        console.error("Failed to fetch articles: ", error);
        return [];
    }
}

export const deleteArticle = async (articleId: string, editorId: string) => {
    if (!articleId) {
        console.error("Article id is missing");
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
            throw new Error("Failed to delete article: " + response.error);
        }

        return { success: true, message: "Article deleted successfully" };
    } catch (error) {
        console.error("Failed to delete article: ", error);
    }
};

export const updateArticleStatus = async (articleId: string, newStatus: string, editorId: string) => {
    if (articleId === "") {
        console.error("Article id is missing");
    }

    const payload = { status: newStatus, editorId };
    const JSONBody = JSON.stringify(payload);

    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/post/${articleId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSONBody
        });

        if (response.status !== 200) {
            console.error("Failed to update article status: ", response.error);
        }
        return response.data;
    } catch (error) {
        console.error("Failed to update article status: ", error);
    }
};