import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DateSelectorProps {
    selectedDate: Date;
    onSelect: (date: Date) => void;
}

export default function DateSelector({ selectedDate, onSelect }: DateSelectorProps) {
    const dates = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        return d;
    });

    return (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {dates.map((date) => {
                const isSelected = date.toDateString() === selectedDate.toDateString();
                const day = date.toLocaleDateString('en-US', { weekday: 'short' });
                const dayNum = date.getDate();
                const month = date.toLocaleDateString('en-US', { month: 'short' });

                return (
                    <button
                        key={date.toISOString()}
                        onClick={() => onSelect(date)}
                        className={`
                            flex flex-col items-center justify-center min-w-[60px] h-[70px] rounded-xl transition-all
                            ${isSelected
                                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30 transform scale-105'
                                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}
                        `}
                    >
                        <span className={`text-[10px] uppercase font-bold tracking-wider ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                            {day}
                        </span>
                        <span className="text-xl font-bold leading-none my-0.5">
                            {dayNum}
                        </span>
                        <span className={`text-[10px] font-medium ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                            {month}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
