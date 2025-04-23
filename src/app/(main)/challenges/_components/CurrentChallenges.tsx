'use client'

import { Hourglass } from 'lucide-react'
import React from 'react'
import PropTypes from 'prop-types'

export default function CurrentChallenges() {
    /**
 * CardHeader
 * Affiche la zone de couverture de la carte.
 * 
 * @param {string} coverColor – classe(s) Tailwind pour la couleur / gradient
 * @param {string} coverHeight – hauteur de la zone cover (ex : 'h-36')
 */
    const CardHeader = ({ coverColor, coverHeight }: any) => (
        <div className={`
    w-full 
    ${coverHeight} 
    ${coverColor}
  `} />
    );

    CardHeader.propTypes = {
        coverColor: PropTypes.string,
        coverHeight: PropTypes.string,
    };

    CardHeader.defaultProps = {
        coverColor: 'bg-blue-500',
        coverHeight: 'h-32',
    };

    /**
     * Card
     * Conteneur principal avec overflow-hidden pour que le header s'arrondisse aux coins.
     * 
     * @param {React.ReactNode} children – contenu interne de la carte
     * @param {string} borderColor – classe Tailwind pour la bordure
     */
    const Card = ({ children, borderColor }: any) => (
        <div className={`
    rounded-lg 
    overflow-hidden      /* pour que le header respecte les coins arrondis */
    bg-secondary-black 
    border 
    ${borderColor}
    shadow-md
    max-w-sm
  `}>
            {children}
        </div>
    );

    Card.propTypes = {
        children: PropTypes.node.isRequired,
        borderColor: PropTypes.string,
    };

    Card.defaultProps = {
        borderColor: 'border-tertiary-black',
    };
    return (
        <Card>
            {/* Zone « cover » */}
            <CardHeader
                coverColor="bg-gradient-to-br from-blue-400 to-purple-800"
                coverHeight="h-32"
            />

            {/* Contenu de la carte */}
            <div className="p-4 text-text-white flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <div className="flex-shrink-0 w-12 h-12 bg-gray-800 bg-opacity-20 rounded-lg flex items-center justify-center">
                        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="bg-text-white text-purple-highlight text-xs font-bold px-3 py-1 rounded-full">
                            PERSONNALISÉ
                        </span>
                        <div className="w-6 h-6 rounded-full bg-blue-600 shadow-lg flex items-center justify-center overflow-hidden">
                            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-800"></div>
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className="text-lg font-bold leading-tight">Lire La Huitième Couleur en 1 mois</h2>
                    <p className="text-sm text-white text-opacity-80 mt-1">1 mai 2024</p>
                </div>

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
                        <Hourglass width="15" />
                        <span className="ml-1 text-sm">13 j.</span>
                    </div>
                </div>
            </div>
        </Card>
    );
}
