'use client'

import { Check, Plus, X } from 'lucide-react'
import React from 'react'
import ChallengesCreationForm from './ChallengesCreationForm';

export default function ChallengesNotifications() {
    const [isChallengesCreationFormOpen, setIsChallengesCreationFormOpen] = React.useState(false);

    return (
        <>
            <div className="col-span-4 bg-secondary-black text-text-white p-4 rounded-lg flex flex-col gap-4 border border-tertiary-black">
                <h2>Défis reçus</h2>
                {/* map des défis reçus */}
                <div className="flex justify-between items-center">
                    {/* <Image de profil /> */}
                    <div className="grid">
                        <span><b className="text-green-highlight">Nom de l&apos;expéditeur</b> te défie : </span>
                        <span>Nom du défi</span>
                    </div>
                    <div className="flex gap-2">
                        <button className="bg-green-highlight p-[0.3em] rounded-xl hover:bg-[var(--hover-highlight-green)] transition-colors duration-[400ms] ease"><Check /></button>
                        <button className="bg-tertiary-black p-[0.3em] rounded-xl hover:bg-primary-black transition-colors duration-[400ms] ease"><X /></button>
                    </div>
                </div>

                <h2>Défis envoyés et en attente</h2>
                {/* map des défis envoyés */}
                <div className="flex justify-between items-center">
                    {/* <Image de profil /> */}
                    <div className="grid">
                        <span>Tu as défié <b className="text-green-highlight">Nom du destinataire</b> :</span>
                        <span>Nom du défi</span>
                    </div>
                    <div>
                        <button className="bg-tertiary-black p-[0.3em] rounded-xl hover:bg-primary-black transition-colors duration-[400ms] ease"><X /></button>
                    </div>
                </div>

                <button
                    className="primary-btn w-fit flex items-center gap-3 py-5 px-5 rounded-xl self-center"
                    onClick={() => setIsChallengesCreationFormOpen(true)}
                >
                    <Plus width={20} height={20} />
                    <span>Nouveau défi</span>
                </button>
            </div>

            {
                isChallengesCreationFormOpen && (
                    <ChallengesCreationForm 
                        onClose={() => setIsChallengesCreationFormOpen(false)} 
                    />
                )
            }
        </>
    )
}
