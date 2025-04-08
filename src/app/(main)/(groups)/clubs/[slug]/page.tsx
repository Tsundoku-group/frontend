import {fetchGroupBySlug} from "@/app/(main)/(groups)/clubs/actions";
import { useQuery } from "@tanstack/react-query";

export default function GroupPage({ params }: { params: { slug: string } }) {
    const { data: group, isLoading, error } = useQuery({
        queryKey: ["group", params.slug],
        queryFn: () => fetchGroupBySlug(params.slug),
    });

    if (isLoading) return <p>Chargement...</p>;
    if (error || !group) return <p>Groupe introuvable</p>;

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold">{group.name}</h1>
            <p className="text-gray-500">{group.description}</p>
            <div className="mt-4">
                <h2 className="text-xl font-semibold">Tags</h2>
                <div className="flex gap-2 mt-2">
                    {group.tags.map((tag) => (
                        <span key={tag.slug} className="px-2 py-1 bg-gray-200 rounded">
                            {tag.name}
                        </span>
                    ))}
                </div>
            </div>

            <div className="mt-6">
                <h2 className="text-xl font-semibold">Membres ({group.membersCount})</h2>
                <div className="grid grid-cols-3 gap-4 mt-2">
                    {group.members.map((member) => (
                        <div key={member.id} className="flex items-center gap-2">
                            <img src={member.avatarUrl} alt={member.username} className="w-8 h-8 rounded-full" />
                            <span>{member.username}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Boutons de gestion */}
            <div className="mt-6">
                {group.isMember ? (
                    <button className="px-4 py-2 bg-red-500 text-white rounded">Quitter le groupe</button>
                ) : (
                    <button className="px-4 py-2 bg-green-500 text-white rounded">Rejoindre le groupe</button>
                )}
            </div>
        </div>
    );
}