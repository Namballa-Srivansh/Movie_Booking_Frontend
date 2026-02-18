"use client";

import { use, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { ROUTES } from "@/app/routes";
import Navbar from "@/app/components/Navbar";
import SeatSelection from "@/app/components/SeatSelection"; // Import SeatSelection
import { Loader2 } from "lucide-react";
import { getShowById } from "@/app/services/show";
import { createBooking } from "@/app/services/booking";

export default function BookShowPage({ params }: { params: Promise<{ id: string }> }) {
    const { isAuthenticated, isLoading, user } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const dateQuery = searchParams.get("date");
    const resolvedParams = use(params);
    const showId = resolvedParams.id;
    const [show, setShow] = useState<any>(null);
    const [seats, setSeats] = useState(0); // Initialize to 0
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]); // To store selected seat IDs
    const [totalCost, setTotalCost] = useState(0); // To store total cost
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
                showId: show._id,
                bookingDate: dateQuery ? new Date(dateQuery) : new Date(), // Use selected date
                timings: show.timings,
                noOfSeats: seats,
                seats: selectedSeats, // Pass selected seats
                totalCost: totalCost, // Pass calculated total cost
            };

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

    const formattedDate = dateQuery
        ? new Date(dateQuery).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })
        : (show?.date || "Today");

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (!isAuthenticated) {
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
                                        <p className="font-semibold text-slate-800">{formattedDate} | {show.timings}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-slate-500 block">Ticket Price</label>
                                        <p className="font-semibold text-indigo-600">₹{show.price}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Booking Form */}
                        <div className="col-span-1 md:col-span-2 bg-slate-50 p-6 rounded-xl border border-slate-100">
                            <h2 className="text-xl font-bold text-slate-900 mb-6 text-center">Select Seats</h2>

                            <SeatSelection
                                bookedSeats={show.bookedSeats || []}
                                ticketPrices={show.ticketPrice || { recliner: 340, primePlus: 200, prime: 170, classic: 150 }}
                                onSelectionChange={(selected, cost) => {
                                    setSeats(selected.length);
                                    setSelectedSeats(selected); // We need to add this state
                                    setTotalCost(cost);         // We need to add this state
                                }}
                            />

                            <div className="mt-8 max-w-md mx-auto space-y-6">
                                <div className="bg-white p-4 rounded-lg border border-slate-200 flex justify-between items-center shadow-sm">
                                    <span className="text-slate-600 font-medium">Selected Seats</span>
                                    <span className="font-semibold text-slate-900">
                                        {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}
                                    </span>
                                </div>

                                <div className="bg-white p-4 rounded-lg border border-slate-200 flex justify-between items-center shadow-sm">
                                    <span className="text-slate-600 font-medium">Total Cost</span>
                                    <span className="text-2xl font-bold text-indigo-600">
                                        ₹{totalCost}
                                    </span>
                                </div>

                                {error && (
                                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center">
                                        {error}
                                    </div>
                                )}


                                {(() => {
                                    const showDate = dateQuery ? new Date(dateQuery) : new Date(show.date);
                                    const currentTime = new Date();

                                    // Parse show timing (e.g., "10:00 AM")
                                    const timingParts = show.timings.match(/(\d+):(\d+)\s*(AM|PM)/);
                                    if (timingParts) {
                                        let hours = parseInt(timingParts[1]);
                                        const minutes = parseInt(timingParts[2]);
                                        const period = timingParts[3];

                                        if (period === "PM" && hours !== 12) hours += 12;
                                        if (period === "AM" && hours === 12) hours = 0;

                                        showDate.setHours(hours, minutes, 0, 0);
                                    }

                                    const isExpired = showDate < currentTime;

                                    return (
                                        <>
                                            {isExpired && (
                                                <div className="p-3 bg-amber-50 text-amber-600 text-sm rounded-lg text-center font-medium">
                                                    This show has already started or passed.
                                                </div>
                                            )}

                                            <button
                                                onClick={handleBooking}
                                                disabled={isBooking || selectedSeats.length === 0 || isExpired}
                                                className={`w-full py-3 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all 
                                                ${isBooking || selectedSeats.length === 0 || isExpired
                                                        ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                                                        : "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-xl active:scale-[0.98]"
                                                    }`}
                                            >
                                                {isBooking ? (
                                                    <>
                                                        <Loader2 className="w-5 h-5 animate-spin" />
                                                        Processing...
                                                    </>
                                                ) : isExpired ? (
                                                    "Show Expired"
                                                ) : (
                                                    "Confirm Booking"
                                                )}
                                            </button>
                                        </>
                                    );
                                })()}
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
