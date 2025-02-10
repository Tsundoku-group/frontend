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
        console.log(postData)
        if (!response) {
            console.error("Erreur lors de l'ajout du post");
        }

        return response;
    } catch (error) {
        console.error("Erreur lors de l'ajout du post");
    }
}

export const fetchRecentPosts = async () => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/post/recent`, {
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
        console.error(error);
    }
}

export const fetchOlderPosts = async (pageParam: number, limit = 20) => {
    try {
        const response = await fetchWithAuth(
            `${symfonyUrl}/api/v1/post/older?limit=${limit}&offset=${(pageParam - 1) * limit}`,
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
        return {posts: [], nextPage: undefined};
    }
}

export const fetchLastCommentsFromPost = async (postId: string) => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/comment/${postId}/comments`, {
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
        return {comments: []};
    }
}

export const fetchRepliesForComment = async (commentId: string) => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/comment/${commentId}/children`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        if (!response || !response.data) {
            return {comments: []}
        }

        return {
            replies: response.data
        }
    } catch (error) {
        return {comments: []};
    }
}