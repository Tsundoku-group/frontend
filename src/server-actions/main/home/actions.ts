'use server';

import { fetchWithAuth } from "@/services/fetchWithAuth";
import { PostData } from "@/models/PostData";
import { symfonyUrl } from "@/constants/symfonyUrl";

export const createNewPost = async (postData: PostData) => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/posts`, {
            method: "POST",
            body: JSON.stringify(postData)
        });

        if (!response || !response.response) {
            return { success: false, message: 'Création de post échouée.' };
        }

        return { success: true, data: response.data };
    } catch {
        return { success: false, message: 'Erreur du serveur.' };
    }
};

export const updatePost = async (postData: PostData) => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/posts/${postData.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: "",
                content: postData.content,
                visibility: postData.visibility,
                authorId: postData.authorId
            })
        });

        if (!response || !response.response) {
            return { success: false, message: 'Mise à jour échouée.' };
        }

        return { success: true, data: response.data };
    } catch {
        return { success: false, message: 'Erreur du serveur.' };
    }
};

export const deletePost = async (postData: { id: number; editorId?: number }) => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/posts/${postData.id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(postData)
        });

        if (!response.response || response.status !== 200) {
            return { success: false, message: 'Suppression échouée.' };
        }

        return { success: true, data: response.data };
    } catch {
        return { success: false, message: 'Erreur du serveur.' };
    }
};

export const fetchRecentPosts = async (groupId: number, profileId: number) => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/groups/${groupId}/posts/recent?profileId=${profileId}&type=post`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });

        if (!response || !response.data || !Array.isArray(response.data.posts)) {
            return { success: false, posts: [] };
        }

        return { success: true, posts: response.data.posts };
    } catch {
        return { success: false, posts: [] };
    }
};

export const fetchOlderPosts = async (pageParam: number, limit = 20, groupId: number, profileId: number) => {
    try {
        const response = await fetchWithAuth(
            `${symfonyUrl}/api/v1/groups/${groupId}/posts/older?profileId=${profileId}&type=post&limit=${limit}&offset=${(pageParam - 1) * limit}`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            }
        );

        if (!response || !response.data || !Array.isArray(response.data.posts)) {
            return { posts: [], nextPage: undefined };
        }

        const hasMore = response.data.posts.length === limit;
        return {
            posts: response.data.posts,
            nextPage: hasMore ? pageParam + 1 : undefined
        };
    } catch {
        return { posts: [], nextPage: undefined };
    }
};

export const fetchLastCommentsFromPost = async (postId: number, profileId: number) => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/comments/post/${postId}?profileId=${profileId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (!response || !response.data) {
            return { comments: [] };
        }

        return { comments: response.data.comments };
    } catch {
        return { comments: [] };
    }
};

export const createCommentOnPost = async (commentData: {
    postId: number;
    authorId: number | undefined;
    content: string;
}) => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/comments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(commentData)
        });

        if (!response.response || response.status !== 201) {
            return { success: false, message: 'Création du commentaire échouée.' };
        }

        return { success: true, data: response.data };
    } catch {
        return { success: false, message: 'Erreur du serveur.' };
    }
};

export const updateCommentOnPost = async (
    commentId: number,
    authorId: number | undefined,
    content: string
) => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/comments/${commentId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ authorId, content })
        });

        if (!response.response || response.status !== 200) {
            return { success: false, message: 'Mise à jour échouée.' };
        }

        return { success: true, data: response.data };
    } catch {
        return { success: false, message: 'Erreur du serveur.' };
    }
};

export const deleteCommentOnPost = async (commentId: number, authorId: number) => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/comments/${commentId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ authorId })
        });

        if (!response.response || response.status !== 200) {
            return { success: false, message: 'Suppression du commentaire échouée.' };
        }

        return { success: true, data: response.data };
    } catch {
        return { success: false, message: 'Erreur du serveur.' };
    }
};

export const replyToComment = async (replyData: {
    postId: number;
    parentId: string;
    authorId: number;
    content: string;
}) => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/comments/replies`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(replyData)
        });

        if (!response.response || response.status !== 201) {
            return { success: false, message: 'Réponse échouée.' };
        }

        return { success: true, data: response.data };
    } catch {
        return { success: false, message: 'Erreur du serveur.' };
    }
};

export const fetchRepliesForComment = async (commentId: string, profileId: number) => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/comments/${commentId}/children?profileId=${profileId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (!response || !response.data) {
            return { replies: [] };
        }

        return { replies: response.data };
    } catch {
        return { replies: [] };
    }
};

export async function likePost(
    actorId: number,
    receiverId: number,
    resourceType: "POST" | "COMMENT",
    resourceId: number,
    reactType: "LIKE" | "SAD"
) {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/reacts`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                actorId,
                receiverId,
                resourceType,
                resourceId,
                reactType,
            }),
        });

        if (!response.response || response.status !== 200) {
            return { success: false, message: "Erreur lors de l'enregistrement de la réaction." };
        }

        return { success: true, data: response.data };
    } catch {
        return { success: false, message: 'Erreur du serveur.' };
    }
}