"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { getAllBookingsAdmin } from "@/app/services/booking";
import Navbar from "@/app/components/Navbar";
import { Loader2, Calendar, MapPin, Clock, Ticket, User, Film, AlertCircle } from "lucide-react";
import { ROUTES } from "@/app/routes";

export default function AdminBookingsPage() {
    const { isAuthenticated, isLoading, user } = useAuth();
    const router = useRouter();
    const [bookings, setBookings] = useState<any[]>([]);
    const [loadingBookings, setLoadingBookings] = useState(true);
    const [error, setError] = useState("");

    const userRole = (user?.userRole || user?.role || "").toLowerCase();

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                router.push(ROUTES.LOGIN);
                return;
            }
            if (userRole !== "admin") {
                router.push(ROUTES.HOME);
                return;
            }
        }

        const fetchAllBookings = async () => {
            if (user?.token) {
                try {
                    const data = await getAllBookingsAdmin(user.token);
                    setBookings(data.data || []);
                } catch (err) {
                    console.error(err);
                    setError("Failed to fetch all bookings");
                } finally {
                    setLoadingBookings(false);
                }
            }
        };

        if (isAuthenticated && userRole === "admin") {
            fetchAllBookings();
        }
    }, [isAuthenticated, isLoading, user, userRole, router]);

    if (isLoading || loadingBookings) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (!user || userRole !== "admin") return null;

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="pt-28 max-w-7xl mx-auto px-6">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-800">All Bookings (Admin)</h1>
                    <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-4 py-1.5 rounded-full">
                        Total Bookings: {bookings.length}
                    </span>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        {error}
                    </div>
                )}

                {bookings.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-slate-100">
                        <Ticket className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-slate-900 mb-2">No bookings found</h3>
                        <p className="text-slate-500">There are no bookings in the system yet.</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {bookings.map((booking) => (
                            <div key={booking._id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                                <div className="grid md:grid-cols-4 gap-6">
                                    {/* Movie Info */}
                                    <div className="md:col-span-1">
                                        <h3 className="font-bold text-lg text-slate-900 mb-1 flex items-center gap-2">
                                            <Film className="w-4 h-4 text-indigo-600" />
                                            {typeof booking.movieId === 'object' ? booking.movieId?.name : 'Movie Unavailable'}
                                        </h3>
                                        <div className="flex items-center gap-1 text-sm text-slate-500 mb-2">
                                            <MapPin className="w-3.5 h-3.5" />
                                            {typeof booking.theatreId === 'object' ? booking.theatreId?.name : 'Theatre Unavailable'}
                                        </div>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${booking.status === 'successful' ? 'bg-green-100 text-green-700' :
                                                booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {booking.status.toUpperCase()}
                                        </span>
                                    </div>

                                    {/* User Info */}
                                    <div className="md:col-span-1 border-t md:border-t-0 md:border-l border-slate-100 md:pl-6 pt-4 md:pt-0">
                                        <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-2 text-sm">
                                            <User className="w-4 h-4 text-slate-400" />
                                            User Details
                                        </h4>
                                        <p className="text-sm font-medium text-slate-900">
                                            {typeof booking.userId === 'object' ? booking.userId?.name : 'Unknown User'}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {typeof booking.userId === 'object' ? booking.userId?.email : ''}
                                        </p>
                                    </div>

                                    {/* Booking Details */}
                                    <div className="md:col-span-1 border-t md:border-t-0 md:border-l border-slate-100 md:pl-6 pt-4 md:pt-0 space-y-2">
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
                                    </div>

                                    {/* Cost & Seats */}
                                    <div className="md:col-span-1 border-t md:border-t-0 md:border-l border-slate-100 md:pl-6 pt-4 md:pt-0 space-y-2">
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
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
