'use client';

import React, { useEffect, useState } from "react";
import GroupHeader from "@/app/(main)/(groups)/clubs/[slug]/_components/GroupHeader";
import { fetchGroupBySlug } from "@/server-actions/main/groups/clubs/actions";
import {GroupData} from "@/models/GroupData";
import GroupTabs from "@/app/(main)/(groups)/clubs/[slug]/_components/GroupTabs";
import {Skeleton} from "@/components/ui/skeleton";

type Props = {
    params: {
        slug: string;
    }
};

export default function GroupPage({ params: {slug} }: Props) {
    const [group, setGroup] = useState<GroupData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
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
                setIsLoading(false);
            }
        };

        void loadGroup();
    }, [slug]);

    if (isLoading) {
        return (
            <div className="p-4 space-y-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="space-y-3">
                        <Skeleton className="h-6 w-1/3" />
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-32 w-full rounded-lg" />
                    </div>
                ))}
            </div>
        );
    }
    if (error || !group) return <div className="text-red-500">{error ?? "Groupe introuvable"}</div>;

    return (
        <div className="max-w-7xl pt-8 grid grid-cols-1 lg:grid-cols-3">
            <div className="col-span-full">
                <GroupHeader
                    name={group.name}
                    visibility={group.visibility}
                    membersCount={group.membersCount}
                    imageUrl={group.imageUrl}
                    membersPreview={group.membersPreview}
                    tags={group.tags}
                />
                <GroupTabs group={group} isLoading={isLoading} isError={!!error} />
            </div>

            <div className="lg:col-span-2"></div>
            <div className="hidden lg:block">{/* sidebar */}</div>
        </div>
    );
}