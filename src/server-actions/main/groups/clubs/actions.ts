'use server';

import { fetchWithAuth } from "@/services/fetchWithAuth";
import { GroupData } from "@/models/GroupData";
import {GroupMember} from "@/models/GroupMember";
import {Tag} from "@/models/Tag";
import { symfonyUrl } from "@/constants/symfonyUrl";

const roleLabelMap: Record<string, string> = {
    admin: "Administrateur",
    member: "Membre",
};

export interface FetchAllTagsResponse {
    tags: Tag[];
    code: number;
    message: string;
}

export const fetchPrivateGroups = async (
    search: string,
    tagName: string,
    sort: string,
    page: number,
    limit: number = 20,
    profileId: number,
    myGroups: boolean = false
): Promise<{ groups: GroupData[], nextPage: number | null }> => {
    try {
        const queryTag = tagName === "all" ? "" : tagName;
        let url = `${symfonyUrl}/api/v1/groups?search=${encodeURIComponent(search)}&tagName=${encodeURIComponent(queryTag)}&sort=${encodeURIComponent(sort)}&page=${page}&limit=${limit}&profileId=${profileId}`;

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
            return { groups: [], nextPage: null };
        }

        return response.data;
    } catch (error) {
        return { groups: [], nextPage: null };
    }
};

export const fetchGroupBySlug = async (
    slug: string
): Promise<{ group: GroupData | null; code: number; message: string }> => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/groups/${slug}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.response || response.status !== 200) {
            return {
                group: null,
                code: response.status,
                message: response?.message || "Erreur de récupération du groupe",
            };
        }

        return {
            group: response.data,
            code: 200,
            message: "OK",
        };
    } catch (error: any) {
        return {
            group: null,
            code: 500,
            message: "Erreur réseau ou interne",
        };
    }
};

export const fetchAllTags = async (): Promise<FetchAllTagsResponse> => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/tags`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        if (!response || response.status !== 200) {
            return {
                tags: [],
                code: response?.status || 500,
                message: response?.message || "Erreur de récupération des tags",
            };
        }

        return {
            tags: response.data.tags as Tag[],
            code: 200,
            message: "OK",
        };
    } catch (error: any) {
        return {
            tags: [],
            code: 500,
            message: "Erreur réseau ou interne",
        };
    }
};

export const joinPrivateGroup = async (
    groupId: number,
    profileId: number,
    role: string
): Promise<{
    success: boolean;
    code: number;
    message: string;
}> => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/groups/profile`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ groupId, profileId, role }),
        });

        if (!response.response || response.status !== 201) {
            return {
                success: false,
                code: response?.status || 500,
                message: response?.data?.error || "Impossible de rejoindre le groupe",
            };
        }

        return {
            success: true,
            code: 201,
            message: "Rejoint avec succès",
        };
    } catch (error: any) {
        return {
            success: false,
            code: 500,
            message: error?.message || "Erreur serveur inattendue",
        };
    }
};

export const toggleFavoriteGroup = async (
    groupId: number,
    profileId: number,
    isFavorite: boolean
): Promise<{
    success: boolean;
    code: number;
    message: string;
}> => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/marks`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                profileId,
                targetId: groupId,
                targetType: "group",
                isFavorite,
            }),
        });

        if (!response.response || response.status !== 201) {
            return {
                success: false,
                code: response?.status || 500,
                message: response?.message || "Impossible de modifier l'état du favori",
            };
        }

        return {
            success: true,
            code: 201,
            message: "État du favori mis à jour avec succès.",
        };
    } catch (error: any) {
        return {
            success: false,
            code: 500,
            message: error?.message || "Erreur serveur inattendue",
        };
    }
};

export const togglePinnedGroup = async (
    groupId: number,
    profileId: number,
    isPinned: boolean
): Promise<{
    success: boolean;
    code: number;
    message: string;
}> => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/marks`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                profileId,
                targetId: groupId,
                targetType: "group",
                isPinned,
            }),
        });

        if (!response.response || response.status !== 201) {
            return {
                success: false,
                code: response.status,
                message: response?.message || "Impossible de modifier l'état de l'épingle",
            };
        }

        return {
            success: true,
            code: 201,
            message: "État de l'épingle mis à jour avec succès.",
        };
    } catch (error: any) {
        return {
            success: false,
            code: 500,
            message: error?.message || "Erreur serveur inattendue",
        };
    }
};

export const fetchMembersFromGroup = async (
    groupId: number
): Promise<GroupMember[]> => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/groups/${groupId}/members`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response?.response || response.status !== 200 || !response.data) {
            return [];
        }

        return response.data.map((member: any) => ({
            ...member,
            roleLabel: roleLabelMap[member.groupRole] ?? member.groupRole,
        }));
    } catch (error) {
        return [];
    }
};