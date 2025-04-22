'use client'

import { Check, Plus, X } from 'lucide-react'
import React from 'react'

export default function ChallengesNotifications() {
    return (
        <>
            <span>Défis reçus</span>
            {/* map des défis reçus */}
            <div>
                {/* <Image de profil /> */}
                <div>
                    <span>Nom de l&apos;expéditeur te défie :</span>
                    <span>Nom du défi</span>
                </div>
                <div>
                    <button><Check /></button>
                    <button><X /></button>
                </div>
            </div>

            <span>Défis envoyés et en attente</span>
            {/* map des défis envoyés */}
            <div>
                {/* <Image de profil /> */}
                <div>
                    <span>Tu as défié Nom du destinataire :</span>
                    <span>Nom du défi</span>
                </div>
                <div>
                    <button>En attente</button>
                </div>
            </div>

            <button
                className="primary-btn flex items-center gap-5 py-5 px-5 rounded-full"
            >
                <Plus width={20} height={20} />
                <span>Nouveau défi</span>
            </button>

        </>
    )
}
