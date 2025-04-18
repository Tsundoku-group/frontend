'use client';

import { useEffect, useState } from "react";
import GroupHeader from "@/app/(main)/(groups)/clubs/[slug]/_components/GroupHeader";
import { fetchGroupBySlug } from "@/server-actions/main/groups/clubs/actions";
import {GroupData} from "@/models/GroupData";
import GroupTabs from "@/app/(main)/(groups)/clubs/[slug]/_components/GroupTabs";

type Props = {
    params: {
        slug: string;
    }
};

export default function GroupPage({ params: {slug} }: Props) {
    const [group, setGroup] = useState<GroupData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadGroup = async () => {
            try {
                const data = await fetchGroupBySlug(slug);

                if (!data.group) {
                    setError(data.message);
                } else {
                    setGroup(data.group);
                }
            } catch (err) {
                setError("Erreur lors du chargement");
            } finally {
                setLoading(false);
            }
        };

        loadGroup();
    }, [slug]);

    if (loading) return <div className="text-white">Chargement...</div>;
    if (error || !group) return <div className="text-red-500">{error ?? "Groupe introuvable"}</div>;

    return (
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            <div className="col-span-full">
                <GroupHeader
                    name={group.name}
                    visibility={group.visibility}
                    membersCount={group.membersCount}
                    imageUrl={group.imageUrl}
                    membersPreview={group.membersPreview}
                    tags={group.tags}
                />
                <GroupTabs group={group} isLoading={loading} isError={!!error} />
            </div>

            <div className="lg:col-span-2"></div>
            <div className="hidden lg:block">{/* sidebar */}</div>
        </div>
    );
}