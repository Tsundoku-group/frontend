'use client'

import React from 'react'
import BadgesHistory from './_components/BadgesHistory'
import ChallengesNotifications from './_components/ChallengesNotifications'
import BadgesShowcase from './_components/BadgesShowcase'
import ChallengesStatistics from './_components/ChallengesStatistics'
import CurrentChallenges from './_components/CurrentChallenges'
import ArchivedChallenges from './_components/ArchivedChallenges'

export default function ChallengesPage() {
    return (
        <>
            <div className='grid grid-cols-12 gap-4 mt-6 mb-6'>
                <BadgesHistory />
                <ChallengesNotifications />
                <div className='col-span-6 flex flex-col gap-4 w-full'>
                    <BadgesShowcase />
                    <ChallengesStatistics />
                </div>
            </div>

            <CurrentChallenges />
            <ArchivedChallenges />
        </>
    )
}
