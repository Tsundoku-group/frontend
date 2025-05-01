'use client'

import { Hourglass } from 'lucide-react'
import React from 'react'

export default function CurrentChallenges() {
    return (
        <>
            <h2>Défis en cours</h2>

            <div className="grid grid-cols-5 gap-4 mt-4">

                {/* Carte simplifiée sans composants internes */}
                <div className="relative rounded-lg overflow-hidden bg-secondary-black border border-tertiary-black shadow-md">
                    {/* Zone cover */}
                    <div className="w-full h-32 bg-gradient-to-br from-blue-400 to-purple-800" />

                    {/* Contenu de la carte */}
                    <div className="p-4 flex flex-col gap-4">
                        {/* En-tête avec avatar & type */}
                        <div className="flex justify-between items-center">
                            <div className="flex-shrink-0 w-12 h-12 bg-gray-800 bg-opacity-20 rounded-lg flex items-center justify-center">
                                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="bg-text-white text-purple-highlight text-xs font-bold px-3 py-1 rounded-full">
                                    Type
                                </span>
                                <div className="w-6 h-6 rounded-full bg-blue-600 shadow-lg flex items-center justify-center overflow-hidden">
                                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-800"></div>
                                </div>
                            </div>
                        </div>

                        {/* Titre et date */}
                        <div>
                            <span className="font-bold leading-tight">
                                Lire La Huitième Couleur en 1 mois
                            </span>
                            <p className="text-sm text-white text-opacity-80 mt-1">
                                1 mai 2024
                            </p>
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
        </>
    )
}