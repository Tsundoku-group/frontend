'use server'

import {fetchWithAuth} from "@/services/fetchWithAuth";

const symfonyUrl = process.env.SYMFONY_URL;

export async function fetchVerifyPwd(currentPassword: string) {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/users/password/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({currentPassword})
        });

        if (!response.response) {
            throw new Error("Erreur lors de la vérification du mot de passe.");
        }

        return response;
    } catch (error) {
        throw error;
    }
}

export async function fetchUpdatePwd({ newPassword, captchaToken }: { newPassword: string; captchaToken: string }) {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/users/password/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                newPassword: newPassword,
                captchaToken: captchaToken,
            })
        });

        if (!response.response) {
            throw new Error("Erreur lors de la vérification du nouveau mot de passe.")
        }

        return response;
    } catch (error) {
        throw error;
    }
}

export async function fetchDeletePwd(userId: string) {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/v1/users/${userId}/delete/request`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.response) {
            throw new Error("Erreur lors de la suppression du compte.")
        }

        return response;
    } catch (error) {
        throw error;
    }
}