import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';

interface FilterBarProps {
    onFilterChange: (filters: any) => void;
}

export default function FilterBar({ onFilterChange }: FilterBarProps) {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [filters, setFilters] = useState({
        formats: [] as string[],
        priceRange: [] as string[],
        timings: [] as string[]
    });

    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpenDropdown(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleDropdown = (name: string) => {
        setOpenDropdown(openDropdown === name ? null : name);
    };

    const handleFilterSelect = (category: string, value: string) => {
        const current = (filters as any)[category];
        const updated = current.includes(value)
            ? current.filter((item: string) => item !== value)
            : [...current, value];

        const newFilters = { ...filters, [category]: updated };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const clearFilters = () => {
        const resetFilters = {
            formats: [],
            priceRange: [],
            timings: []
        };
        setFilters(resetFilters);
        onFilterChange(resetFilters);
        setOpenDropdown(null);
    };

    const renderDropdown = (title: string, category: string, options: string[]) => {
        const selected = (filters as any)[category];
        const isOpen = openDropdown === title;

        return (
            <div className="relative group" key={title}>
                <button
                    onClick={() => toggleDropdown(title)}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors ${selected.length > 0 ? 'text-rose-600' : 'text-gray-700 hover:text-rose-600'}`}
                >
                    {title} {selected.length > 0 && `(${selected.length})`}
                    <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                        <div className="space-y-1">
                            {options.map((option) => (
                                <label key={option} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer">
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selected.includes(option) ? 'bg-rose-600 border-rose-600' : 'border-gray-300'}`}>
                                        {selected.includes(option) && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={selected.includes(option)}
                                        onChange={() => handleFilterSelect(category, option)}
                                    />
                                    <span className="text-sm text-gray-700">{option}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="flex items-center justify-between py-4" ref={dropdownRef}>
            <div className="flex items-center gap-6">
                {renderDropdown("Format", "formats", ["2D", "3D", "IMAX 2D", "IMAX 3D", "4DX"])}

                <div className="h-4 w-px bg-gray-200"></div>

                {renderDropdown("Price", "priceRange", ["Rs. 0-100", "Rs. 101-200", "Rs. 201-300", "Rs. 301-350", "Rs. 351+"])}

                <div className="h-4 w-px bg-gray-200"></div>

                {renderDropdown("Timing", "timings", ["Morning", "Afternoon", "Evening", "Night"])}

                {(filters.formats.length > 0 || filters.priceRange.length > 0 || filters.timings.length > 0) && (
                    <button
                        onClick={clearFilters}
                        className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 ml-2"
                    >
                        <X className="w-3 h-3" /> Clear
                    </button>
                )}
            </div>
        </div>
    );
}
