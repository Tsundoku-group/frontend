'use server';

import { jwtDecode } from "jwt-decode";
import {deleteSession, updateSessionTokens} from "@/services/auth/session";
import { symfonyUrl } from "@/constants/symfonyUrl";

interface DecodedToken {
    exp: number;
}

interface RefreshResponse {
    token: string;
    refresh_token?: string;
}

export const isTokenExpired = async (token: string): Promise<boolean> => {
    try {
        const decodedToken: DecodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        return decodedToken.exp <= currentTime;
    } catch (error) {
        console.error("❌ Error decoding token:", error);
        return true;
    }
};

export const refreshAuthToken = async (refreshToken: unknown): Promise<string | null> => {
    if (!refreshToken || typeof refreshToken !== 'string') {
        return null;
    }

    try {
        const response = await fetch(`${symfonyUrl}/api/token/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh_token: refreshToken }),
        });

        if (!response.ok) {
            await deleteSession();
            return null;
        }

        const data: RefreshResponse = await response.json();

        if (!data.token) {
            await deleteSession();
            return null;
        }

        await updateSessionTokens(data.token, data.refresh_token);

        return data.token;
    } catch (error) {
        return null;
    }
};

export const revokeRefreshToken = async (refreshToken: string) => {
    try {
        const res = await fetch(`${symfonyUrl}/api/logout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh_token: refreshToken }),
        });

        return await res.json();
    } catch (error) {
        console.error("❌ Failed to revoke refresh token", error);
    }
};