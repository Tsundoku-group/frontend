'use client'

import { Hourglass, Plus } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

export default function ChallengesList() {
    return (

        <>
            <div className="grid grid-cols-5 gap-4">
                {/* Carte simplifiée sans composants internes */}
                <div className="relative rounded-lg overflow-hidden bg-secondary-black border border-tertiary-black shadow-md">
                    {/* Zone cover */}
                    <div className="w-full h-32 bg-gradient-to-br from-blue-400 to-purple-800" />

                    {/* Badge Personnalisé en absolute top-right */}
                    <div className="absolute top-4 right-4 z-20">
                        <span className="bg-text-white text-purple-highlight text-xs font-bold px-3 py-1 rounded-full">
                            Personnalisé
                        </span>
                    </div>

                    {/* Badge customisé à cheval (gauche) */}
                    <div className="absolute top-16 z-10">
                        <Image
                            src="/badges/customised-badge.svg"
                            alt="Badge customisé"
                            width={120}
                            height={120}
                            className="drop-shadow-lg"
                        />
                    </div>

                    {/* Contenu de la carte */}
                    <div className="p-4 flex flex-col gap-4 mt-4">

                        {/* Titre et date */}
                        <div className="grid pt-4">
                            <span className="font-bold leading-tight">
                                Lire La Huitième Couleur en 1 mois
                            </span>
                            <span className="text-sm text-text-white text-opacity-50 mt-1">
                                Date de début - Date de fin
                            </span>
                        </div>

                        {/* Participants et délai */}
                        <div className="flex justify-between items-center">
                            <div className="flex -space-x-2">
                                <div className="w-6 h-6 rounded-full bg-red-500 border-2 border-emerald-400"></div>
                                <div className="w-6 h-6 rounded-full bg-yellow-500 border-2 border-emerald-400"></div>
                                <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-emerald-400"></div>
                                <div className="w-6 h-6 rounded-full bg-green-600 border-2 border-emerald-400"></div>
                                <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-emerald-400 flex items-center justify-center text-xs text-gray-800 font-medium">
                                    +4
                                </div>
                            </div>
                            <div className="flex items-center">
                                <Hourglass width={15} />
                                <span className="ml-1 text-sm">13 j.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <button
                className="w-fit primary-btn flex items-center gap-5 py-5 px-5 rounded-full"
            >
                <Plus width={20} height={20} />
                <span>Afficher plus</span>
            </button>
        </>
    )
}
