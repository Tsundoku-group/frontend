'use server'

import {fetchWithAuth} from "@/services/fetchWithAuth";
import { symfonyUrl } from "@/constants/symfonyUrl";

type UserProfile = {
    id: number;
    username: string;
    activeProfile: boolean;
};

export const fetchUserProfiles = async (
    userId: number
): Promise<{
    success: boolean;
    code: number;
    message: string;
    profiles: UserProfile[];
}> => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/profile/${userId}/all`, {
            method: 'GET',
        });

        if (!response.response || response.status !== 200) {
            return {
                success: false,
                code: response?.status || 500,
                message: 'Impossible de récupérer les profils',
                profiles: [],
            };
        }

        return {
            success: true,
            code: 200,
            message: 'Profils récupérés',
            profiles: Array.isArray(response.data?.profiles) ? response.data.profiles : [],
        };
    } catch (error: any) {
        return {
            success: false,
            code: 500,
            message: error?.message || 'Erreur serveur inattendue',
            profiles: [],
        };
    }
};

export const setUserProfileStatus = async (
    profileId: number,
    status: string
): Promise<{
    success: boolean;
    code: number;
    message: string;
}> => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/profile/${profileId}/update/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status }),
        });

        if (!response.response || response.status !== 200) {
            return {
                success: false,
                code: response?.status || 500,
                message: response?.message || 'Impossible de mettre à jour le statut.',
            };
        }

        return {
            success: true,
            code: 200,
            message: 'Statut mis à jour avec succès.',
        };
    } catch (error: any) {
        return {
            success: false,
            code: 500,
            message: error?.message || 'Erreur réseau ou inconnue.',
        };
    }
};

export const setActiveUserProfile = async (
    id: number,
    profileId: number
): Promise<{
    success: boolean;
    code: number;
    message: string;
    data?: any;
}> => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/profile/active`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id,
                profileId,
            }),
        });

        if (!response.response || response.status !== 200) {
            return {
                success: false,
                code: response?.status || 500,
                message: response?.message || "Impossible de définir le profil actif.",
            };
        }

        return {
            success: true,
            code: 200,
            message: "Profil actif mis à jour.",
            data: response.data,
        };
    } catch (error: any) {
        return {
            success: false,
            code: 500,
            message: error?.message || "Erreur serveur ou réseau.",
        };
    }
};

export const addNewUserProfile = async (
    payload: any
): Promise<{
    success: boolean;
    code: number;
    message: string;
    data?: any;
}> => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/profile/new`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.response || response.status !== 201 || !response.data) {
            return {
                success: false,
                code: response.status || 500,
                message:
                    response?.message ||
                    (response.status === 400
                        ? "Vous ne pouvez pas avoir plus de 5 profils"
                        : "Une erreur est survenue lors de la création du profil."),
            };
        }

        return {
            success: true,
            code: 201,
            message: "Profil créé avec succès",
            data: response.data,
        };
    } catch (error: any) {
        return {
            success: false,
            code: 500,
            message: error?.message || "Erreur réseau ou serveur",
        };
    }
};

export const fetchNotifications = async (
    profileId: number
): Promise<{
    success: boolean;
    code: number;
    message: string;
    data: any[];
}> => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/notification/${profileId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.response || response.status !== 200) {
            return {
                success: false,
                code: response.status || 500,
                message: response?.message || "Erreur lors de la récupération des notifications",
                data: [],
            };
        }

        const notifications = response?.data?.notifications;
        return {
            success: true,
            code: 200,
            message: "Notifications récupérées avec succès",
            data: Array.isArray(notifications) ? notifications : [],
        };
    } catch (error: any) {
        return {
            success: false,
            code: 500,
            message: error?.message || "Erreur réseau ou serveur",
            data: [],
        };
    }
};

export const markAsReadNotifications = async (
    profileId: number
): Promise<{
    success: boolean;
    code: number;
    message: string;
}> => {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/notification/${profileId}/read`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.response || response.status !== 200) {
            return {
                success: false,
                code: response.status || 500,
                message: response?.message || "Impossible de marquer les notifications comme lues",
            };
        }

        return {
            success: true,
            code: 200,
            message: "Notifications marquées comme lues",
        };
    } catch (error: any) {
        return {
            success: false,
            code: 500,
            message: error?.message || "Erreur réseau ou serveur",
        };
    }
};