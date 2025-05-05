import React, {ReactElement, useState} from "react";
import {Search} from "lucide-react";
import {useRouter} from "next/navigation";

type Props = {
    search: string,
    setSearch: (search: string) => void
}

const SearchBar = ({search, setSearch}: Props): ReactElement => {
    const router = useRouter();
    const [text, setText] = useState<string>(search);

    return (
        <>
            <div className="flex items-center bg-gray-800 rounded-lg p-2">
                <input
                    type="text"
                    placeholder="Explorer"
                    className="bg-transparent focus:outline-none text-text-white w-full placeholder:text-gray-500"
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                />

                <button onClick={() => {
                    router.push('/search?term=' + text)
                    setSearch(text)
                }}>
                    <Search className="text-text-white"/>
                </button>
            </div>
        </>
    )
}

export default SearchBar;
