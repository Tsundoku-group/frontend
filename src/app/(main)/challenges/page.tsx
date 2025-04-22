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
            <div>
                <BadgesHistory />
                <ChallengesNotifications />
                <div>
                    <BadgesShowcase />
                    <ChallengesStatistics />
                </div>
            </div>

            <CurrentChallenges />
            <ArchivedChallenges />
        </>
    )
}
