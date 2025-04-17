import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

interface CustomSelectProps {
    selectedStatus: string;
    onChange?: (newStatus: string) => void;
}

export default function CustomSelect({ selectedStatus, onChange }: CustomSelectProps) {
    const options = useMemo(() => [
        { value: 'brouillon', label: 'Brouillon', color: "var(--highlight-red)" },
        { value: 'publie', label: 'Publié', color: "var(--highlight-green)" },
    ], []);

    const [selectedOption, setSelectedOption] = useState(() =>
        options.find(option => option.value === selectedStatus) || options[0]
    );
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [dropdownStyle, setDropdownStyle] = useState({ top: 0, left: 0, width: 0 });

    const toggleDropdown = (event: React.MouseEvent) => {
        event.stopPropagation();
        setIsOpen(prev => !prev);
    };

    const handleOptionClick = (option: any, event: React.MouseEvent) => {
        event.stopPropagation();
        setSelectedOption(option);
        setIsOpen(false);
        if (onChange) {
            onChange(option.value);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const newOption = options.find(option => option.value === selectedStatus);
        if (newOption) {
            setSelectedOption(newOption);
        }
    }, [selectedStatus, options]);

    useEffect(() => {
        if (isOpen && dropdownRef.current) {
            const rect = dropdownRef.current.getBoundingClientRect();
            setDropdownStyle({
                top: rect.bottom,
                left: rect.left,
                width: rect.width,
            });
        }
    }, [isOpen]);

    const dropdown = (
        <div
            className="status-btn-list rounded-md shadow-lg"
            style={{
                position: "absolute",
                top: dropdownStyle.top,
                left: dropdownStyle.left,
                width: dropdownStyle.width,
                zIndex: 1000,
                backgroundColor: 'var(--bg-tertiary-dark)',
            }}
            role="listbox"
        >
            {options.map(option => (
                <div
                    key={option.value}
                    className="cursor-pointer py-2 px-4 flex items-center rounded-md"
                    onClick={(e) => handleOptionClick(option, e)}
                    role="option"
                    aria-selected={selectedOption.value === option.value}
                >
                    <span className="inline-block w-2 h-2 mr-2 rounded-full" style={{ backgroundColor: option.color }}></span>
                    {option.label}
                </div>
            ))}
        </div>
    );

    return (
        <div className="relative inline-block w-40" ref={dropdownRef}>
            <div
                className="status-btn rounded-full py-2 px-4 cursor-pointer flex items-center justify-between"
                onClick={toggleDropdown}
                tabIndex={0}
                role="button"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <span className="inline-block w-2 h-2 mr-2 rounded-full" style={{ backgroundColor: selectedOption.color }}></span>
                {selectedOption.label}
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </div>
            {isOpen && ReactDOM.createPortal(dropdown, document.body)}
        </div>
    );
}