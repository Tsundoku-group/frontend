import {Input} from "@/components/ui/input";
import {Select, SelectTrigger, SelectValue, SelectContent, SelectItem} from "@/components/ui/select";
import {useQuery} from "@tanstack/react-query";
import {Tag} from "@/models/Tag";
import {fetchAllTags} from "@/server-actions/main/groups/clubs/actions";

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
    const { data: tagsResponse, isLoading: tagsLoading } = useQuery<FetchAllTagsResponse, Error>({
        queryKey: ['tags'],
        queryFn: () => fetchAllTags(),
        staleTime: 60000,
    });

    return (
        <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
            <div className="relative w-full md:w-1/3">
                <Input
                    placeholder="Rechercher un groupe..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 py-2 bg-[#1E1E1E] text-white placeholder-gray-400 border border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-600"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  🔍
                </span>
            </div>

            <Select value={tagName || "all"} onValueChange={setTagName}>
                <SelectTrigger
                    className="w-full md:w-1/4 bg-[#1E1E1E] text-white border border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-600">
                    <SelectValue placeholder="📂 Toutes les catégories"/>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">📂 Toutes les catégories</SelectItem>
                    {!tagsLoading && tagsResponse?.tags?.map((tag) => (
                        <SelectItem key={tag.slug} value={tag.slug}>
                            {tag.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select value={sort} onValueChange={setSort}>
                <SelectTrigger
                    className="w-full md:w-1/4 bg-[#1E1E1E] text-white border border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-600">
                    <SelectValue placeholder="📅 Trier par"/>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="newest">📅 Plus récents</SelectItem>
                    <SelectItem value="oldest">📅 Plus anciens</SelectItem>
                    <SelectItem value="members">👥 Nombre de membres</SelectItem>
                    <SelectItem value="active">🔥 Actif</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}