import { isTokenExpired, refreshAuthToken } from "@/services/refreshService";
import { getSession } from "@/app/_lib/session";

interface FetchOptions extends RequestInit {
    headers?: {
        [key: string]: string;
    };
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

const cache = new Map();

export async function fetchWithAuth(url: string, options: FetchOptions = {}) {
    const cacheKey = url;

    if (cache.has(cacheKey)) {
        const cachedEntry = cache.get(cacheKey);
        const { data, timestamp } = cachedEntry;

        if (Date.now() - timestamp < 5 * 60 * 1000) {
            return { response: true, status: 200, data };
        }
    }

    const token = await getToken();
    const headers: { [key: string]: string } = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
        ...options,
        headers,
    };

    const response = await fetch(url, config);
    const responseData = await response.text();

    if (!response.ok) {
        return {
            response: false,
            status: response.status,
            message: response.statusText,
            error: responseData || 'Unknown error occurred'
        };
    }

    try {
        const data = JSON.parse(responseData);

        cache.set(cacheKey, { data, timestamp: Date.now() });
        return { response: true, status: response.status, data };
    } catch (error) {
        return { response: true, status: response.status, data: responseData };
    }
}