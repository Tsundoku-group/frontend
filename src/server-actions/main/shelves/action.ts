'use server';

import {symfonyUrl} from "@/constants/symfonyUrl";
import {fetchWithAuth} from "@/services/fetchWithAuth";
import {BooksList} from "@/models/BooksList";

export const fetchBooksLists = async (profileId: number | undefined) => {
    let url = `${symfonyUrl}/api/v1/bookslist/${profileId}`;

    try {
        const response = await fetchWithAuth(
            url,
            {
                method: "GET",
                headers: {"Content-Type": "application/json"}
            }
        );

        if (response.status !== 200) {
            return []
        }

        return response.data;

    } catch (error) {
        return []
    }
}

export const createBooksList = async (profileId: number, title: string, visibility: string) => {
    let url = `${symfonyUrl}/api/v1/bookslist`;

    try {
        const response = await fetchWithAuth(
            url,
            {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({profile: profileId, title: title, visibility: visibility, favorite: false}),
            }
        );

        if (response.status !== 201) {
            return {success: false, message: response.data.error}
        }

        return {success: true, message: "Etagère créer", data: response.data}
    } catch(error) {
        return {success: false, message: error.message}
    }
}

export const updateBooksList = async (booksList: BooksList) => {
    let url = `${symfonyUrl}/api/v1/bookslist/${booksList.id}`;

    try {
        const response = await fetchWithAuth(
            url,
            {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(booksList)
            }
        );

        if (response.status !== 200) {
            return {success: false, message: response.data.error}
        }

        return {success: true, message: "Etagère éditer", data: response.data}
    } catch(error) {
        return {success: false, message: error.message}
    }
}

export const deleteBooksList = async (booksList: BooksList) => {
    let url = `${symfonyUrl}/api/v1/bookslist/${booksList.id}`;

    try {
        const response = await fetchWithAuth(
            url,
            {
                method: "DELETE",
                headers: {"Content-Type": "application/json"}
            }
        );

        if (response.status !== 204) {
            return {success: false, message: response.data.error}
        }

        return {success: true, message: "Etagère supprimer", data: response.data}
    } catch(error) {
        return {success: false, message: error.message}
    }
}
