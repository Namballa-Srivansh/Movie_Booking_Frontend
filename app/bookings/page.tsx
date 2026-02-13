"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { ROUTES } from "@/app/routes";
import { getBookings } from "@/app/services/booking";
import { makePayment } from "@/app/services/payment";
import Navbar from "@/app/components/Navbar";
import { Loader2, Calendar, MapPin, Clock, Ticket, CreditCard, CheckCircle, XCircle } from "lucide-react";

export default function BookingsPage() {
    const { isAuthenticated, isLoading, user } = useAuth();
    const router = useRouter();
    const [bookings, setBookings] = useState<any[]>([]);
    const [loadingBookings, setLoadingBookings] = useState(true);
    const [error, setError] = useState("");
    const [processingPaymentId, setProcessingPaymentId] = useState<string | null>(null);

    const fetchBookings = async () => {
        if (user?.token) {
            try {
                const data = await getBookings(user.token);
                setBookings(data.data || []);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch bookings");
            } finally {
                setLoadingBookings(false);
            }
        }
    };

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push(ROUTES.LOGIN);
        }

        if (isAuthenticated && user) {
            fetchBookings();
        }
    }, [isAuthenticated, isLoading, user, router]);

    const handlePayment = async (bookingId: string, amount: number) => {
        if (!user?.token) return;

        setProcessingPaymentId(bookingId);
        try {
            await makePayment(amount, bookingId, user.token);
            // Refresh bookings to reflect new status
            await fetchBookings();
            alert("Payment successful!");
        } catch (err: any) {
            console.error(err);
            alert(`Payment failed: ${err.message}`);
            // Refresh bookings anyway to check if status expired
            await fetchBookings();
        } finally {
            setProcessingPaymentId(null);
        }
    };

    if (isLoading || loadingBookings) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="pt-28 max-w-7xl mx-auto px-6">
                <h1 className="text-3xl font-bold text-slate-800 mb-8">My Bookings</h1>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {bookings.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-slate-100">
                        <Ticket className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-slate-900 mb-2">No bookings yet</h3>
                        <p className="text-slate-500 mb-6">You haven't booked any tickets yet.</p>
                        <button
                            onClick={() => router.push(ROUTES.MOVIES)}
                            className="px-6 py-2.5 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition-colors"
                        >
                            Browse Movies
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {bookings.map((booking) => (
                            <div key={booking._id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-900 mb-1">
                                            {typeof booking.movieId === 'object' ? booking.movieId?.name : 'Movie Name Unavailable'}
                                        </h3>
                                        <div className="flex items-center gap-1 text-sm text-slate-500">
                                            <MapPin className="w-3.5 h-3.5" />
                                            {typeof booking.theatreId === 'object' ? booking.theatreId?.name : 'Theatre Unavailable'}
                                        </div>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${booking.status === 'successful' ? 'bg-green-100 text-green-700' :
                                        booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                            booking.status === 'expired' ? 'bg-gray-100 text-gray-700' :
                                                'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {booking.status.toUpperCase()}
                                    </span>
                                </div>

                                <div className="space-y-3 pt-4 border-t border-slate-50">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500 flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            Date
                                        </span>
                                        <span className="font-medium text-slate-700">
                                            {new Date(booking.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500 flex items-center gap-2">
                                            <Clock className="w-4 h-4" />
                                            Time
                                        </span>
                                        <span className="font-medium text-slate-700">
                                            {booking.timings}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500 flex items-center gap-2">
                                            <Ticket className="w-4 h-4" />
                                            Seats
                                        </span>
                                        <span className="font-medium text-slate-700">
                                            {booking.noOfSeats}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm pt-2 border-t border-slate-50 mt-2">
                                        <span className="font-medium text-slate-700">Total Cost</span>
                                        <span className="font-bold text-indigo-600">₹{booking.totalCost}</span>
                                    </div>
                                </div>

                                {booking.status === 'PROCESSING' && (
                                    <div className="mt-6 pt-4 border-t border-slate-50">
                                        <button
                                            onClick={() => handlePayment(booking._id, booking.totalCost)}
                                            disabled={processingPaymentId === booking._id}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
                                        >
                                            {processingPaymentId === booking._id ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    <CreditCard className="w-4 h-4" />
                                                    Pay Now
                                                </>
                                            )}
                                        </button>
                                        <p className="text-xs text-center text-slate-400 mt-2">
                                            Finish payment to confirm seats
                                        </p>
                                    </div>
                                )}

                                {booking.status === 'EXPIRED' && (
                                    <div className="mt-6 pt-4 border-t border-slate-50 flex flex-col items-center justify-center text-red-500">
                                        <XCircle className="w-8 h-8 mb-2" />
                                        <span className="font-medium">Payment Expired</span>
                                    </div>
                                )}

                                {booking.status === 'SUCCESSFUL' && (
                                    <div className="mt-6 pt-4 border-t border-slate-50 flex flex-col items-center justify-center text-green-600">
                                        <CheckCircle className="w-8 h-8 mb-2" />
                                        <span className="font-medium">Payment Successful</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}


