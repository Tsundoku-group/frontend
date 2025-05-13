'use client';

import React, {useCallback, useEffect, useState} from "react";
import {ArrowDownUp} from "lucide-react";
import {BooksList} from "@/models/BooksList";
import {fetchBooksLists} from "@/server-actions/main/shelves/action";
import {useProfileContext} from "@/context/profileContext";
import {formatDate} from "@/utils/dateUtils";

const ShelvesPages = () => {
    const [booksLists, setBooksLists] = useState<BooksList[]>([]);

    const {activeProfileInStorage} = useProfileContext();
    const profileId = activeProfileInStorage?.id;

    const loadBooksLists = useCallback(async () => {
        try {
            const data = await fetchBooksLists()
            console.log("data", data)
            setBooksLists(data || []);
        } catch (error) {
            setBooksLists([]);
            console.error(error);
        }
    }, []);

    useEffect(() => {
        if (profileId) {
            loadBooksLists().catch((error) => {
                console.log(error);
            })
        }
    }, [profileId, loadBooksLists]);

    const tableHeaders: { label: string, field: string }[] = [
        {label: "Nom", field: "name"},
        {label: "Volume", field: "bookCount"},
        {label: "Date de création", field: "createdAt"},
        {label: "Dernière édition", field: "updatedAt"}
    ];

    return (
        <div className="grid grid-cols-12 grid-rows-[auto,1fr] gap-8 pt-8">
            <div className="col-span-full">
                <h2>Etagères</h2>
            </div>

            <div className="col-span-full">
                <table className="p-5 w-full border-collapse">
                    <thead>
                    <tr>
                        <th>Favorite</th>
                        <th>Cover</th>
                        {tableHeaders.map((header, index) => (
                            <th key={index}>
                                        <span
                                            className="cursor-pointer inline-flex items-center whitespace-nowrap ml-2">
                                            {header.label}
                                            <ArrowDownUp width={20} height={20} className="ml-2"/>
                                        </span>
                            </th>
                        ))}
                        <th>Action</th>
                    </tr>
                    </thead>

                    <tbody>
                    {booksLists.length > 0 ? (
                        booksLists.map((booksList: BooksList) => (
                            <tr key={booksList.id}>
                                <td>{booksList.favorite}</td>
                                <td>{booksList.profile}</td>
                                <td>{booksList.title}</td>
                                <td></td>
                                <td>{formatDate(booksList.createdAt)}</td>
                                <td>{formatDate(booksList.updatedAt)}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5} className="text-center py-5">
                                Aucune étagère trouvé.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ShelvesPages;
