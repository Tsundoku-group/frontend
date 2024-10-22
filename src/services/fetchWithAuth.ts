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
    let token: unknown = session?.token;

    if (token) {
        const expirationTime = getExpirationTime(token as string);
        if (Date.now() >= expirationTime) {
            const newToken = await refreshAuthToken(session?.refreshToken);
            if (newToken) {
                token = newToken;
                cachedToken = { token: newToken, expirationTime: getExpirationTime(newToken) };
            }
        } else {
            cachedToken = { token: token as string, expirationTime };
        }
    }

    return token;
}

export async function fetchWithAuth(url: string, options: FetchOptions = {}) {
    const token = await getToken();
    const headers: { [key: string]: string } = {
        'Content-Type': 'application/json',
        ...options.headers,
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const config: RequestInit = { ...options, headers };

    try {
        const response = await fetch(url, config);
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