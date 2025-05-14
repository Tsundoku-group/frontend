import {Input} from "@/components/ui/input";
import {Select, SelectTrigger, SelectValue, SelectContent, SelectItem} from "@/components/ui/select";
import {useQuery} from "@tanstack/react-query";
import {Tag} from "@/models/Tag";
import {fetchAllTags} from "@/server-actions/main/groups/clubs/actions";
import {Card, CardContent} from "@/components/ui/card";
import {useState} from "react";
import FunnelFilled from "@/assets/icons/FunnelFilled";

interface SearchComponentProps {
    search: string;
    setSearch: (value: string) => void;
    tagName: string;
    setTagName: (value: string) => void;
    sort: string;
    setSort: (value: string) => void;
}

interface FetchAllTagsResponse {
    tags: Tag[];
    code: number;
    message: string;
}

export default function SearchComponent({
                                            search,
                                            setSearch,
                                            tagName,
                                            setTagName,
                                            sort,
                                            setSort
                                        }: SearchComponentProps) {
    const {data: tagsResponse, isLoading: tagsLoading} = useQuery<FetchAllTagsResponse, Error>({
        queryKey: ['tags'],
        queryFn: () => fetchAllTags(),
        staleTime: 60000,
    });

    const [open, setOpen] = useState(true);

    return (
        <>
            <button
                onClick={() => setOpen(!open)}
                className="left-4 z-10 bg-tertiary-black border border-secondary-black text-white rounded-xl px-3 py-1 flex items-center gap-2 text-sm shadow-md hover:bg-secondary-black transition"
            >
                <FunnelFilled className="w-4 h-4"/>
                {open ? "Masquer les filtres" : "Afficher les filtres"}
            </button>
            <Card
                className="relative bg-secondary-black border border-tertiary-black rounded-2xl shadow-lg w-full overflow-hidden transition-all duration-500 mb-4">
                {open && (
                    <CardContent className="pt-8">
                        <div className="flex flex-col md:flex-row items-center gap-4">
                            <div className="relative w-full md:w-1/3">
                                <Input
                                    placeholder="Rechercher un groupe..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10 py-2.5 bg-primary-black text-white placeholder-gray-400 border border-secondary-black rounded-xl focus:ring-2 focus:ring-purple-500"
                                />
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                            </div>
                            <Select value={tagName || "all"} onValueChange={setTagName}>
                                <SelectTrigger
                                    className="w-full md:w-1/4 bg-primary-black text-white border border-secondary-black rounded-xl px-4 py-2.5 hover:bg-tertiary-black focus:ring-2 focus:ring-purple-600">
                                    <SelectValue placeholder="📁 Catégorie"/>
                                </SelectTrigger>
                                <SelectContent
                                    className="bg-primary-black text-white border border-secondary-black rounded-xl shadow-xl">
                                    <SelectItem value="all" className="data-[highlighted]:bg-tertiary-black data-[highlighted]:text-white transition-colors duration-200">📂 Toutes les catégories</SelectItem>
                                    {!tagsLoading && tagsResponse?.tags?.map((tag) => (
                                        <SelectItem key={tag.slug} value={tag.slug} className="data-[highlighted]:bg-tertiary-black data-[highlighted]:text-white transition-colors duration-200">
                                            {tag.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={sort} onValueChange={setSort}>
                                <SelectTrigger
                                    className="w-full md:w-1/4 bg-primary-black text-white border border-secondary-black rounded-xl px-4 py-2.5 hover:bg-tertiary-black focus:ring-2 focus:ring-purple-600">
                                    <SelectValue placeholder="📅 Trier par"/>
                                </SelectTrigger>
                                <SelectContent
                                    className="bg-primary-black text-white border border-tertiary-black rounded-xl shadow-xl">
                                    <SelectItem
                                        value="newest"
                                        className="data-[highlighted]:bg-tertiary-black data-[highlighted]:text-white transition-colors duration-200"
                                    >
                                        📅 Plus récents
                                    </SelectItem>
                                    <SelectItem
                                        value="oldest"
                                        className="data-[highlighted]:bg-tertiary-black data-[highlighted]:text-white transition-colors duration-200">📅
                                        Plus anciens
                                    </SelectItem>
                                    <SelectItem
                                        value="members"
                                        className="data-[highlighted]:bg-tertiary-black data-[highlighted]:text-white transition-colors duration-200">👥
                                        Membres
                                    </SelectItem>
                                    <SelectItem
                                        value="active"
                                        className="data-[highlighted]:bg-tertiary-black data-[highlighted]:text-white transition-colors duration-200">🔥
                                        Actifs
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                )}
            </Card>
        </>
    );
}