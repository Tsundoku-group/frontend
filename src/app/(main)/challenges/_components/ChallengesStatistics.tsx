import React from 'react'

export default function ChallengesStatistics() {
  return (
    <div className="bg-secondary-black text-text-white p-4 rounded-lg flex flex-col gap-4 border border-tertiary-black">
      <h2>Mes statistiques</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <span className="mb-2">
            <span className="text-yellow-highlight font-bold text-3xl">13</span> défis acceptés
          </span>
          <span>
            <span className="text-red-highlight font-bold text-3xl">8%</span> défis réussis
          </span>
        </div>
        <div className="flex flex-col">
          <span className="mb-2">
            <span className="text-purple-highlight font-bold text-3xl">09</span> défis créés
          </span>
          <span>
            <span className="text-green-highlight font-bold text-3xl">08</span> badges obtenus
          </span>
        </div>
      </div>
    </div>
  )
}
