'use server';

import { fetchWithAuth } from "@/services/fetchWithAuth";
import { GroupData } from "@/models/GroupData";

const symfonyUrl = process.env.SYMFONY_URL;

export const fetchPrivateGroups = async (
    search: string,
    tagName: string,
    sort: string,
    page: number,
    limit: number = 20
): Promise<{ groups: GroupData[], nextPage: number | null }> => {
    try {
        const queryTag = tagName === "all" ? "" : tagName;
        const response = await fetchWithAuth(
            `${symfonyUrl}/api/v1/group/private?search=${encodeURIComponent(search)}&tagName=${encodeURIComponent(queryTag)}&sort=${encodeURIComponent(sort)}&page=${page}&limit=${limit}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            }
        );
        if (!response.response || response.status !== 200) {
            throw new Error("Not Found");
        }

        return response.data;
    } catch (error) {
        return { groups: [], nextPage: null };
    }
};

export const fetchAllTags = async ()=> {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/tags`);

        if (!response || 200 !== response.status) {
            throw new Error("Not Found");
        }

        return response.data.tags;
    } catch (error) {
        return [];
    }
}