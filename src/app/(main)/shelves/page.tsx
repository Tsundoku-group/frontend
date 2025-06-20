'use client';

import {useCallback, useEffect, useState} from "react";
import BooksListTable from "./_fragments/BooksListTable";
import BooksListForm from "./_fragments/BooksListForm";
import {BooksList} from "@/models/BooksList";
import {fetchBooksLists} from "@/server-actions/main/shelves/action";
import {useProfileContext} from "@/context/profileContext";

const ShelvesPages = () => {
    const [displayForm, setDisplayForm] = useState(false);
    const [booksList, setBooksList] = useState<BooksList>();
    const [booksLists, setBooksLists] = useState<BooksList[]>([]);

    const {activeProfileInStorage} = useProfileContext();
    const profileId: number = activeProfileInStorage?.id as number;

    const loadBooksLists = useCallback(async () => {
        try {
            const data = await fetchBooksLists(profileId)
            setBooksLists(data || []);
        } catch (error) {
            setBooksLists([]);
            console.error(error);
        }
    }, [profileId]);

    useEffect(() => {
        if (profileId) {
            loadBooksLists().catch((error) => {
                console.log(error);
            })
        }
    }, [profileId, loadBooksLists]);

    const handleFormClose = async () => {
        setDisplayForm(false);
        await loadBooksLists();
    }

    return (
        <div className="grid grid-cols-12 grid-rows-[auto,1fr] gap-8 pt-8">
            {displayForm ? (
                <BooksListForm setDisplayForm={setDisplayForm} booksList={booksList} onClose={handleFormClose} profileId={profileId}/>
            ) : (
                <BooksListTable setDisplayForm={setDisplayForm} setBooksList={setBooksList} booksLists={booksLists} setBooksLists={setBooksLists} profileId={profileId}/>
            )}
        </div>
    )
}

export default ShelvesPages;
