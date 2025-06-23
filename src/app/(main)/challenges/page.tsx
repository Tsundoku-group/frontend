'use client'

import React, { useEffect, useMemo, useState } from 'react'
import BadgesHistory from './_components/BadgesHistory'
import ChallengesNotifications from './_components/ChallengesNotifications'
import BadgesShowcase from './_components/BadgesShowcase'
import ChallengesStatistics, { ChallengeStats } from './_components/ChallengesStatistics'
import ChallengesList from './_components/ChallengesList'
import { Challenge } from '@/models/Challenge'
import { useProfileContext } from '@/context/profileContext'
import { fetchProfileActiveChallenges, fetchProfileInactiveChallenges, PaginatedChallengesResponse } from '@/server-actions/main/challenges/challenges/actions'

export default function ChallengesPage() {
    const [activeChallenges, setActiveChallenges] = useState<Challenge[]>([]);
    const [inactiveChallenges, setInactiveChallenges] = useState<Challenge[]>([]);
    const [activePage, setActivePage] = useState<PaginatedChallengesResponse>();
    const [inactivePage, setInactivePage] = useState<PaginatedChallengesResponse>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { activeProfileInStorage } = useProfileContext();
    const profileId = activeProfileInStorage?.id;

    useEffect(() => {
        if (!profileId) return;

        setLoading(true);
        setError(null);

        Promise.all([
            fetchProfileActiveChallenges(profileId, 0, 5),
            fetchProfileInactiveChallenges(profileId, 0, 5)
        ]).then(([active, inactive]) => {
            setActivePage(active)
            setInactivePage(inactive)
            setActiveChallenges(active.data);
            setInactiveChallenges(inactive.data);
        }).catch(error => {
            console.error('Error fetching challenges:', error);
            setError('Erreur lors du chargement des défis');
        })
        .finally(() => {
            setLoading(false);
        });
    }, [profileId])

    const stats: ChallengeStats = useMemo(() => {
        const acceptedCount = activeChallenges.length;
        const successCount = inactiveChallenges.filter(c => c.status === 'success').length;
        const failedCount = inactiveChallenges.filter(c => c.status === 'failed').length;
        const allChallenges = [...activeChallenges, ...inactiveChallenges];
        const createdCount = allChallenges.filter(c => c.creator.id === profileId).length

        const completedChallenges = successCount + failedCount;
        const successRate = completedChallenges > 0
            ? Math.round((successCount / completedChallenges) * 100)
            : 0

        return {
            acceptedCount: acceptedCount,
            successRate,
            createdCount,
            badgesCount: successCount,
        }
    }, [activeChallenges, inactiveChallenges, profileId])

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <div className="text-lg">Chargement des défis...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <div className="text-lg text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <>
            <div className='grid grid-cols-12 gap-4 mt-[8em] mb-6'>
                <BadgesHistory />
                <ChallengesNotifications />
                <div className='col-span-5 flex flex-col gap-4 w-full'>
                    <BadgesShowcase />
                    <ChallengesStatistics {...stats} />
                </div>
            </div>

            <div className="grid gap-5">
                <div className="grid gap-5">
                    <h2>Défis en cours</h2>
                    {activePage ? (
                        activePage.data.length > 0 ? (
                            <ChallengesList
                                initialData={activePage}
                                fetchPage={fetchProfileActiveChallenges}
                                onRemove={() => {/* … */ }}
                            />
                        ) : (
                            <div className="text-text-white text-center py-8">
                                Aucun défi en cours
                            </div>
                        )
                    ) : null}
                </div>

                <div className="grid gap-5">
                    <h2>Défis archivés</h2>
                    {inactivePage ? (
                        inactivePage.data.length > 0 ? (
                            <ChallengesList
                                initialData={inactivePage}
                                fetchPage={fetchProfileInactiveChallenges}
                                onRemove={() => {/* … */ }}
                            />
                        ) : (
                            <div className="text-text-white text-center py-8">
                                Aucun défi archivé
                            </div>
                        )
                    ) : null}
                </div>
            </div>
        </>
    )
}
