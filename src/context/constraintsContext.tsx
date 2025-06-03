'use client'

import { ConstraintResponse, fetchConstraints } from '@/server-actions/main/challenges/challenges/actions'
import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from 'react'

const ConstraintsContext = createContext<ConstraintResponse | null>(null)

export function ConstraintsProvider({ children }: { children: ReactNode }) {
    const [constraints, setConstraints] = useState<ConstraintResponse>({
        actionTypes: [],
        contentTypes: [],
        frequencies: [],
        allowedContent: {},
    })

    useEffect(() => {
        async function loadConstraints() {
            try {
                const constraints = await fetchConstraints();
                setConstraints(constraints);
            } catch (error) {
                console.error('Error fetching constraints: ', error)
            }
        }

        loadConstraints();
    }, [])

    return (
        <ConstraintsContext.Provider value={constraints}>
            {children}
        </ConstraintsContext.Provider>
    )
}

export function useConstraints() {
    const ctx = useContext(ConstraintsContext)
    if (!ctx) {
        throw new Error('useConstraints must be used within ConstraintsProvider')
    }
    return ctx
}  