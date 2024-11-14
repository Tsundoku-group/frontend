'use server'

import {fetchWithAuth} from "@/services/fetchWithAuth";

const symfonyUrl = process.env.SYMFONY_URL;

export async function fetchVerifyPwd(currentPassword: string) {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/users/verify-password`, {
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

export async function fetchUpdatePwd(newPassword: string) {
    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/users/update-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({newPassword})
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
        const response = await fetchWithAuth(`${symfonyUrl}/api/users/delete-account`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.response) {
            throw new Error("Erreur lros de la suppression du compte.")
        }

        return response;
    } catch (error) {
        throw error;
    }
}