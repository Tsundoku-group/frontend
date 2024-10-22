'use server';

import {jwtDecode} from "jwt-decode";

const symfonyUrl = process.env.SYMFONY_URL;

interface DecodedToken {
    exp: number;
}

export const refreshAuthToken = async (refreshToken: unknown): Promise<string | null> => {
    try {
        const response = await fetch(`${symfonyUrl}/api/token/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 'refresh_token': refreshToken })
        });

        const data = await response.json();
        return data.token;
    } catch (error) {
        return null;
    }
};


export const isTokenExpired = async (token: string): Promise<boolean> => {
    try {
        const decodedToken: DecodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        return decodedToken.exp <= currentTime;
    } catch (error) {
        console.error("Error decoding token:", error);
        return true;
    }
};