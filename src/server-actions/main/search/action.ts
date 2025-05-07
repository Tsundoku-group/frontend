'use server';

import {symfonyUrl} from "@/constants/symfonyUrl";
import {fetchWithAuth} from "@/services/fetchWithAuth";

export const fetchProfiles = async (
    search: string,
    page: number = 1,
    limit: number = 20
) => {
    let url: string = `${symfonyUrl}/api/v1/profiles`;
    let searchParam: string = `search=${encodeURIComponent(search)}`
    let pageParam: string = `page=${encodeURIComponent(page)}`
    let limitParam: string = `limit=${encodeURIComponent(limit)}`

    let fetchUrl: string = url + "?" + searchParam + "&" + pageParam + "&" + limitParam

    const response = await fetchWithAuth(
        fetchUrl,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        }
    );

    return response.data
}

export const fetchGroups = async (
    search: string,
    page: number = 1,
    limit: number = 20
) => {
    let url: string = `${symfonyUrl}/api/v1/groups`;
    let searchParam: string = `search=${encodeURIComponent(search)}`
    let pageParam: string = `page=${encodeURIComponent(page)}`
    let limitParam: string = `limit=${encodeURIComponent(limit)}`

    let fetchUrl: string = url + "?" + searchParam + "&" + pageParam + "&" + limitParam

    const response = await fetchWithAuth(
        fetchUrl,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        }
    );

    return response.data
}
