"use client";

import { useState, useEffect } from "react";
import Navbar from "@/app/components/Navbar";
import Link from "next/link";
import { ROUTES } from "@/app/routes";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { getAllShows, deleteShow } from "@/app/services/show";
import { Loader2, Calendar } from "lucide-react";
import ShowCard from "@/app/components/ShowCard";

export default function ShowsPage() {
    const { user, isAuthenticated } = useAuth();
    const searchParams = useSearchParams();
    const movieId = searchParams.get("movieId");
    const [shows, setShows] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchShows = async () => {
            try {
                const filters = movieId ? { movieId } : undefined;
                const data = await getAllShows(filters);
                setShows(data.data || []); // Adjust based on API response structure
            } catch (err: any) {
                setError(err.message || "Failed to load shows");
            } finally {
                setIsLoading(false);
            }
        };

        fetchShows();
    }, [movieId]);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this show?")) return;

        try {
            const token = user?.token || user?.accessToken;
            if (!token) throw new Error("Authentication required");

            await deleteShow(id, token);
            setShows(prev => prev.filter(show => show._id !== id));
        } catch (err: any) {
            alert(err.message || "Failed to delete show");
        }
    };

    const userRole = (user?.userRole || user?.role || "").toLowerCase();
    const canEdit = isAuthenticated && (userRole === "owner" || userRole === "admin");

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <Navbar />

            <div className="pt-28 max-w-7xl mx-auto px-6">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-800">All Shows</h1>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {shows.length === 0 && !error ? (
                    <div className="text-center py-20 text-slate-500">
                        <Calendar className="w-16 h-16 mx-auto mb-4 opacity-20" />
                        <p className="text-lg">No shows available at the moment.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {shows.map((show) => (
                            <ShowCard
                                key={show._id}
                                show={show}
                                onDelete={handleDelete}
                                canEdit={canEdit}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
