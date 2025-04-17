'use server'

import { fetchWithAuth } from "@/services/fetchWithAuth";
import {Article} from "@/models/Article";

const symfonyUrl = process.env.SYMFONY_URL;

export const fetchProfileArticles = async (
    profileId: number | undefined,
    page: number = 1,
    sortField: string = "createdAt",
    sortOrder: string = "desc",
) => {
    if (!profileId) {
        throw new Error("Profile id is missing");
    }

    try {
        const queryParams = new URLSearchParams({
            page: page.toString(),
            sortField,
            sortOrder
        });

        const response = await fetchWithAuth(
            `${symfonyUrl}/api/v1/post/${profileId}/articles?${queryParams.toString()}`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            }
        );

        if (response.status !== 200 || !response.data) {
            throw new Error("Failed to fetch articles");
        }

        return response.data;
    } catch (error) {
        return {
            articles: [],
            pagination: {
                currentPage: page,
                limit: 15,
                totalArticles: 0,
                totalPages: 1,
            },
        };
    }
};

export const deleteArticle = async (articleId: string, editorId: number) => {
    if (!articleId) {
        console.error("Article id is missing");
    }

    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/post/${articleId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ editorId })
        });

        if (response.status !== 200) {
            throw new Error("Failed to delete article: " + (response.data?.error || response.status));
        }

        return { success: true, message: "Article deleted successfully" };
    } catch (error) {
        console.error("Failed to delete article: ", error);
    }
};

export const submitArticle = async (
    articleId: string | null,
    payload: { title: string; content: string; status: string; authorId: number },
    profileId: number | undefined
) => {
    if (!profileId) {
        throw new Error("Profile id is missing");
    }

    try {
        const method = articleId ? "PUT" : "POST";
        const url = articleId ? `${symfonyUrl}/api/v1/post/${articleId}` : `${symfonyUrl}/api/v1/post`;

        const modifiedPayload = { ...payload, type: "article" };

        const JSONBody = JSON.stringify(modifiedPayload);

        const response = await fetchWithAuth(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSONBody
        });

        if (response.status !== 200 && response.status !== 201) {
            const errorMsg = response.data && response.data.error ? response.data.error : "Failed to submit article";
            throw new Error("Failed to submit article: " + errorMsg);
        }
        return response.data;
    } catch (error) {
        throw new Error("Failed to submit article: " + error);
    }
};

export const updateArticleStatus = async (articleId: string, newStatus: string, editorId: number) => {
    if (articleId === "") {
        console.error("Article id is missing");
    }

    const payload = { status: newStatus, editorId };
    const JSONBody = JSON.stringify(payload);

    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/post/${articleId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSONBody
        });

        if (response.status !== 200) {
            console.error("Failed to update article status: ", response.data?.error || response.status);
        }
        return response.data;
    } catch (error) {
        console.error("Failed to update article status: ", error);
    }
};

export const fetchArticle = async (id: number) => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/post/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = response.data;

        if (response.status !== 200 || !data) {
            throw new Error("Failed to fetch article");
        }

        return data as Article;

    } catch (error) {
        throw new Error("Failed to fetch article");
    }
}