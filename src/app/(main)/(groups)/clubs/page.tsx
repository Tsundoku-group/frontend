"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { fetchPrivateGroups } from "@/app/(main)/(groups)/clubs/actions";
import { Skeleton } from "@/components/ui/skeleton";
import GroupCard from "@/app/(main)/(groups)/components/GroupCard";
import SearchComponent from "@/app/(main)/(groups)/components/SearchComponent";
import { GroupData } from "@/models/GroupData";

export default function ClubsPage() {
    const [search, setSearch] = useState("");
    const [tagName, setTagName] = useState("all");
    const [sort, setSort] = useState("newest");
    const [page, setPage] = useState(1);
    const limit = 20;

    const { data, isLoading } = useQuery<{ groups: GroupData[], nextPage: number | null }>({
        queryKey: ["privateGroups", search, tagName, sort, page],
        queryFn: () => fetchPrivateGroups(search, tagName, sort, page, limit),
        staleTime: 60000,
    });

    const groups = data?.groups || [];
    const nextPage = data?.nextPage || null;

    return (
        <div className="w-full max-w-5xl mx-auto py-6">
            <SearchComponent
                search={search}
                setSearch={setSearch}
                tagName={tagName}
                setTagName={setTagName}
                sort={sort}
                setSort={setSort}
            />

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="h-40 w-full bg-gray-600" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groups.length > 0 ? (
                        groups.map((group) => (
                            <GroupCard
                                key={group.id}
                                group={{
                                    id: group.id,
                                    name: group.name,
                                    description: group.description || "",
                                    members: group.membersCount,
                                    imageUrl: group.imageUrl || "/default-image.png",
                                    status: "joinable",
                                }}
                            />
                        ))
                    ) : (
                        <p className="text-gray-400 text-center col-span-3">Aucun groupe trouvé.</p>
                    )}
                </div>
            )}

            {nextPage && (
                <button
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
                    onClick={() => setPage((prev) => prev + 1)}
                >
                    Charger plus
                </button>
            )}
        </div>
    );
}