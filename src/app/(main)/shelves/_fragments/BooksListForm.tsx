import {ArrowLeft} from "lucide-react";
import React from "react";
import {BooksList} from "@/models/BooksList";
import {createBooksList} from "@/server-actions/main/shelves/action";
import {useProfileContext} from "@/context/profileContext";

interface BooksListFormProps {
    setDisplayForm: (value: boolean) => void,
    booksList?: BooksList | undefined,
}

const BooksListForm: React.FC<BooksListFormProps> = ({setDisplayForm, booksList, bookslist}) => {
    const [title, setTitle] = React.useState(booksList?.title ?? "");
    const [visibility, setVisibility] = React.useState(booksList?.visibility ?? "private");

    console.log(booksList);

    const {activeProfileInStorage} = useProfileContext();
    const profileId: number = activeProfileInStorage?.id as number;

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        let response = await createBooksList(profileId, title, visibility);
        console.log(response);
    }

    return (
        <>
            <div className="col-span-full flex justify-between">
                <button
                    onClick={() => setDisplayForm(false)}
                    className="primary-btn flex items-center gap-5 py-5 px-5 rounded-full"
                >
                    <ArrowLeft width={20} height={20}/>
                    <span>Retour aux étagères</span>
                </button>
            </div>

            <form className="col-span-full flex flex-col gap-10" onSubmit={handleSubmit}>
                <div className="flex gap-10">
                    <div className="w-full">
                        <label htmlFor="title">Titre de l'étagère</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            className="w-full px-4 py-2 bg-secondary-black border border-tertiary-black rounded-3xl"
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                        />
                    </div>

                    <div className="w-1/4">
                        <label htmlFor="visibility">Visibilté</label>
                        <select
                            id="visibility"
                            name="visibility"
                            className="w-full px-4 py-2 bg-secondary-black border border-tertiary-black rounded-3xl leading-10 h-[42px]"
                            value={visibility}
                            onChange={(event) => setVisibility(event.target.value)}
                        >
                            <option value="private">Privé</option>
                            <option value="public">Public</option>
                        </select>
                    </div>
                </div>

                <div className="col-span-full">
                    <p>Liste des livres</p>
                </div>

                <div className="col-span-full flex justify-between">
                    <button
                        className="secondary-btn flex"
                        type="submit"
                    >
                        Créer
                    </button>
                </div>
            </form>
        </>
    )
}

export default BooksListForm;
