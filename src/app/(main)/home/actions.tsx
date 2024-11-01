"use server"

import { fetchWithAuth } from '@/services/fetchWithAuth';

const symfonyUrl = process.env.SYMFONY_URL;

export const fetchLatestReleases = async (limit: number = 40) => {
    limit = Math.min(limit, 40);

    try {
        const response = await fetchWithAuth(`${symfonyUrl}/api/latest-releases?limit=${limit}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = response.data;

        if (!data) {
            console.error('HTTP error', response.status);
            throw new Error('Échec lors de la récupération des informations des dernières sorties.');
        }
        return data;
    } catch (error: any) {
        return [];
    }
};