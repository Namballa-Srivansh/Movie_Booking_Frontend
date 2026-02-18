import React from 'react';
import { Heart, Info, MonitorPlay, Zap } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/app/routes';

interface TheatreShowListProps {
    theatres: {
        _id: string;
        name: string;
        location: string;
        shows: {
            _id: string;
            timings: string;
            format: string;
            price: number;
            noOfSeats: number;
            availability?: 'Available' | 'Fast Filling';
        }[];
    }[];
    selectedDate: Date;
}

export default function TheatreShowList({ theatres, selectedDate }: TheatreShowListProps) {
    if (!theatres || theatres.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-lg shadow-sm border border-slate-100 mt-4">
                <p className="text-slate-500 mb-4">No shows available for the selected filters.</p>
                <button className="px-6 py-2 bg-rose-50 text-rose-600 rounded-lg font-medium hover:bg-rose-100 transition-colors">
                    Change Location / Filters
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-4 py-6">
            <div className="flex justify-end mb-2 text-xs font-semibold gap-4">
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span className="text-slate-500">AVAILABLE</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                    <span className="text-slate-500">FAST FILLING</span>
                </div>
            </div>

            <div className="bg-white rounded-md shadow-sm border border-slate-200 divide-y divide-slate-100">
                {theatres.map((theatre) => (
                    <div key={theatre._id} className="p-6 flex flex-col md:flex-row gap-6 hover:bg-slate-50/50 transition-colors group">
                        {/* Theatre Info - Left */}
                        <div className="md:w-1/3 flex gap-4">
                            <Heart className="w-5 h-5 text-slate-300 hover:text-rose-500 shrink-0 cursor-pointer transition-colors" />
                            <div>
                                <h3 className="font-bold text-slate-900 group-hover:text-rose-600 transition-colors flex items-center gap-2">
                                    {theatre.name}
                                    <Info className="w-3.5 h-3.5 text-slate-400" />
                                </h3>
                                <div className="flex items-center gap-4 mt-2">
                                    <div className="flex items-center gap-1 text-xs text-orange-500 bg-orange-50 px-2 py-0.5 rounded border border-orange-100">
                                        <MonitorPlay className="w-3 h-3" />
                                        <span>M-Ticket</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100">
                                        <Zap className="w-3 h-3" />
                                        <span>F&B</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Show Times - Right */}
                        <div className="flex-1 flex flex-wrap gap-3 items-start">
                            {theatre.shows.map((show) => (
                                <Link
                                    key={show._id}
                                    href={`${ROUTES.BOOK_SHOW}/${show._id}?date=${encodeURIComponent(selectedDate.toISOString())}`}
                                    className="group/show relative"
                                >
                                    <div className="border border-green-500/30 rounded px-4 py-2 hover:bg-green-50 transition-colors text-center min-w-[90px] cursor-pointer bg-white">
                                        <div className="text-green-600 font-bold text-sm">
                                            {show.timings}
                                        </div>
                                        <div className="text-[10px] text-slate-400 uppercase font-semibold mt-0.5">
                                            {show.format}
                                        </div>
                                    </div>

                                    {/* Tooltip on hover (simple version) */}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/show:block bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10 text-center">
                                        <div>Rs. {show.price}</div>
                                        <div className="text-[10px] text-slate-300">{show.noOfSeats} Seats Left</div>
                                        <div className="-z-10 absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
