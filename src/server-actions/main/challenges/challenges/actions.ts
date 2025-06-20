'use server'

import { symfonyUrl } from "@/constants/symfonyUrl";
import { Challenge } from "@/models/Challenge";
import { fetchWithAuth } from "@/services/fetchWithAuth";

type ChallengeStatus = 'active' | 'inactive';

const fetchProfileChallengesByStatus = async (
    profileId: number | undefined,
    status: ChallengeStatus
): Promise<Challenge[]> => {
    if (!profileId) {
        return [];
    }

    try {
        const response = await fetchWithAuth(
            `${symfonyUrl}/api/v1/challenges/${profileId}/${status}`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            }
        );

        if (response.status !== 200 || !response.data) {
            console.error(`Error fetching ${status} challenges:`, response);
            return [];
        }

        return response.data as Challenge[];
    } catch (error) {
        console.error(`Error fetching ${status} challenges:`, error);
        return [];
    }
};

export const fetchProfileActiveChallenges = async (
    profileId: number | undefined
): Promise<Challenge[]> => {
    return fetchProfileChallengesByStatus(profileId, 'active');
};

export const fetchProfileInactiveChallenges = async (
    profileId: number | undefined
): Promise<Challenge[]> => {
    return fetchProfileChallengesByStatus(profileId, 'inactive');
};