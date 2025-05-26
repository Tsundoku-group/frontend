import React, {useCallback, useEffect, useState} from "react";
import {BooksList} from "@/models/BooksList";
import {useProfileContext} from "@/context/profileContext";
import {deleteBooksList, fetchBooksLists, updateBooksList} from "@/server-actions/main/shelves/action";
import {ArrowDownUp, Pencil, Plus, Trash2} from "lucide-react";
import StarFilled from "@/assets/icons/StarFilled";
import {formatDate} from "@/utils/dateUtils";

interface BooksListTableProps {
    setDisplayForm: (value: boolean) => void;
    setBooksList: (value?: BooksList) => void;
}

const BooksListTable: React.FC<BooksListTableProps> = ({setDisplayForm, setBooksList}) => {
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

    const handleBooksListForm = (booksList?: BooksList) => {
        setBooksList(booksList)
        setDisplayForm(true);
    }

    const handleFavorite = async (booksList: BooksList) => {
        const index = booksLists.findIndex(list => list.id === booksList.id);
        let tempBooksLists = booksLists.slice();

        booksList.favorite = !booksList.favorite;
        booksList.profile = profileId;

        let response = await updateBooksList(booksList)

        if (response.status === 200) {
            tempBooksLists[index] = booksList
            setBooksLists(tempBooksLists)
        }
    }

    const handleDelete = async (booksList: BooksList) => {
        const index = booksLists.findIndex(list => list.id === booksList.id);
        let tempBooksLists = booksLists.toSpliced(index, 1);

        let response = await deleteBooksList(booksList);

        if(response.status === 204) {
            setBooksLists(tempBooksLists)
        }
    }

    const tableHeaders: { label: string, field: string }[] = [
        {label: "Nom", field: "name"},
        {label: "Volume", field: "bookCount"},
        {label: "Date de création", field: "createdAt"},
        {label: "Dernière édition", field: "updatedAt"}
    ];

    return (
        <>
            <div className="col-span-full flex justify-between">
                <h2>Etagères</h2>
                <button
                    onClick={() => handleBooksListForm()}
                    className="primary-btn flex items-center gap-5 py-5 px-5 rounded-full"
                >
                    <Plus width={20} height={20}/>
                    <span>Ajouter une étagère</span>
                </button>
            </div>

            <div className="col-span-full">
                <table className="p-5 w-full">
                    <thead>
                    <tr className="">
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
                                <td>
                                    <button onClick={() => handleFavorite(booksList)}>
                                        {booksList.favorite ? <StarFilled className="text-yellow-highlight"/> :
                                            <StarFilled className="text-primary"/>}
                                    </button>
                                </td>
                                <td></td>
                                <td>{booksList.title}</td>
                                <td></td>
                                <td>{formatDate(booksList.createdAt)}</td>
                                <td>{formatDate(booksList.updatedAt)}</td>
                                <td>
                                    <button onClick={() => handleBooksListForm(booksList)}>
                                        <Pencil width={15} height={15} />
                                    </button>

                                    <button
                                        onClick={() => handleDelete(booksList)}
                                    >
                                        <Trash2 width={15} height={15} className="text-red-highlight" />
                                    </button>
                                </td>
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
        </>
    )
}

export default BooksListTable;
