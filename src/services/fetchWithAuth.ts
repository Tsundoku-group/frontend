import { isTokenExpired, refreshAuthToken } from "@/services/refreshService";
import { getSession } from "@/app/_lib/session";

interface FetchOptions extends RequestInit {
    headers?: { [key: string]: string };
}

async function getToken() {
    const session = await getSession();
    let token: unknown = session?.token;

    if (token && await isTokenExpired()) {
        const newToken = await refreshAuthToken(session?.refreshToken);
        if (newToken) {
            token = newToken;
        }
    }
    return token;
}

const cache = new Map<string, { data: any, timestamp: number }>();

function isCacheValid(timestamp: number, duration: number = 5 * 60 * 1000) {
    return Date.now() - timestamp < duration;
}

export async function fetchWithAuth(url: string, options: FetchOptions = {}) {
    const cacheKey = url;

    const cachedEntry = cache.get(cacheKey);
    if (cachedEntry && isCacheValid(cachedEntry.timestamp)) {
        return { response: true, status: 200, data: cachedEntry.data };
    }

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

        if (!response.ok) {
            return {
                response: false,
                status: response.status,
                message: response.statusText,
                error: responseData || 'Unknown error occurred',
            };
        }

        let data;
        try {
            data = JSON.parse(responseData);
        } catch {
            data = responseData;
        }

        cache.set(cacheKey, { data, timestamp: Date.now() });
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