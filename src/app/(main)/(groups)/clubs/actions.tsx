'use server';

import { fetchWithAuth } from "@/services/fetchWithAuth";
import { GroupData } from "@/models/GroupData";

const symfonyUrl = process.env.SYMFONY_URL;

export const fetchPrivateGroups = async (
    search: string,
    tagName: string,
    sort: string,
    page: number,
    limit: number = 20,
    profileId: string,
    myGroups: boolean = false
): Promise<{ groups: GroupData[], nextPage: number | null }> => {
    try {
        const queryTag = tagName === "all" ? "" : tagName;
        let url = `${symfonyUrl}/api/v1/group/private?search=${encodeURIComponent(search)}&tagName=${encodeURIComponent(queryTag)}&sort=${encodeURIComponent(sort)}&page=${page}&limit=${limit}&profileId=${profileId}`;

        if (profileId !== null) {
            url += `&myGroups=${myGroups}`;
        }

        const response = await fetchWithAuth(
            url,
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

export const fetchGroupBySlug = async (slug: string) => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/group/private/${slug}`);

        if (!response.response || response.status !== 200) {
            throw new Error("Not Found");
        }

        return response.data;
    } catch (error) {
        return [];
    }
}

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

export const joinPrivateGroup = async (
    groupId: string,
    profileId: string,
    role: string
) => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/group/profile`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ groupId, profileId, role }),
        });

        if (!response.response || response.status !== 201) {
            return { error: response.data?.error || "Erreur inconnue lors de la requête" };
        }

        return { data: response.data };
    } catch (error: any) {
        return { error: error.message || "Erreur inconnue" };
    }
};