"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getTheatreById, deleteTheatre } from "@/app/services/theatre";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { Loader2, MapPin, Building2, Film, ArrowLeft, Edit, Trash } from "lucide-react";
import Link from 'next/link';
import { useAuth } from "@/app/context/AuthContext";
import { ROUTES } from "@/app/routes";

interface Movie {
    _id: string;
    name: string;
    posterUrl?: string; // Assuming posterUrl might be available or added later
}

interface Theatre {
    _id: string;
    id?: string;
    name: string;
    description?: string;
    city: string;
    pincode: number;
    address?: string;
    movies?: Movie[];
    owner: string;
}

export default function TheatreDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const [theatre, setTheatre] = useState<Theatre | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchTheatre = async () => {
            try {
                if (params.theatreId) {
                    const response = await getTheatreById(params.theatreId as string);
                    setTheatre(response.data || response);
                }
            } catch (err: any) {
                console.error("Failed to fetch theatre:", err);
                setError(err.message || "Failed to load theatre details");
            } finally {
                setIsLoading(false);
            }
        };

        fetchTheatre();
    }, [params.theatreId]);

    const handleDelete = async () => {
        if (!theatre) return;

        if (confirm("Are you sure you want to delete this theatre? This action cannot be undone.")) {
            try {
                setIsLoading(true);
                const token = user?.token || user?.accessToken || "";
                await deleteTheatre(theatre._id || theatre.id || "", token);
                router.push(ROUTES.THEATRES);
                router.refresh();
            } catch (err: any) {
                console.error("Failed to delete theatre:", err);
                setError(err.message || "Failed to delete theatre");
                setIsLoading(false);
            }
        }
    };

    const userRole = (user?.userRole || user?.role || "").toLowerCase();
    const userId = user?.id || (user as any)?._id;
    const theatreOwnerId = theatre?.owner && typeof theatre.owner === 'object' ? (theatre.owner as any)._id : theatre?.owner;

    // Allow access if user is admin OR if user is owner and IDs match
    const canEdit = user && theatre && (userRole === "admin" || (userRole === "owner" && userId === theatreOwnerId));


    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (error || !theatre) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Theatre Not Found</h2>
                <p className="text-slate-500 mb-6">{error || "The requested theatre could not be found."}</p>
                <Link
                    href="/theatres"
                    className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
                >
                    Back to Theatres
                </Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />

            <div className="flex-grow pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pb-16">

                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-6"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                </button>

                {/* Theatre Header */}
                <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm mb-8">
                    <div className="h-48 bg-gradient-to-r from-indigo-900 to-slate-900 relative">
                        <div className="absolute inset-0 flex items-center justify-center opacity-20">
                            <Building2 className="w-32 h-32 text-white" />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 bg-gradient-to-t from-black/60 to-transparent flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{theatre.name}</h1>
                                <div className="flex items-center gap-2 text-slate-200 text-sm md:text-base">
                                    <MapPin className="w-4 h-4" />
                                    <span>{theatre.address}, {theatre.city} - {theatre.pincode}</span>
                                </div>
                            </div>

                            {canEdit && (
                                <div className="flex gap-3 mt-4 md:mt-0">
                                    <button
                                        onClick={() => router.push(`/theatres/${theatre._id || theatre.id}/edit`)}
                                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium"
                                    >
                                        <Edit className="w-4 h-4" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors border border-red-100 font-medium"
                                    >
                                        <Trash className="w-4 h-4" />
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-6 md:p-8">
                        {theatre.description && (
                            <div className="mb-8">
                                <h2 className="text-lg font-semibold text-slate-900 mb-3">About</h2>
                                <p className="text-slate-600 leading-relaxed text-lg">
                                    {theatre.description}
                                </p>
                            </div>
                        )}

                        {/* Movies Section */}
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-indigo-100 rounded-lg">
                                    <Film className="w-5 h-5 text-indigo-600" />
                                </div>
                                <h2 className="text-xl font-bold text-slate-900">Now Showing</h2>
                            </div>

                            {theatre.movies && theatre.movies.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {theatre.movies.map((movie) => (
                                        <Link
                                            href={`/movie/${movie._id}`}
                                            key={movie._id}
                                            className="group block bg-slate-50 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all p-4"
                                        >
                                            <div className="aspect-[2/3] bg-slate-200 rounded-lg mb-3 overflow-hidden text-center relative">
                                                {/* Placeholder for movie poster if not available */}
                                                <div className="absolute inset-0 flex items-center justify-center text-slate-400 bg-slate-200">
                                                    <Film className="w-8 h-8" />
                                                </div>
                                            </div>
                                            <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                                                {movie.name}
                                            </h3>
                                            <p className="text-xs text-slate-500 mt-1">Click to view details</p>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
                                    <p className="text-slate-500">No movies currently showing at this theatre.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
