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

export const updateBooksList = async (bookslist: BooksList) => {
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

export const createBooksList = async (profileId: number, title: string, visibility: string) => {
    let url = `${symfonyUrl}/api/v1/bookslist`;

    const response = await fetchWithAuth(
        url,
        {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({profileId: profileId, title: title, visibility: visibility, favorite: false}),
        }
    );

    return response
}
