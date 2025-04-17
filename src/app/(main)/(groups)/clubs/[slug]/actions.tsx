'use server'

import { fetchWithAuth } from "@/services/fetchWithAuth";

const symfonyUrl = process.env.SYMFONY_URL;

const roleLabelMap: Record<string, string> = {
    admin: "Administrateur",
    member: "Membre",
};

export const fetchMembersFromGroup = async (groupId: number) => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/groups/${groupId}/members`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        if (!response || response.status !== 200) {
            throw new Error("Not Found");
        }

        const members = response.data;

        return members.map((member: any) => ({
            ...member,
            roleLabel: roleLabelMap[member.groupRole] ?? member.groupRole
        }));
    } catch (error) {
        return [];
    }
};
