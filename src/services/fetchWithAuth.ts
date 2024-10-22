'use server'

import { isTokenExpired, refreshAuthToken } from "@/services/refreshService";
import { getSession } from "@/app/_lib/session";

interface FetchOptions extends RequestInit {
    headers?: { [key: string]: string };
}

let cachedToken: { token: string, expirationTime: number } | null = null;

function getExpirationTime(token: string): number {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000;
}

async function getToken() {
    if (cachedToken && Date.now() < cachedToken.expirationTime) {
        return cachedToken.token;
    }

    const session = await getSession();
    let token: string  = session?.token as string;

    if (token && await isTokenExpired(token)) {
        const newToken = await refreshAuthToken(session?.refreshToken);
        if (newToken) {
            token = newToken;
            const expirationTime = getExpirationTime(newToken);
            cachedToken = { token: newToken, expirationTime };
        }
    } else if (token) {
        const expirationTime = getExpirationTime(token);
        cachedToken = { token, expirationTime };
    }

    return token;
}

export async function fetchWithAuth(url: string, options: FetchOptions = {}) {
    const tokenStartTime = performance.now();
    const token = await getToken();
    const tokenEndTime = performance.now();
    console.log(`Token fetch took: ${tokenEndTime - tokenStartTime}ms`);

    const headers: { [key: string]: string } = {
        'Content-Type': 'application/json',
        ...options.headers,
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const config: RequestInit = { ...options, headers };

    try {
        const fetchStartTime = performance.now();
        const response = await fetch(url, config);
        const fetchEndTime = performance.now();
        console.log(`Fetch took: ${fetchEndTime - fetchStartTime}ms`);

        const responseData = await response.text();

        let data;
        try {
            data = JSON.parse(responseData);
        } catch {
            data = responseData;
        }

        return { response: true, status: response.status, data };

    } catch (error) {
        return {
            response: false,
            status: 500,
            message: 'Network error',
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}