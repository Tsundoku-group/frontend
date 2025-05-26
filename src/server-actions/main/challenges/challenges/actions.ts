'use server'

import { symfonyUrl } from "@/constants/symfonyUrl";
import { Challenge } from "@/models/Challenge";
import { fetchWithAuth } from "@/services/fetchWithAuth";

export const fetchProfileActiveChallenges = async (
    profileId: number | undefined
): Promise<Challenge[]> => {

    if (!profileId) return [];

    try {
        const response = await fetchWithAuth(
            `${symfonyUrl}/api/v1/challenges/${profileId}/active`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            }
        );

        if (response.status !== 200 || !response.data) {
            console.error("Error fetching challenges:", response);
            return [];
        }

        console.log(response);
        return response.data as Challenge[];
    } catch (error) {
        console.error("Error fetching challenges:", error);
        return [];
    }
}