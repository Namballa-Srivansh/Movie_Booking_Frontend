"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { ROUTES } from "@/app/routes";
import Navbar from "@/app/components/Navbar";
import { Loader2 } from "lucide-react";
import { getShowById } from "@/app/services/show";
import { createBooking } from "@/app/services/booking";

export default function BookShowPage({ params }: { params: Promise<{ id: string }> }) {
    const { isAuthenticated, isLoading, user } = useAuth();
    const router = useRouter();
    const resolvedParams = use(params);
    const showId = resolvedParams.id;
    const [show, setShow] = useState<any>(null);
    const [seats, setSeats] = useState(1);
    const [isBooking, setIsBooking] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchShow = async () => {
            try {
                const data = await getShowById(showId);
                setShow(data.data);
            } catch (err) {
                console.error(err);
                setError("Failed to load show details");
            }
        };

        if (showId) {
            fetchShow();
        }
    }, [showId]);

    const handleBooking = async () => {
        setIsBooking(true);
        setError("");

        try {
            const bookingData = {
                movieId: show.movieId._id,
                theatreId: show.theatreId._id,
                timings: show.timings,
                noOfSeats: seats,
                totalCost: show.price * seats,
            };

            // I'll leave userId out for now and rely on backend/token, or I'll need to update AuthContext to expose user ID.

            await createBooking(bookingData, user?.token || "");

            // Success
            alert("Booking successful!");
            router.push(ROUTES.BOOKINGS); // Redirect to bookings
        } catch (err: any) {
            setError(err.message || "Booking failed");
        } finally {
            setIsBooking(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (!isAuthenticated) {
        // Redirect to login or show message
        router.push(ROUTES.LOGIN);
        return null;
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="pt-28 max-w-7xl mx-auto px-6">
                <h1 className="text-3xl font-bold text-slate-800 mb-8">Book Tickets</h1>

                {show ? (
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 grid md:grid-cols-2 gap-12">
                        {/* Show Details */}
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 mb-4">Show Details</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-slate-500 block">Movie</label>
                                    <p className="font-semibold text-slate-800">{show.movieId?.name}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-slate-500 block">Theatre</label>
                                    <p className="font-semibold text-slate-800">{show.theatreId?.name}</p>
                                    <p className="text-sm text-slate-600">{show.theatreId?.address}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm text-slate-500 block">Date & Time</label>
                                        <p className="font-semibold text-slate-800">{show.date} | {show.timings}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-slate-500 block">Ticket Price</label>
                                        <p className="font-semibold text-indigo-600">₹{show.price}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Booking Form */}
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                            <h2 className="text-xl font-bold text-slate-900 mb-6">Select Seats</h2>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Number of Seats
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="10"
                                        value={seats}
                                        onChange={(e) => setSeats(Number(e.target.value))}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-900 bg-white"
                                    />
                                </div>

                                <div className="bg-white p-4 rounded-lg border border-slate-200 flex justify-between items-center">
                                    <span className="text-slate-600 font-medium">Total Cost</span>
                                    <span className="text-2xl font-bold text-indigo-600">
                                        ₹{show.price * seats}
                                    </span>
                                </div>

                                {error && (
                                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                                        {error}
                                    </div>
                                )}

                                <button
                                    onClick={handleBooking}
                                    disabled={isBooking}
                                    className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-indigo-700 hover:shadow-xl transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isBooking ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        "Confirm Booking"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-4" />
                        <p className="text-slate-500">Loading show details...</p>
                    </div>
                )}
            </div>
        </div>
    );
}
