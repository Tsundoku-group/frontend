'use client'

import React, { useEffect, useState } from 'react'
import BadgesHistory from './_components/BadgesHistory'
import ChallengesNotifications from './_components/ChallengesNotifications'
import BadgesShowcase from './_components/BadgesShowcase'
import ChallengesStatistics from './_components/ChallengesStatistics'
import ChallengesList from './_components/ChallengesList'
import { Challenge } from '@/models/Challenge'
import { useProfileContext } from '@/context/profileContext'
import { fetchProfileActiveChallenges } from '@/server-actions/main/challenges/challenges/actions'

export default function ChallengesPage() {
    const [activeChallenges, setActiveChallenges] = useState<Challenge[]>([])

    const { activeProfileInStorage } = useProfileContext();
    const profileId = activeProfileInStorage?.id;

    const loadActiveChallenges = React.useCallback(async () => {
        if (!profileId) {
            setActiveChallenges([]);
            return;
        }

        try {
            const challenges = await fetchProfileActiveChallenges(profileId);
            setActiveChallenges(challenges ?? []);
        } catch (error) {
            console.error('Erreur lors du chargement des défis en cours :', error);
            setActiveChallenges([]);
        }
    }, [profileId]);

    useEffect(() => {
        loadActiveChallenges();
    }, [loadActiveChallenges]);

    return (
        <>
            <div className='grid grid-cols-12 gap-4 mt-[8em] mb-6'>
                <BadgesHistory />
                <ChallengesNotifications />
                <div className='col-span-5 flex flex-col gap-4 w-full'>
                    <BadgesShowcase />
                    <ChallengesStatistics />
                </div>
            </div>

            <div className="grid gap-5">
                <div className="grid gap-5">
                    <h2>Défis en cours</h2>
                    <ChallengesList
                        challenges={activeChallenges}
                    />
                </div>

                <div className="grid gap-5">
                    <h2>Défis archivés</h2>
                    {/* <ChallengesList /> */}
                </div>
            </div>
        </>
    )
}
