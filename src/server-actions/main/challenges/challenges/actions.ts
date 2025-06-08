'use server'

import { symfonyUrl } from "@/constants/symfonyUrl";
import { Challenge } from "@/models/Challenge";
import { fetchWithAuth } from "@/services/fetchWithAuth";

type ChallengeStatus = 'active' | 'inactive';

export type ConstraintResponse = {
    actionTypes: string[]
    contentTypes: string[]
    frequencies: string[]
    allowedContent: Record<string, string[]>
}

const fetchProfileChallengesByStatus = async (
    profileId: number | undefined,
    status: ChallengeStatus
): Promise<Challenge[]> => {
    if (!profileId) {
        return [];
    }

    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/challenges/${profileId}/${status}`,
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

export const fetchConstraints = async (): Promise<ConstraintResponse> => {
    try {
        const response = await fetchWithAuth(
            `${symfonyUrl}/api/v1/challenges/constraints`,
            {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            }
        )

        if (response.status !== 200 || !response.data) {
            console.error('Error fetching constraints:', response);
            return {
                actionTypes: [],
                contentTypes: [],
                frequencies: [],
                allowedContent: {}
            };
        }

        return response.data as ConstraintResponse
    } catch (error) {
        console.error('Error fetching constraints: ', error);
        return {
            actionTypes: [],
            contentTypes: [],
            frequencies: [],
            allowedContent: {}
        };
    }
};

export const submitChallenge = async (
    payload: {
        name: string;
        type: string;
        startAt: string;
        endAt: string;
        action: string;
        contentType: string;
        frequency: string;
        targetCount: number;
        inviteeIds: number[];
    },
    profileId: number | undefined
): Promise<{ success: boolean; message: string; data?: any }> => {
    if (!profileId) {
        return { success: false, message: "Profile ID is required" };
    }

    try {
        const response = await fetchWithAuth(
            `${symfonyUrl}/api/v1/challenges`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            }
        );

        if (response.status !== 200 || !response.data) {
            return { success: false, message: "Failed to submit challenge" };
        }

        return { success: true, message: "Challenge submitted successfully", data: response.data };
    } catch (error) {
        console.error("Error submitting challenge:", error);
        return { success: false, message: `Error submitting challenge: ${error}` };
    }
}

export const deleteChallenge = async (
    challengeId: number,
    profileId: number | undefined
): Promise<{ success: boolean; message: string }> => {
    if (!profileId) {
        return { success: false, message: "Profile ID is required" };
    }

    try {
        const response = await fetchWithAuth(
            `${symfonyUrl}/api/v1/challenges/${challengeId}`,
            {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            }
        );

        if (response.status !== 200) {
            return { success: false, message: "Failed to delete challenge" };
        }

        return { success: true, message: "Challenge deleted successfully" };
    } catch (error) {
        console.error("Error deleting challenge:", error);
        return { success: false, message: `Error deleting challenge: ${error}` };
    }
}