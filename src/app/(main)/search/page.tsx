'use client';

import React, {Suspense, useState} from "react";
import {useSearchParams} from "next/navigation";
import SearchBar from "@/app/(main)/search/_components/searchBar/SearchBar";
import SearchResult from "@/app/(main)/search/_components/searchResult/SearchResult";

const SearchPage = () => {
    const searchParams = useSearchParams()
    const [search, setSearch] = useState<string>(searchParams.get('term') ?? '');

    return (
        <div className="grid grid-cols-12 grid-rows-[auto,1fr] gap-8 pt-8">
            <div className="col-span-full">
                <SearchBar search={search} setSearch={setSearch}/>
            </div>

            <Suspense fallback={<div>Chargement des résultats...</div>}>
                <div className="col-span-full overflow-y-scroll">
                    <SearchResult search={search}/>
                </div>
            </Suspense>
        </div>
    )
}

export default SearchPage;
