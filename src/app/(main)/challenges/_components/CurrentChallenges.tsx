'use client'

import { Hourglass } from 'lucide-react'
import React from 'react'

export default function CurrentChallenges() {
    return (
        <div>
            <h2>Défis en cours</h2>
            {/* map des défis en cours */}
            <div>
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
        </div>
    )
}
