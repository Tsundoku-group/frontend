'use client';

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { GroupData } from "@/models/GroupData";

interface GroupAboutSectionProps {
    group: GroupData | null;
    isLoading: boolean;
    isError: boolean;
}

export default function GroupAboutContent({ group, isLoading, isError }: GroupAboutSectionProps) {
    if (isLoading) {
        return (
            <div className="space-y-3">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </div>
        );
    }

    if (isError || !group) {
        return <p className="text-red-500">Impossible de charger les infos du groupe.</p>;
    }

    const {
        description,
        createdAt,
        membersCount,
        rules = [],
        activities = [],
        whoCanJoin,
        createdBy,
        externalLinks = [],
        visibility
    } = group;

    return (
        <Card className="bg-tertiary-black border-none p-6">
            <div className="text-white space-y-4">
                <h2 className="text-xl font-bold">À propos du groupe</h2>

                {description && (
                    <section>
                        <h3 className="font-semibold text-lg mb-1">🎯 Objectif</h3>
                        <p className="text-gray-300">{description}</p>
                    </section>
                )}

                {whoCanJoin && (
                    <section>
                        <h3 className="font-semibold text-lg mb-1">👥 Qui peut rejoindre ?</h3>
                        <p className="text-gray-300">{whoCanJoin}</p>
                    </section>
                )}

                {activities.length > 0 && (
                    <section>
                        <h3 className="font-semibold text-lg mb-1">📌 Activités</h3>
                        <ul className="list-disc list-inside text-gray-300">
                            {activities.map((activity, index) => (
                                <li key={index}>{activity}</li>
                            ))}
                        </ul>
                    </section>
                )}

                {rules.length > 0 && (
                    <section>
                        <h3 className="font-semibold text-lg mb-1">🧾 Règles</h3>
                        <ul className="list-disc list-inside text-gray-300">
                            {rules.map((rule, index) => (
                                <li key={index}>{rule}</li>
                            ))}
                        </ul>
                    </section>
                )}

                <section className="text-sm text-gray-400 space-y-1">
                    <p><strong>Accès :</strong> {visibility === 'public' ? 'Public' : 'Privé'}</p>
                    <p><strong>Créé le :</strong> {new Date(createdAt.date).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                    })}</p>
                    {createdBy && (
                        <p><strong>Créé par :</strong> {createdBy.username}</p>
                    )}
                    <p><strong>Membres :</strong> {membersCount}</p>
                    {externalLinks.length > 0 && (
                        <p>
                            <strong>Liens :</strong>{' '}
                            {externalLinks.map((link, index) => (
                                <a
                                    key={index}
                                    href={link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 underline ml-1"
                                >
                                    {link}
                                </a>
                            ))}
                        </p>
                    )}
                </section>
            </div>
        </Card>
    );
}