'use client'

import { createContext, useContext, useState, ReactNode } from "react";

interface GroupContextType {
    groupId: number;
    setGroupId: (id: number) => void;
}

const GroupContext = createContext<GroupContextType | undefined>(undefined);

export const GroupProvider = ({ children }: { children: ReactNode }) => {
    const [groupId, setGroupId] = useState(1);

    return (
        <GroupContext.Provider value={{ groupId, setGroupId }}>
            {children}
        </GroupContext.Provider>
    );
};

export const useGroupContext = () => {
    const context = useContext(GroupContext);
    if (!context) {
        throw new Error("useGroupContext must be used within a GroupProvider");
    }
    return context;
};