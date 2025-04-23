'use client'

import { Hourglass, Plus } from 'lucide-react'
import React from 'react'

export default function ArchivedChallenges() {
    return (
        <>
            <h2>Défis archivés</h2>
            {/* map des défis en cours */}
            <div className="bg-secondary-black text-text-white p-4 rounded-lg flex flex-col gap-4 border border-tertiary-black">
                <span>Tag type de défi</span>
                {/* <Image du badge /> */}
                <h3>Nom du défi</h3>
                <span>Fin : date de fin</span>
                {/* participants */}
                <div>
                    <Hourglass />
                    <span>X jours</span>
                </div>
            </div>

            <button
                className="primary-btn flex items-center gap-5 py-5 px-5 rounded-full"
            >
                <Plus width={20} height={20} />
                <span>Afficher plus</span>
            </button>
        </>
    )
}
