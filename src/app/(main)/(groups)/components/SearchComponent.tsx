import {Input} from "@/components/ui/input";
import {Select, SelectTrigger, SelectValue, SelectContent, SelectItem} from "@/components/ui/select";

interface SearchComponentProps {
    search: string;
    setSearch: (value: string) => void;
    tagName: string;
    setTagName: (value: string) => void;
    sort: string;
    setSort: (value: string) => void;
}

export default function SearchComponent({
                                            search,
                                            setSearch,
                                            tagName,
                                            setTagName,
                                            sort,
                                            setSort
                                        }: SearchComponentProps) {
    return (
        <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
            <Input
                placeholder="🔍 Rechercher un groupe..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full md:w-1/3"
            />

            <Select value={tagName || "all"} onValueChange={setTagName}>
                <SelectTrigger className="w-full md:w-1/4">
                    <SelectValue placeholder="📂 Toutes les catégories"/>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">📂 Toutes les catégories</SelectItem>
                    <SelectItem value="fantasy">🧙 Fantasy</SelectItem>
                    <SelectItem value="Science-Fiction">🚀 Science-Fiction</SelectItem>
                    <SelectItem value="poetry">📝 Poésie</SelectItem>
                </SelectContent>
            </Select>

            <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-full md:w-1/4">
                    <SelectValue placeholder="📅 Trier par"/>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="newest">📅 Plus récents</SelectItem>
                    <SelectItem value="members">👥 Nombre de membres</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}