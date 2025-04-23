'use server';

import {fetchWithAuth} from "@/services/fetchWithAuth";
import { symfonyUrl } from "@/constants/symfonyUrl";

interface Friend {
    friendId: number;
    firstname: string;
    lastname: string;
    username: string;
    imageUrl?: string;
}

export async function fetchFriendsList(profileId: number): Promise<Friend[]> {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/friendships/${profileId}/list`, {
            method: 'GET',
        });

        if (200 === response.status) {
            return response.data.map((item: any) => item.friend);
        } else {
            return [];
        }
    } catch (error) {
        return [];
    }
}

export async function createFriendRequest(requesterUsername: string, receiverUsername: string) {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/friendships/request`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'requester-username': requesterUsername,
                'receiver-username': receiverUsername,
            }
        });

        if (response.status === 201) {
            return { success: true };
        }

        if (response.status === 409) {
            return { success: false, errorMessage: "Une demande d'ami existe déjà ou a déjà été envoyée." };
        }

        if (response.status === 404) {
            return { success: false, errorMessage: "Nous n'avons pas trouvé la personne que vous recherchez." };
        }

        return { success: false, errorMessage: "Erreur lors de la création de la demande d'ami." };

    } catch (error) {
        return { success: false, errorMessage: "Erreur lors de la création de la demande d'ami." };
    }
}