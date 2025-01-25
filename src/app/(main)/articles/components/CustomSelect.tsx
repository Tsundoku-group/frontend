import React, { useEffect, useRef, useState } from 'react';

export default function CustomSelect() {
    const options = [
        { value: 'brouillon', label: 'Brouillon', color: 'bg-red-500' },
        { value: 'en-cours', label: 'En cours', color: 'bg-orange-500' },
        { value: 'publie', label: 'Publié', color: 'bg-green-500' },
    ];

    const [selectedOption, setSelectedOption] = useState(options[0]);
    const [isOpen, setIsOpen] = useState(false);
    const [focusedOptionIndex, setFocusedOptionIndex] = useState(0);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleOptionClick = (option: any) => {
        setSelectedOption(option);
        setIsOpen(false);
    };

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'ArrowDown') {
            setIsOpen(true);
            setFocusedOptionIndex((prevIndex) => (prevIndex + 1) % options.length);
        } else if (event.key === 'ArrowUp') {
            setIsOpen(true);
            setFocusedOptionIndex((prevIndex) => (prevIndex - 1 + options.length) % options.length);
        } else if (event.key === 'Enter' || event.key === ' ') {
            if (isOpen) {
                handleOptionClick(options[focusedOptionIndex]);
            } else {
                setIsOpen(true);
            }
        } else if (event.key === 'Escape') {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative inline-block w-40" ref={dropdownRef}>
            <div
                className="status-btn rounded-full py-2 px-4 cursor-pointer flex items-center justify-between"
                onClick={toggleDropdown}
                onKeyDown={handleKeyDown}
                tabIndex={0}
                role="button"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <span className={`inline-block w-2 h-2 mr-2 rounded-full ${selectedOption.color}`}></span>
                {selectedOption.label}
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </div>

            {isOpen ? (
                <div className="status-btn-list absolute mt-1 w-full rounded-md shadow-lg z-10" role="listbox">
                    {options.map((option, index) => (
                        <div
                            key={option.value}
                            className="cursor-pointer py-2 px-4 flex items-center rounded-md"
                            onClick={() => handleOptionClick(option)}
                            role="option"
                            aria-selected={selectedOption.value === option.value}
                        >
                            <span className={`inline-block w-2 h-2 mr-2 rounded-full ${option.color}`}></span>
                            {option.label}
                        </div>
                    ))}
                </div>
            ) : null}
        </div>
    );
}