'use client';

import {useState} from "react";
import BooksListTable from "./_fragments/BooksListTable";
import BooksListForm from "./_fragments/BooksListForm";
import {BooksList} from "@/models/BooksList";

const ShelvesPages = () => {
    const [displayForm, setDisplayForm] = useState(false);
    const [booksList, setBooksList] = useState<BooksList>();

    return (
        <div className="grid grid-cols-12 grid-rows-[auto,1fr] gap-8 pt-8">
            {displayForm ? (
                <BooksListForm setDisplayForm={setDisplayForm} booksList={booksList} />
            ) : (
                <BooksListTable setDisplayForm={setDisplayForm} setBooksList={setBooksList}/>
            )}
        </div>
    )
}

export default ShelvesPages;
