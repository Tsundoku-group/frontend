'use server'

import {fetchWithAuth} from "@/services/fetchWithAuth";

const symfonyUrl = process.env.SYMFONY_URL;

export const fetchRecentPosts =  async () => {
    try {
        console.log("Fetching recent posts...");
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/post/recent`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        const data = response.data;

        console.log(data);
        if (!response || !response.data || !Array.isArray(response.data.posts)) {
            console.warn("fetchRecentPosts: Aucun post reçu.");
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
                headers: { "Content-Type": "application/json" },
            }
        );
        if (!response || !response.data || !Array.isArray(response.data.posts)) {
            return { posts: [], nextPage: undefined };
        }

        const hasMore = response.data.posts.length === limit;
        const nextPage = hasMore ? pageParam + 1 : undefined;

        return {
            posts: response.data.posts,
            nextPage
        };
    } catch (error) {
        return { posts: [], nextPage: undefined };
    }
};