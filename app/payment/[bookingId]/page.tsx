"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { ROUTES } from "@/app/routes";
import { getBookingById } from "@/app/services/booking";
import { makePayment } from "@/app/services/payment";
import Navbar from "@/app/components/Navbar";
import { Loader2, Calendar, MapPin, Clock, Ticket, CreditCard, ArrowLeft } from "lucide-react";

export default function PaymentPage() {
    const { isAuthenticated, isLoading, user } = useAuth();
    const router = useRouter();
    const params = useParams();
    const bookingId = params.bookingId as string;

    const [booking, setBooking] = useState<any>(null);
    const [loadingBooking, setLoadingBooking] = useState(true);
    const [processingPayment, setProcessingPayment] = useState(false);
    const [error, setError] = useState("");
    const [userAmount, setUserAmount] = useState("");

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push(ROUTES.LOGIN);
        }

        const fetchBookingDetails = async () => {
            if (user?.token && bookingId) {
                try {
                    const data = await getBookingById(bookingId, user.token);
                    setBooking(data.data);
                } catch (err) {
                    console.error(err);
                    setError("Failed to fetch booking details");
                } finally {
                    setLoadingBooking(false);
                }
            }
        };

        if (isAuthenticated && user && bookingId) {
            fetchBookingDetails();
        }
    }, [isAuthenticated, isLoading, user, router, bookingId]);

    const handlePayment = async () => {
        if (!user?.token || !booking) return;

        const amountToPay = Number(userAmount);
        if (isNaN(amountToPay) || amountToPay < booking.totalCost) {
            alert(`Please enter an amount equal to or greater than ₹${booking.totalCost}`);
            return;
        }

        setProcessingPayment(true);
        try {
            await makePayment(booking.totalCost, booking._id, user.token);
            alert("Payment successful!");
            router.push(ROUTES.BOOKINGS);
        } catch (err: any) {
            console.error(err);
            if (err.message.toLowerCase().includes("expired")) {
                setBooking((prev: any) => ({ ...prev, status: 'EXPIRED' }));
                alert("Payment Session Expired. Please book again.");
            } else {
                alert(`Payment failed: ${err.message}`);
            }
        } finally {
            setProcessingPayment(false);
        }
    };

    if (isLoading || loadingBooking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (error || !booking) {
        return (
            <div className="min-h-screen bg-slate-50">
                <Navbar />
                <div className="pt-28 max-w-lg mx-auto px-6 text-center">
                    <h1 className="text-2xl font-bold text-slate-800 mb-4">Error</h1>
                    <p className="text-red-500 mb-6">{error || "Booking not found"}</p>
                    <button
                        onClick={() => router.push(ROUTES.BOOKINGS)}
                        className="flex items-center justify-center gap-2 mx-auto px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Bookings
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="pt-28 max-w-2xl mx-auto px-6">
                <button
                    onClick={() => router.push(ROUTES.BOOKINGS)}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mb-6"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </button>

                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-6 sm:px-10 sm:py-8 text-white">
                        <h1 className="text-2xl font-bold mb-2">Payment Details</h1>
                        <p className="opacity-90">Complete your booking for {booking.movieId?.name}</p>
                    </div>

                    <div className="p-6 sm:p-10 space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-sm font-medium text-slate-500 mb-1">Movie</h3>
                                <p className="text-lg font-semibold text-slate-800">{booking.movieId?.name}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-slate-500 mb-1">Theatre</h3>
                                <div className="flex items-center gap-1.5 text-lg font-semibold text-slate-800">
                                    <MapPin className="w-4 h-4 text-slate-400" />
                                    {booking.theatreId?.name}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-slate-500 mb-1">Date & Time</h3>
                                <div className="flex items-center gap-2 text-slate-800">
                                    <Calendar className="w-4 h-4 text-slate-400" />
                                    <span>{new Date(booking.createdAt).toLocaleDateString()} at {booking.timings}</span>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-slate-500 mb-1">Seats</h3>
                                <div className="flex items-center gap-2 text-slate-800">
                                    <Ticket className="w-4 h-4 text-slate-400" />
                                    <span>{booking.noOfSeats} Seats</span>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-slate-100 pt-6 mt-6">
                            <div className="space-y-2 mb-6">
                                <label className="text-sm font-medium text-slate-700">Enter Payment Amount</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">₹</span>
                                    <input
                                        type="number"
                                        value={userAmount}
                                        onChange={(e) => setUserAmount(e.target.value)}
                                        className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-800 font-semibold placeholder:font-normal"
                                        placeholder={`Minimum ${booking.totalCost}`}
                                    />
                                </div>
                                <p className="text-xs text-slate-500">
                                    Please enter an amount equal to or greater than the total cost.
                                </p>
                            </div>

                            <div className="flex justify-between items-center mb-6">
                                <span className="text-lg font-medium text-slate-800">Total Amount</span>
                                <span className="text-3xl font-bold text-indigo-600">₹{booking.totalCost}</span>
                            </div>

                            {booking.status === 'EXPIRED' ? (
                                <div className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-red-100 text-red-600 rounded-xl font-bold text-lg">
                                    Payment Expired
                                </div>
                            ) : (
                                <>
                                    <button
                                        onClick={handlePayment}
                                        disabled={processingPayment}
                                        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform active:scale-[0.98]"
                                    >
                                        {processingPayment ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Processing Payment...
                                            </>
                                        ) : (
                                            <>
                                                <CreditCard className="w-5 h-5" />
                                                Pay ₹{booking.totalCost}
                                            </>
                                        )}
                                    </button>
                                    <p className="text-center text-sm text-slate-400 mt-4">
                                        Secure payment processing
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
