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

export const updateBooksList = async (booksList: BooksList) => {
    let url = `${symfonyUrl}/api/v1/bookslist/${booksList.id}`;

    const response = await fetchWithAuth(
        url,
        {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(booksList)
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
            body: JSON.stringify({profile: profileId, title: title, visibility: visibility, favorite: false}),
        }
    );

    return response
}

export const deleteBooksList = async (booksList: BooksList) => {
    let url = `${symfonyUrl}/api/v1/bookslist/${booksList.id}`;

    const response = await fetchWithAuth(
        url,
        {
            method: "DELETE",
            headers: {"Content-Type": "application/json"}
        }
    );

    return response
}
