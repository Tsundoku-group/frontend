'use server';

import { fetchWithAuth } from "@/services/fetchWithAuth";
import { Article } from "@/models/Article";

const symfonyUrl = process.env.SYMFONY_URL;

export const fetchArticle = async (id: number) => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/post/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log("response cc", response);

        const data = response.data;
        console.log("data", data);

        if (response.status !== 200 || !data) {
            throw new Error("Failed to fetch article");
        }

        return data as Article;

    } catch (error) {
        throw new Error("Failed to fetch article");
    }
}