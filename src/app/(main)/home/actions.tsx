'use server'

import {fetchWithAuth} from "@/services/fetchWithAuth";
import {PostData} from "@/models/PostData";

const symfonyUrl = process.env.SYMFONY_URL;

export const createNewPost = async (postData: PostData) => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/post`, {
            method: "POST",
            body: JSON.stringify(postData)
        });

        if (!response) {
            throw new Error('Failed to create post');
        }

        return response;
    } catch (error) {
        throw new Error("Erreur du serveur");
    }
}

export const updatePost = async (postData: PostData) => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/post/${postData.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: "",
                content: postData.content,
                visibility: postData.visibility,
                authorId: postData.authorId
            })
        });

        if (!response) {
            throw new Error('Failed to update post');
        }

        return response;
    } catch (error) {
        throw new Error("Erreur du serveur");
    }
}

export const deletePost = async (postData: { id: string; editorId?: string; }) => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/post/${postData.id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(postData)
        });

        if (!response.response || 200 !== response.status) {
            throw new Error('Failed to delete post');
        }
        return response.data;
    } catch (error) {
        throw new Error("Erreur du serveur");
    }
}

export const fetchRecentPosts = async (profileId: string) => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/post/${profileId}/recent`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        const data = response.data;

        if (!response || !response.data || !Array.isArray(response.data.posts)) {
            return [];
        }

        return data.posts;
    } catch (error) {
        throw new Error("Erreur du serveur");
    }
}

export const fetchOlderPosts = async (pageParam: number, limit = 20, profileId: string) => {
    try {
        const response = await fetchWithAuth(
            `${symfonyUrl}/api/v1/post/${profileId}/older?limit=${limit}&offset=${(pageParam - 1) * limit}`,
            {
                method: "GET",
                headers: {"Content-Type": "application/json"},
            }
        );
        if (!response || !response.data || !Array.isArray(response.data.posts)) {
            return {posts: [], nextPage: undefined};
        }

        const hasMore = response.data.posts.length === limit;
        const nextPage = hasMore ? pageParam + 1 : undefined;

        return {
            posts: response.data.posts,
            nextPage
        };
    } catch (error) {
        throw new Error("Erreur du serveur");
    }
}

export const fetchLastCommentsFromPost = async (postId: string, profileId: string) => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/comment/${postId}/${profileId}/comments`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        if (!response || !response.data) {
            return {comments: []}
        }

        return {
            comments: response.data.comments,
        }
    } catch (error) {
        throw new Error("Erreur du serveur");
    }
}

export const createCommentOnPost = async (commentData: {
    postId: string;
    authorId: string | undefined;
    content: string
}) => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/comment/add/post`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(commentData)
        });

        if (!response.response || 201 !== response.status) {
            throw new Error('Failed to create comment');
        }

        return response.data;
    } catch (error) {
        throw new Error("Erreur du serveur");
    }
};

export const updateCommentOnPost = async (
    commentId: string,
    authorId: string | undefined,
    content: string
) => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/comment/${commentId}/update`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({authorId, content})
        });

        if (!response.response || 200 !== response.status) {
            throw new Error('Failed to update comment');
        }

        return response.data;
    } catch (error) {
        throw new Error("Erreur du serveur");
    }
}

export const deleteCommentOnPost = async (commentId: string, authorId: string) => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/comment/${commentId}/delete`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({authorId})
        });

        if (!response.response || 200 !== response.status) {
            throw new Error('Failed to delete comment');
        }

        return response.data;
    } catch (error) {
        throw new Error("Erreur du serveur");
    }
}

export const replyToComment = async (replyData: {
    postId: string;
    parentId: string;
    authorId: string;
    content: string;
}) => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/comment/add/reply`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(replyData)
        });

        if (!response.response || 201 !== response.status) {
            throw new Error('Failed to create reply');
        }

        return response.data;
    } catch (error) {
        throw new Error("Erreur du serveur");
    }
};

export const fetchRepliesForComment = async (commentId: string, profileId: string) => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/comment/${commentId}/${profileId}/children`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });
        console.log(response)
        if (!response || !response.data) {
            return {comments: []}
        }

        return {
            replies: response.data
        }
    } catch (error) {
        throw new Error("Erreur du serveur");
    }
}

export async function likePost(
    actorId: string,
    receiverId: string,
    resourceType: "POST" | "COMMENT",
    resourceId: string,
    reactType: "LIKE" | "SAD"
) {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/react/toggle`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                actorId,
                receiverId,
                resourceType,
                resourceId,
                reactType,
            }),
        });

        if (!response.response || 200 !== response.status) {
            throw new Error("Erreur lors du like");
        }

        return response;
    } catch (error) {
        throw error;
    }
}