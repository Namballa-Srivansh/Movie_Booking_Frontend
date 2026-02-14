"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getMovieById, deleteMovie } from "@/app/services/movie";
import { getOptimizedImageUrl } from "@/app/utils/cloudinary";
import { getAllShows } from "@/app/services/show";
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
    poster?: string;
    posterUrl?: string;
    owner?: string;
    userId?: string;
}

export default function MovieDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const [movie, setMovie] = useState<Movie | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

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

    const handleBookTickets = async () => {
        try {
            const movieId = movie?._id || movie?.id;
            if (!movieId) return;

            setIsLoading(true);
            const response = await getAllShows({ movieId });
            const shows = response.data || [];

            if (shows.length > 0) {
                router.push(`${ROUTES.SHOWS}?movieId=${movieId}`);
            } else {
                alert("No show available with this movie");
            }
        } catch (error) {
            console.error("Error checking shows:", error);
            alert("Failed to check show availability");
        } finally {
            setIsLoading(false);
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
            <div className="relative w-full overflow-hidden bg-slate-900">
                {/* Movie Poster Background with visual enhancements */}
                <div className="absolute inset-0 z-0 bg-slate-900 pointer-events-none">
                    {/* Background Image */}
                    <div className="absolute inset-0 w-full h-full">
                        <img
                            src={getOptimizedImageUrl(movie.poster || movie.posterUrl, 'background') || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2525&auto=format&fit=crop"}
                            alt="Background"
                            className="w-full h-full object-cover object-top opacity-80"
                        />
                    </div>

                    {/* Gradient Overlay (User Requested Style) */}
                    <div
                        className="absolute inset-0"
                        style={{
                            background: 'linear-gradient(90deg, rgb(15, 23, 42) 24.97%, rgb(15, 23, 42) 38.3%, rgba(15, 23, 42, 0.04) 97.47%, rgb(15, 23, 42) 100%)'
                        }}
                    />
                </div>

                <div className="relative z-10 container mx-auto px-6 py-12 md:py-20">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Poster Card - Left Side */}
                        <div className="shrink-0 w-54 md:w-62 rounded-xl overflow-hidden shadow-2xl border border-white/10 mx-auto md:mx-0">
                            <img
                                src={getOptimizedImageUrl(movie.poster || movie.posterUrl, 'poster') || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2525&auto=format&fit=crop"}
                                alt={movie.name}
                                className="w-full h-auto object-cover"
                            />
                            <div className="bg-black text-white text-center py-2 text-xs font-medium uppercase tracking-wider">
                                In cinemas
                            </div>
                        </div>

                        {/* Movie Details - Right Side */}
                        <div className="flex-1 text-white pt-2">
                            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight leading-tight">
                                {movie.name}
                            </h1>

                            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm font-medium text-slate-300">
                                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-md text-white border border-white/10">
                                    {movie.language}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {/* Estimated duration for visual completeness if not available */}
                                    2h 30m
                                </span>
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {movie.releaseDate ? new Date(movie.releaseDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                                </span>
                                <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs uppercase border border-indigo-500/30">
                                    {movie.releaseStatus}
                                </span>
                            </div>

                            {/* Synopsis in Hero for quick context (optional, based on design) */}
                            <p className="text-slate-300 text-lg leading-relaxed max-w-2xl mb-8 line-clamp-3">
                                {movie.description}
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <button
                                    onClick={handleBookTickets}
                                    className="px-8 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg shadow-lg shadow-rose-600/30 transition-all transform hover:scale-105 active:scale-95"
                                >
                                    Book Tickets
                                </button>

                                {movie.trailerUrl && (
                                    <button
                                        onClick={() => window.open(movie.trailerUrl, '_blank')}
                                        className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-semibold rounded-lg border border-white/30 transition-all flex items-center gap-2"
                                    >
                                        <Play className="w-4 h-4 fill-current" />
                                        Trailer
                                    </button>
                                )}
                            </div>

                            {isOwner && (
                                <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap gap-3">
                                    <button
                                        onClick={() => router.push(`${ROUTES.MOVIE_DETAILS}/${movie._id || movie.id}/edit`)}
                                        className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-medium rounded-lg border border-amber-500/30 transition-colors"
                                    >
                                        <Edit className="w-4 h-4" />
                                        Edit Movie
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-medium rounded-lg border border-red-500/30 transition-colors"
                                    >
                                        <Trash className="w-4 h-4" />
                                        Delete Movie
                                    </button>
                                </div>
                            )}
                        </div>
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
                                {isPlaying && movie?.trailerUrl ? (
                                    <iframe
                                        src={(() => {
                                            const url = movie.trailerUrl;
                                            let videoId = "";

                                            // Handle various YouTube URL formats
                                            const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^#&?]*)/);
                                            if (match && match[1]) {
                                                videoId = match[1];
                                            }

                                            // Fallback if regex fails but simple replacement might work (unlikely but safe)
                                            if (!videoId) {
                                                if (url.includes('embed/')) return url; // Already an embed URL
                                                return url; // Return original if unknown format
                                            }

                                            return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
                                        })()}
                                        title="Official Trailer"
                                        className="w-full h-full"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        referrerPolicy="strict-origin-when-cross-origin"
                                    ></iframe>
                                ) : (
                                    <div onClick={() => setIsPlaying(true)} className="w-full h-full relative">
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-all z-10">
                                            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-all">
                                                <Play className="w-8 h-8 text-white fill-white ml-1" />
                                            </div>
                                        </div>
                                        <img
                                            src={getOptimizedImageUrl(movie?.poster || movie?.posterUrl, 'background') || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2670&auto=format&fit=crop"}
                                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                            alt="Trailer thumbnail"
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="mt-6 space-y-4">
                                <button
                                    onClick={handleBookTickets}
                                    className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 transition-all"
                                >
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
