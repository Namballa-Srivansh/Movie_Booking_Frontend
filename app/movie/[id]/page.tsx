"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getMovieById, deleteMovie } from "@/app/services/movie";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { Loader2, Calendar, Clock, Globe, User, Play, Edit, Trash } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";
import { ROUTES } from "@/app/routes";

interface Movie {
    _id: string;
    id?: string;
    name: string;
    description: string;
    casts: string[];
    trailerUrl: string;
    language: string;
    releaseDate: string;
    director: string;
    releaseStatus: string;
    posterUrl?: string;
    owner?: string; // Assuming the API returns an owner field
    userId?: string; // Alternative check
}

export default function MovieDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const [movie, setMovie] = useState<Movie | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                if (params.id) {
                    const data = await getMovieById(params.id as string);
                    console.log("Fetched Movie Data:", data); // Debugging
                    setMovie(data.data || data);
                }
            } catch (err: any) {
                setError(err.message || "Failed to load movie details");
            } finally {
                setIsLoading(false);
            }
        };

        fetchMovie();
    }, [params.id]);

    const handleDelete = async () => {
        if (!movie) return;

        if (confirm("Are you sure you want to delete this movie? This action cannot be undone.")) {
            try {
                setIsLoading(true);
                const token = user?.token || user?.accessToken || "";
                await deleteMovie(movie._id || movie.id || "", token);
                // Force a hard refresh/revalidation if needed, or just redirect
                router.push(ROUTES.MOVIES);
                router.refresh();
            } catch (err: any) {
                setError(err.message || "Failed to delete movie");
                setIsLoading(false);
            }
        }
    };

    const userRole = (user?.userRole || user?.role || "").toLowerCase();
    const isOwner = user && movie && (userRole === "owner" || userRole === "admin") && (user.id === (movie.owner || movie.userId));

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (error || !movie) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Movie Not Found</h2>
                <p className="text-slate-500 mb-6">{error || "The requested movie could not be found."}</p>
                <Link
                    href={ROUTES.HOME}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
                >
                    Back to Home
                </Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50">
            <Navbar transparent={true} />

            {/* Hero Section */}
            <div className="relative h-[60vh] w-full overflow-hidden bg-slate-900">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent z-10" />

                {/* Movie Poster Background */}
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-50 transition-opacity duration-700"
                    style={{
                        backgroundImage: `url('${movie.posterUrl || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2525&auto=format&fit=crop"}')`
                    }}
                />

                <div className="absolute bottom-0 left-0 right-0 z-20 container mx-auto px-6 py-12">
                    <div className="max-w-4xl">
                        <div className="flex flex-wrap items-center gap-3 mb-4 text-sm font-medium text-indigo-400">
                            <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full backdrop-blur-sm">
                                {movie.releaseStatus}
                            </span>
                            <span className="flex items-center gap-1 text-slate-300">
                                <Globe className="w-4 h-4" /> {movie.language}
                            </span>
                            <span className="flex items-center gap-1 text-slate-300">
                                <Calendar className="w-4 h-4" /> {movie.releaseDate ? new Date(movie.releaseDate).toLocaleDateString() : 'N/A'}
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
                            {movie.name}
                        </h1>

                        {isOwner && (
                            <div className="mt-4 flex flex-wrap gap-3">
                                <button
                                    onClick={() => router.push(`${ROUTES.MOVIE_DETAILS}/${movie._id || movie.id}/edit`)}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-amber-500/20"
                                >
                                    <Edit className="w-4 h-4" />
                                    Edit Movie
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-red-600/20"
                                >
                                    <Trash className="w-4 h-4" />
                                    Delete Movie
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Info */}
                    <div className="lg:col-span-2 space-y-10">
                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">Synopsis</h2>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                {movie.description}
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Cast & Crew</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                    <h3 className="flex items-center gap-2 text-indigo-600 font-semibold mb-3">
                                        <User className="w-5 h-5" /> Director
                                    </h3>
                                    <p className="text-slate-800 font-medium text-lg">{movie.director || 'Unknown Director'}</p>
                                </div>
                                <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                    <h3 className="flex items-center gap-2 text-indigo-600 font-semibold mb-3">
                                        <User className="w-5 h-5" /> Cast
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {(movie.casts || []).length > 0 ? (
                                            (movie.casts || []).map((actor, idx) => (
                                                <span key={idx} className="px-3 py-1 bg-slate-100/80 rounded-lg text-slate-700 font-medium">
                                                    {actor}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-slate-400 italic">No cast listed</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Sidebar / Trailer */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm sticky top-24">
                            <h3 className="text-xl font-bold text-slate-900 mb-4">Official Trailer</h3>
                            <div className="aspect-video bg-slate-900 rounded-xl overflow-hidden relative group cursor-pointer">
                                {/* Placeholder for trailer - in real app would use iframe or video player */}
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-all">
                                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-all">
                                        <Play className="w-8 h-8 text-white fill-white ml-1" />
                                    </div>
                                </div>
                                <img
                                    src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2670&auto=format&fit=crop"
                                    className="w-full h-full object-cover"
                                    alt="Trailer thumbnail"
                                />
                            </div>
                            <div className="mt-6 space-y-4">
                                <button className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 transition-all">
                                    Book Tickets
                                </button>
                                <p className="text-center text-xs text-slate-400">
                                    Booking opens 2 days before release
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
