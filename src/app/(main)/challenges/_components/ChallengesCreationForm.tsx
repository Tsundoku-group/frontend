'use client'

import React, { useState, ChangeEvent } from 'react' // adapte le path si besoin
import Image from 'next/image'
import CustomSelect from '@/components/CustomSelect'
import { CustomSelectOption } from '@/models/Challenge'
import { Plus, X } from 'lucide-react'

interface PredefChallenge {
  id: number
  badge: string
  name: string
  objective: string
  duration: string
}

interface ChallengesCreationFormProps {
  onClose: () => void;
}

export default function ChallengesCreationForm({ onClose }: ChallengesCreationFormProps) {
  const typeOptions: CustomSelectOption[] = [
    { value: 'personnalise', label: 'Personnalisé', color: 'var(--highlight-purple)' },
    { value: 'predefini', label: 'Prédéfini', color: 'var(--highlight-red)' }
  ]

  const [type, setType] = useState<string>(typeOptions[0].value)

  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [participantSearch, setParticipantSearch] = useState<string>('')
  const [selectedObjectives, setSelectedObjectives] = useState<string[]>([])
  const objectifOptions = [
    { value: 'objectif1', label: 'Objectif 1' },
    { value: 'objectif2', label: 'Objectif 2' },
    { value: 'objectif3', label: 'Objectif 3' },
  ]

  const predefinedChallenges: PredefChallenge[] = [
    {
      id: 1,
      badge: '/badges/predefined-badge.svg',
      name: 'Petit explorateur',
      objective: '5 livres en 30 jours',
      duration: '30 j.'
    },
    {
      id: 2,
      badge: '/badges/predefined-badge.svg',
      name: 'Lecteur chevronné',
      objective: 'Lire 1000 pages en 1 mois',
      duration: '30 j.'
    }
  ]

  const handleObjectivesChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const vals = Array.from(e.target.selectedOptions, opt => opt.value)
    setSelectedObjectives(vals)
  }

  return (
    <div className="fixed inset-0 bg-primary-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-tertiary-black text-text-white p-6 rounded-lg relative w-full max-w-lg">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-tertiary-black rounded-full"
          aria-label="Fermer"
        >
          <X size={20} />
        </button>
        <form className="grid max-w-md mx-auto space-y-6">
          <h2 className="text-2xl font-bold">Créer un défi</h2>

          <CustomSelect
            selectedValue={type}
            onChange={setType}
            options={typeOptions}
          />

          {type === 'personnalise' && (
            <div className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Début du défi</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full px-4 py-2 bg-secondary-black border border-tertiary-black rounded-3xl mb-4"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Fin du défi</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="w-full px-4 py-2 bg-secondary-black border border-tertiary-black rounded-3xl mb-4"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Participants</label>
                <input
                  type="text"
                  placeholder="Rechercher parmi vos amis…"
                  value={participantSearch}
                  onChange={e => setParticipantSearch(e.target.value)}
                  className="w-full px-4 py-2 bg-secondary-black border border-tertiary-black rounded-3xl mb-4"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Objectifs</label>
                <select
                  multiple
                  value={selectedObjectives}
                  onChange={handleObjectivesChange}
                  className="w-full border rounded px-3 py-2 h-32"
                >
                  {objectifOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {type === 'predefini' && (
            <div className="space-y-3">
              {predefinedChallenges.map(ch => (
                <div
                  key={ch.id}
                  className="flex items-center gap-4 p-3 border border-tertiary-black rounded hover:bg-tertiary-black"
                >
                  <Image
                    src={ch.badge}
                    width={40}
                    height={40}
                    alt={ch.name}
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{ch.name}</p>
                    <p className="text-sm text-gray-600">{ch.objective}</p>
                  </div>
                  <span className="text-sm">{ch.duration}</span>
                </div>
              ))}
            </div>
          )}

          <button
            className="primary-btn w-fit flex items-center gap-3 py-5 px-5 rounded-xl self-center self-center"
          >
            <Plus width={20} height={20} />
            <span>Créer le défi</span>
          </button>
        </form>
      </div>
    </div>
  )
}
