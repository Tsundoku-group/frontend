'use server';

import {symfonyUrl} from "@/constants/symfonyUrl";
import {fetchWithAuth} from "@/services/fetchWithAuth";

export const fetchBooksLists = async () => {
    let url = `${symfonyUrl}/api/v1/bookslist/1`;

    const response = await fetchWithAuth(
        url,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        }
    );

    return response.data
}