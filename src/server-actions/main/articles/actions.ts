'use server'

import {fetchWithAuth} from "@/services/fetchWithAuth";
import {Article} from "@/models/Article";
import {symfonyUrl} from "@/constants/symfonyUrl";

export const fetchProfileArticles = async (
    profileId: number | undefined,
    page: number = 1,
    sortField: string = "createdAt",
    sortOrder: string = "desc"
): Promise<{ articles: Article[]; pagination: any }> => {
    if (!profileId) {
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

    try {
        const queryParams = new URLSearchParams({
            page: page.toString(),
            sortField,
            sortOrder,
            type: 'article'
        });

        const response = await fetchWithAuth(
            `${symfonyUrl}/api/v1/postss/${profileId}/articles?${queryParams.toString()}`,
            {
                method: "GET",
                headers: {"Content-Type": "application/json"},
            }
        );

        if (response.status !== 200 || !response.data) {
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

export const deleteArticle = async (articleId: string, editorId: number): Promise<{
    success: boolean;
    message: string
}> => {
    if (!articleId) {
        return {success: false, message: "Article id is missing"};
    }

    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/posts/${articleId}`, {
            method: "DELETE",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({editorId})
        });

        if (response.status !== 200) {
            return {success: false, message: response.data?.error || "Échec de la suppression."};
        }

        return {success: true, message: "Article supprimé avec succès."};
    } catch (error: any) {
        return {success: false, message: error.message || "Erreur serveur."};
    }
};

export const submitArticle = async (
    articleId: string | null,
    payload: { title: string; content: string; status: string; authorId: number, type: 'article' },
    profileId: number | undefined
): Promise<{ success: boolean; message: string; data?: any }> => {
    if (!profileId) {
        return {success: false, message: "Profil manquant."};
    }

    try {
        const method = articleId ? "PUT" : "POST";
        const url = articleId ? `${symfonyUrl}/api/v1/posts/${articleId}` : `${symfonyUrl}/api/v1/post`;

        const modifiedPayload = {...payload, type: "article"};
        const response = await fetchWithAuth(url, {
            method,
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(modifiedPayload)
        });

        if (![200, 201].includes(response.status)) {
            return {success: false, message: response.data?.error || "Erreur lors de l'envoi."};
        }

        return {success: true, message: "Article soumis.", data: response.data};
    } catch (error: any) {
        return {success: false, message: error.message || "Erreur serveur"};
    }
};

export const updateArticleStatus = async (articleId: string, newStatus: string, editorId: number): Promise<{
    success: boolean;
    message: string
}> => {
    if (!articleId) {
        return {success: false, message: "Identifiant d'article manquant."};
    }

    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/posts/${articleId}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({status: newStatus, editorId})
        });

        if (response.status !== 200) {
            return {success: false, message: response.data?.error || "Échec de mise à jour."};
        }

        return {success: true, message: "Statut mis à jour."};
    } catch (error: any) {
        return {success: false, message: error.message || "Erreur serveur"};
    }
};

export const fetchArticle = async (id: number): Promise<Article | null> => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/posts/${id}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({type: 'article'}),
        });

        if (response.status !== 200 || !response.data) {
            return null;
        }

        return response.data as Article;
    } catch (error) {
        return null;
    }
};
