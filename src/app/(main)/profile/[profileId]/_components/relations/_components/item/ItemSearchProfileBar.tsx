'use client';

import React, {useState} from 'react';
import {Search} from 'lucide-react';
import {Input} from '@/components/ui/input';

type SearchBarProps<T> = {
    placeholder?: string;
    items: T[];
    setFilteredItems: (filtered: T[]) => void;
    getLabel: (item: T) => string;
    resetItems: () => void;
};

const ItemSearchProfileBar = <T extends {}>({placeholder = "Rechercher...", items, setFilteredItems, getLabel, resetItems}: SearchBarProps<T>) => {
    const [searchTerm, setSearchTerm] = useState<string>('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSearchTerm = e.target.value;
        setSearchTerm(newSearchTerm);

        if (!newSearchTerm) {
            resetItems();
            return;
        }

        const filteredItems = items.filter(item =>
            getLabel(item).toLowerCase().includes(newSearchTerm.toLowerCase())
        );

        setFilteredItems(filteredItems);
    };

    return (
        <div className="flex items-center w-full bg-tertiary-black border-none rounded">
            <Search className="text-gray-400 w-4 h-4 ml-3"/>
            <Input
                type="text"
                placeholder={placeholder}
                value={searchTerm}
                onChange={handleInputChange}
                className="flex-1 p-2 text-sm bg-tertiary-black border-none focus:outline-none"
            />
        </div>
    );
};

export default ItemSearchProfileBar;