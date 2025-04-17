"use client";

import {useQuery} from "@tanstack/react-query";
import {useState} from "react";
import {fetchPrivateGroups} from "@/app/(main)/(groups)/clubs/actions";
import {Skeleton} from "@/components/ui/skeleton";
import GroupCard from "@/app/(main)/(groups)/components/GroupCard";
import SearchComponent from "@/app/(main)/(groups)/components/SearchComponent";
import {GroupData} from "@/models/GroupData";
import {useProfileContext} from "@/context/profileContext";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Button} from "@/components/ui/button";

export default function ClubsPage() {
    const [search, setSearch] = useState("");
    const [tagName, setTagName] = useState("all");
    const [sort, setSort] = useState("newest");
    const [page, setPage] = useState(1);
    const limit = 20;

    const [activeTab, setActiveTab] = useState("all");

    const {activeProfileInStorage} = useProfileContext();
    const profileId = activeProfileInStorage?.id as number;

    const {data, isLoading} = useQuery<{ groups: GroupData[]; nextPage: number | null }>({
        queryKey: ["privateGroups", search, tagName, sort, page, activeTab],
        queryFn: () =>
            fetchPrivateGroups(
                search,
                tagName,
                sort,
                page,
                limit,
                profileId,
                activeTab === "mygroups"
            ),
        staleTime: 60000,
    });

    const groups = data?.groups || [];
    const nextPage = data?.nextPage || null;

    const allGroups = groups;
    const myGroups = groups.filter(
        (group) => group.joinStatus === "member" || group.joinStatus === "pending"
    );
    const favoriteGroups = groups.filter((group) => group.isFavorite);
    const pinnedGroups = groups.filter((group) => group.isPinned);

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

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="all">Tous les groupes</TabsTrigger>
                    <TabsTrigger value="mygroups">Mes groupes</TabsTrigger>
                    <TabsTrigger value="favorites">Favoris</TabsTrigger>
                    <TabsTrigger value="pinned">Épinglés</TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <Skeleton key={i} className="h-40 w-full bg-gray-600"/>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-5">
                            {allGroups.length > 0 ? (
                                allGroups.map((group) => (
                                    <GroupCard key={group.id}
                                               group={{
                                                   id: group.id,
                                                   name: group.name,
                                                   description: group.description || "",
                                                   membersCount: group.membersCount,
                                                   visibility: group.visibility,
                                                   imageUrl: group.imageUrl || "/default-image.png",
                                                   joinStatus: group.joinStatus,
                                                   createdAt: group.createdAt || "",
                                                   isFavorite: group.isFavorite,
                                                   slug: group.slug,
                                                   isPinned: group.isPinned,
                                                   tags: group.tags
                                               }}/>
                                ))
                            ) : (
                                <div className="text-gray-400 text-center col-span-3">Aucun groupe trouvé.</div>
                            )}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="mygroups">
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <Skeleton key={i} className="h-40 w-full bg-gray-600"/>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {myGroups.length > 0 ? (
                                myGroups.map((group) => (
                                    <GroupCard key={group.id} group={group}/>
                                ))
                            ) : (
                                <div className="text-gray-400 text-center col-span-3">Aucun groupe trouvé.</div>
                            )}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="favorites">
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <Skeleton key={i} className="h-40 w-full bg-gray-600"/>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {favoriteGroups.length > 0 ? (
                                favoriteGroups.map((group) => (
                                    <GroupCard key={group.id} group={group}/>
                                ))
                            ) : (
                                <div className="text-gray-400 text-center col-span-3">Aucun favori trouvé.</div>
                            )}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="pinned">
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <Skeleton key={i} className="h-40 w-full bg-gray-600"/>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {pinnedGroups.length > 0 ? (
                                pinnedGroups.map((group) => (
                                    <GroupCard key={group.id} group={group}/>
                                ))
                            ) : (
                                <div className="text-gray-400 text-center col-span-3">Aucun groupe épinglé.</div>
                            )}
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            {nextPage && (
                <Button
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
                    onClick={() => setPage((prev) => prev + 1)}
                >
                    Charger plus
                </Button>
            )}
        </div>
    );
}