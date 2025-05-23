'use client'

import React from 'react'
import BadgesHistory from './_components/BadgesHistory'
import ChallengesNotifications from './_components/ChallengesNotifications'
import BadgesShowcase from './_components/BadgesShowcase'
import ChallengesStatistics from './_components/ChallengesStatistics'
import ChallengesList from './_components/ChallengesList'

export default function ChallengesPage() {
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
                    <ChallengesList />
                </div>

                <div className="grid gap-5">
                    <h2>Défis archivés</h2>
                    <ChallengesList />
                </div>
            </div>
        </>
    )
}
