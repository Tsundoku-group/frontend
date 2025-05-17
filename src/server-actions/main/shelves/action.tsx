'use server';

import {symfonyUrl} from "@/constants/symfonyUrl";
import {fetchWithAuth} from "@/services/fetchWithAuth";
import {BooksList} from "@/models/BooksList";

export const fetchBooksLists = async (profileId: number | undefined) => {
    let url = `${symfonyUrl}/api/v1/bookslist/${profileId}`;

    const response = await fetchWithAuth(
        url,
        {
            method: "GET",
            headers: {"Content-Type": "application/json"}
        }
    );

    return response.data
}

export const updateBooksLists = async (bookslist: BooksList) => {
    let url = `${symfonyUrl}/api/v1/bookslist/${bookslist.id}`;

    const response = await fetchWithAuth(
        url,
        {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(bookslist)
        }
    );

    return response
}
