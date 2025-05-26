'use client'

import { Challenge } from '@/models/Challenge'
import { formatDate } from '@/utils/dateUtils'
import { Hourglass, Plus } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

type ChallengesListProps = {
    challenges: Challenge[]
}

export default function ChallengesList({
    challenges,
}: ChallengesListProps) {
    return (
        <>
            <div className="grid grid-cols-5 gap-4">
                {challenges.map((challenge) => (
                    <div
                        className="relative rounded-lg overflow-hidden bg-secondary-black border border-tertiary-black shadow-md"
                        key={challenge.id}
                    >
                        {/* Zone cover */}
                        <div
                            className="w-full h-32 bg-gradient-to-br from-blue-400 to-purple-800"
                        />

                        {/* Badge Personnalisé en absolute top-right */}
                        <div className="absolute top-4 right-4 z-20">
                            <span className="bg-text-white text-purple-highlight text-xs font-bold px-3 py-1 rounded-full">
                                {challenge.type}
                            </span>
                        </div>

                        {/* Badge customisé à cheval (gauche) */}
                        <div className="absolute top-16 z-10">
                            <Image
                                src={`/badges/${challenge.type}-badge.svg`}
                                alt={`Badge ${challenge.name}`}
                                width={120}
                                height={120}
                                className="drop-shadow-lg"
                            />
                        </div>

                        {/* Contenu de la carte */}
                        <div className="p-4 flex flex-col gap-4 mt-4">
                            <div className="grid pt-4">
                                <span className="font-bold leading-tight">
                                    {challenge.name}
                                </span>
                                <span className="text-sm text-text-white text-opacity-50 mt-1">
                                    {formatDate(challenge.startAt)} - {formatDate(challenge.endAt)}
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
                ))}
            </div>
            <button
                className="w-fit primary-btn flex items-center gap-2 py-2 px-4 rounded-full mt-4"
            >
                <Plus width={20} height={20} />
                <span>Afficher plus</span>
            </button>
        </>
    )
}
