'use client'

import React, { useState, ChangeEvent, useMemo, useEffect } from 'react' // adapte le path si besoin
import Image from 'next/image'
import CustomSelect, { CustomSelectOption } from '@/components/CustomSelect'
import { Plus, X } from 'lucide-react'
import { useConstraints } from '@/context/constraintsContext'

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
  const constraints = useConstraints();

  const actionLabels: Record<string, string> = {
    read: 'Lire',
    write: 'Écrire',
    have: 'Posséder',
  }

  const frequencyLabels: Record<string, string> = {
    daily: 'Quotidienne',
    weekly: 'Hebdomadaire',
    monthly: 'Mensuelle',
    yearly: 'Annuelle',
    once: 'Unique',
  }

  const typeOptions: CustomSelectOption[] = [
    { value: 'personnalise', label: 'Personnalisé', color: 'var(--highlight-purple)' },
    { value: 'predefini', label: 'Prédéfini', color: 'var(--highlight-red)' }
  ];

  const [type, setType] = useState<string>(typeOptions[0].value);

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const [actionType, setActionType] = useState<string>('');
  const [contentType, setContentType] = useState<string>('');
  const [frequency, setFrequency] = useState<string>('');
  const [targetCount, setTargetCount] = useState<number>(1);

  useEffect(() => {
    if (constraints.actionTypes.length > 0) {
      setActionType(constraints.actionTypes[0])
    }
    if (constraints.frequencies.length > 0) {
      setFrequency(constraints.frequencies[0])
    }
  }, [constraints.actionTypes, constraints.frequencies])

  useEffect(() => {
    const allowed = constraints.allowedContent[actionType] || []
    if (allowed.length > 0) {
      setContentType(allowed[0])
    } else {
      setContentType('')
    }
  }, [actionType, constraints.allowedContent])

  const contentOptions = useMemo(() => {
    const contentLabels: Record<string, string> = {
      book: 'Livre',
      page: 'Page',
      chapter: 'Chapitre',
      article: 'Article',
      book_review: 'Critique de livre',
      book_description: 'Fiche de livre',
    }

    return (constraints.allowedContent[actionType] || []).map(c => ({
      value: c,
      label: contentLabels[c] || c,
    }))
  }, [actionType, constraints.allowedContent])

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
                <label className="mb-1 font-medium">Nom du défi</label>
                <input
                  type="text"
                  placeholder="Le nom de ton défi…"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full px-4 py-2 bg-secondary-black border border-tertiary-black rounded-3xl mb-4"
                />
              </div>
              <div>
                <label className="mb-1 font-medium">Début du défi</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full px-4 py-2 bg-secondary-black border border-tertiary-black rounded-3xl mb-4"
                />
              </div>
              <div>
                <label className="mb-1 font-medium">Fin du défi</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="w-full px-4 py-2 bg-secondary-black border border-tertiary-black rounded-3xl mb-4"
                />
              </div>

              <div>
                <label className="mb-1 font-medium">Type d&apos;action</label>
                <select
                  value={actionType}
                  onChange={e => setActionType(e.target.value)}
                  className="w-full px-4 py-2 bg-secondary-black border border-tertiary-black rounded-3xl mb-4"
                >
                  {constraints.actionTypes.map(at => (
                    <option key={at} value={at}>
                      {actionLabels[at] || at}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 font-medium">Type de contenu</label>
                <select
                  value={contentType}
                  onChange={e => setContentType(e.target.value)}
                  className="w-full px-4 py-2 bg-secondary-black border border-tertiary-black rounded-3xl mb-4"
                >
                  {contentOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 font-medium">Fréquence</label>
                <select
                  value={frequency}
                  onChange={e => setFrequency(e.target.value)}
                  className="w-full px-4 py-2 bg-secondary-black border border-tertiary-black rounded-3xl mb-4"
                >
                  {constraints.frequencies.map(freq => (
                    <option key={freq} value={freq}>
                      {frequencyLabels[freq] || freq}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 font-medium">Objectif (nombre)</label>
                <input
                  type="number"
                  min="1"
                  value={targetCount}
                  onChange={e => setTargetCount(Number(e.target.value))}
                  className="w-full px-4 py-2 bg-secondary-black border border-tertiary-black rounded-3xl mb-4"
                />
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
