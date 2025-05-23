'use client'

import React from 'react'
import Image from 'next/image'

export default function BadgesHistory() {
  return (
    <div className="relative col-span-3 bg-secondary-black text-text-white p-4 rounded-lg flex flex-col gap-4 border border-tertiary-black">

      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <Image src="/badges/special-badge.svg" alt="Badge spécial" width={200} height={200} />
      </div>
      <div className="mt-[3em]">
        <div className="text-center mb-4">
          <h2>Dernier badge obtenu</h2>
          <span className="text-yellow-highlight">Nom du dernier badge</span>
        </div>

        {/* map des badges */}
        <div className="flex gap-4 items-center">
          <Image src="/badges/customised-badge.svg" alt="Badge spécial" width={50} height={50} />
          <div className="grid">
            <span>Nom du badge</span>
            <span className="text-sm text-text-white text-opacity-50">Date d&apos;obtention</span>
          </div>
        </div>
      </div>
    </div>
  )
}
