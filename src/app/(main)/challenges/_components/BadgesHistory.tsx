'use client'

import { Badge } from 'lucide-react'
import React from 'react'

export default function BadgesHistory() {
  return (
    <div className="col-span-3 bg-secondary-black text-text-white p-4 rounded-lg flex flex-col gap-4 border border-tertiary-black">
      {/* <Image /> */}
      <h2>Dernier badge obtenu</h2>
      <h3>Nom du dernier badge</h3>
      {/* map des badges */}
      <div>
        {/* <Image /> */}
        <span>Nom du badge</span>
        <span>Date d&apos;obtention</span>
      </div>
    </div>
  )
}
