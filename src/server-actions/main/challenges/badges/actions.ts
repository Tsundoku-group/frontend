'use server'

import { fetchWithAuth } from "@/services/fetchWithAuth";
import { symfonyUrl } from "@/constants/symfonyUrl";
import { Badge } from "@/models/Challenge";

export const fetchProfileBadges = async (
    profileId: number | undefined
): Promise<Badge[]> => {

    if (!profileId) return [];

    try {
        const response = await fetchWithAuth(
            `${symfonyUrl}/api/v1/badges/${profileId}`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            }
        );

        if (response.status !== 200 || !response.data) {
            console.error("Error fetching badges:", response);
            return [];
        }

        return response.data as Badge[];
    } catch (error) {
        console.error("Error fetching badges:", error);
        return [];
    }
}