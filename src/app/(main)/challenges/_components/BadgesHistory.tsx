'use client'

import React, { useCallback, useEffect } from 'react'
import Image from 'next/image'
import { fetchProfileBadges } from '@/server-actions/main/challenges/badges/actions';
import { useProfileContext } from '@/context/profileContext';
import { Badge } from '@/models/Challenge';
import { formatDate } from '@/utils/dateUtils';

export default function BadgesHistory() {
  const [badges, setBadges] = React.useState<Badge[]>([]);

  const { activeProfileInStorage } = useProfileContext();
  const profileId = activeProfileInStorage?.id;

  const loadBadges = useCallback(async () => {
    if (!profileId) {
      setBadges([]);
      return;
    }

    try {
      const result = await fetchProfileBadges(profileId);
      setBadges(result ?? []);
    } catch (err) {
      console.error('Erreur lors du chargement des badges :', err);
      setBadges([]);
    }
  }, [profileId]);

  // Charge les badges à chaque changement de profileId
  useEffect(() => {
    loadBadges();
  }, [loadBadges]);

  const latestBadge = badges.length > 0 ? badges[badges.length - 1] : null;

  return (<div className="relative col-span-3 bg-secondary-black text-text-white p-4 rounded-lg flex flex-col gap-4 border border-tertiary-black">
    {/* Badge décoratif central */}
    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      {latestBadge ? (
        <Image
          src={`/badges/${latestBadge.challengeType}-badge.svg`}
          alt="Badge spécial"
          width={200}
          height={200}
        />) : (
        <Image
          src="/badges/special-badge.svg"
          alt="Badge par défaut"
          width={200}
          height={200}
        />
      )}
    </div>

    <div className="mt-[3em]">
      <div className="text-center mb-4">
        <h2>Dernier badge obtenu</h2>
        {latestBadge ? (
          <span className="text-yellow-highlight">
            {latestBadge.challengeName}
          </span>
        ) : (
          <span className="text-text-white text-opacity-50">
            Aucun badge pour l&apos;instant
          </span>
        )}
      </div>

      <div className="max-h-48 overflow-y-auto pr-2">
        {badges.length > 0 ? (
          badges.map((badge) => (
            <div
              key={badge.id}
              className="flex gap-4 items-center mb-2"
            >
              <Image
                src={`/badges/${badge.challengeType}-badge.svg`}
                alt={`Badge ${badge.challengeName}`}
                width={50}
                height={50}
              />

              <div className="grid">
                <span>{badge.challengeName}</span>
                <span className="text-sm text-text-white text-opacity-50">
                  {formatDate(badge.awardedAt)}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p>Pas de badge gagné pour le moment.</p>
        )}
      </div>
    </div>
  </div>
  )
}
