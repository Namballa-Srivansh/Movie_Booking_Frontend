"use client";

import React, { useState, useEffect } from "react";

interface SeatSelectionProps {
    bookedSeats: string[];
    ticketPrices: {
        recliner: number;
        primePlus: number;
        prime: number;
        classic: number;
    };
    onSelectionChange: (selectedSeats: string[], totalCost: number) => void;
}

const SeatSelection: React.FC<SeatSelectionProps> = ({ bookedSeats = [], ticketPrices, onSelectionChange }) => {
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

    useEffect(() => {
        const cost = calculateTotalCost();
        onSelectionChange(selectedSeats, cost);
    }, [selectedSeats]);

    const handleSeatClick = (seatId: string, price: number) => {
        if (bookedSeats.includes(seatId)) return;

        setSelectedSeats((prev) => {
            if (prev.includes(seatId)) {
                return prev.filter((id) => id !== seatId);
            } else {
                return [...prev, seatId];
            }
        });
    };

    const calculateTotalCost = () => {
        let total = 0;
        selectedSeats.forEach((seat) => {
            const row = seat.charAt(0);
            if (row === "K") total += ticketPrices.recliner;
            else if (["J", "H", "G", "F"].includes(row)) total += ticketPrices.primePlus;
            else if (["E", "D", "C"].includes(row)) total += ticketPrices.prime;
            else if (["B", "A"].includes(row)) total += ticketPrices.classic;
        });
        return total;
    };

    const renderSeat = (seatId: string, price: number) => {
        const isBooked = bookedSeats.includes(seatId);
        const isSelected = selectedSeats.includes(seatId);

        return (
            <button
                key={seatId}
                onClick={() => handleSeatClick(seatId, price)}
                disabled={isBooked}
                className={`
                    w-8 h-8 m-1 rounded-md text-xs font-medium transition-all duration-200 border
                    ${isBooked
                        ? "bg-slate-300 border-slate-300 text-slate-500 cursor-not-allowed"
                        : isSelected
                            ? "bg-green-500 border-green-500 text-white shadow-md transform scale-105"
                            : "bg-white border-green-400 text-green-600 hover:bg-green-50"
                    }
                `}
            >
                {seatId.substring(1)}
            </button>
        );
    };

    const renderRow = (rowLabel: string, start: number, end: number, price: number) => {
        const seats = [];
        for (let i = start; i <= end; i++) {
            const seatNum = i < 10 ? `0${i}` : `${i}`;
            const seatId = `${rowLabel}${seatNum}`;
            seats.push(renderSeat(seatId, price));
        }
        return seats;
    };

    return (
        <div className="flex flex-col items-center w-full max-w-3xl mx-auto p-4 bg-white rounded-xl shadow-sm">
            {/* Screen */}
            <div className="w-full max-w-lg mb-12 text-center">
                <div className="h-2 bg-blue-100 rounded-t-full w-full mb-2 shadow-sm"></div>
                <p className="text-xs text-slate-400 uppercase tracking-widest">All eyes this way please</p>
            </div>

            <div className="space-y-8 w-full">
                {/* Recliners */}
                <div className="text-center">
                    <p className="text-sm text-slate-500 mb-2">₹{ticketPrices.recliner} RECLINERS</p>
                    <div className="flex justify-center items-center gap-8">
                        <div className="flex items-center gap-1">
                            <span className="w-4 text-xs font-semibold text-slate-400 mr-2">K</span>
                            {renderRow("K", 1, 2, ticketPrices.recliner)}
                        </div>
                        <div className="flex items-center gap-1">
                            {renderRow("K", 3, 9, ticketPrices.recliner)}
                        </div>
                    </div>
                    <div className="border-b border-slate-100 mt-4 mx-auto w-3/4"></div>
                </div>

                {/* Prime Plus */}
                <div className="text-center">
                    <p className="text-sm text-slate-500 mb-2">₹{ticketPrices.primePlus} PRIME PLUS</p>
                    {["J", "H", "G", "F"].map((row) => (
                        <div key={row} className="flex justify-center items-center gap-8 mb-1">
                            <div className="flex items-center gap-1">
                                <span className="w-4 text-xs font-semibold text-slate-400 mr-2">{row}</span>
                                {renderRow(row, 1, 3, ticketPrices.primePlus)}
                            </div>
                            <div className="flex items-center gap-1">
                                {renderRow(row, 4, 12, ticketPrices.primePlus)}
                            </div>
                        </div>
                    ))}
                    <div className="border-b border-slate-100 mt-4 mx-auto w-3/4"></div>
                </div>

                {/* Prime */}
                <div className="text-center">
                    <p className="text-sm text-slate-500 mb-2">₹{ticketPrices.prime} PRIME</p>
                    {["E", "D", "C"].map((row) => (
                        <div key={row} className="flex justify-center items-center gap-8 mb-1">
                            <div className="flex items-center gap-1">
                                <span className="w-4 text-xs font-semibold text-slate-400 mr-2">{row}</span>
                                {renderRow(row, 1, 3, ticketPrices.prime)}
                            </div>
                            <div className="flex items-center gap-1">
                                {renderRow(row, 4, 9, ticketPrices.prime)}
                            </div>
                        </div>
                    ))}
                    <div className="border-b border-slate-100 mt-4 mx-auto w-3/4"></div>
                </div>

                {/* Classic */}
                <div className="text-center">
                    <p className="text-sm text-slate-500 mb-2">₹{ticketPrices.classic} CLASSIC</p>
                    {["B", "A"].map((row) => (
                        <div key={row} className="flex justify-center items-center gap-8 mb-1">
                            <div className="flex items-center gap-1">
                                <span className="w-4 text-xs font-semibold text-slate-400 mr-2">{row}</span>
                                {renderRow(row, 1, 3, ticketPrices.classic)}
                            </div>
                            <div className="flex items-center gap-1">
                                {renderRow(row, 4, 9, ticketPrices.classic)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Legend */}
            <div className="mt-12 flex items-center gap-6 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-white border border-green-400 rounded"></div>
                    <span>Available</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded border border-green-500"></div>
                    <span>Selected</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-slate-300 rounded border border-slate-300"></div>
                    <span>Sold</span>
                </div>
            </div>
        </div>
    );
};

export default SeatSelection;
