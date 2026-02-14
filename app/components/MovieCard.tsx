"use client";

import { Star, Calendar, MapPin, PlayCircle, Info } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ROUTES } from "@/app/routes";
import { useRouter } from "next/navigation";
import { getAllShows } from "@/app/services/show";
import { getOptimizedImageUrl } from "@/app/utils/cloudinary";

type Movie = {
    id: number;
    name: string;
    description: string;
    casts: string[];
    trailerUrl: string;
    language: string;
    releaseDate: string;
    director: string;
    releaseStatus: string;
    poster?: string;
    _id?: string;
};

export default function MovieCard({ movie }: { movie: Movie }) {
    const router = useRouter();

    const handleBookTickets = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            const movieId = (movie.id || movie._id)?.toString();
            if (!movieId) return;

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
        }
    };

    return (
        <motion.div
            whileHover={{ y: -10 }}
            className="group relative bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-lg max-w-sm mx-auto w-full flex flex-col h-full"
        >
            {/* Poster / Image Area */}
            <Link href={`${ROUTES.MOVIE_DETAILS}/${movie.id || movie._id}`} className="relative h-[320px] bg-slate-200 overflow-hidden shrink-0 block">
                {/* Poster Image or Placeholder Gradient */}
                {movie.poster ? (
                    <img
                        src={getOptimizedImageUrl(movie.poster, 'poster')}
                        alt={movie.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300" />
                )}

                {/* Status Badge */}
                <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-indigo-600 shadow-sm uppercase tracking-wide">
                        {movie.releaseStatus}
                    </span>
                </div>

                {/* Language Badge */}
                <div className="absolute top-4 right-4 z-10">
                    <span className="px-3 py-1 bg-slate-900/10 backdrop-blur-md rounded-full text-xs font-medium text-slate-900 border border-white/20">
                        {movie.language}
                    </span>
                </div>

                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300" />

                {/* Hover Content - Watch Trailer */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            window.open(movie.trailerUrl, '_blank');
                        }}
                        className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white font-bold hover:bg-white/30 transition-all transform scale-90 group-hover:scale-100"
                    >
                        <PlayCircle className="w-5 h-5 fill-current" />
                        Watch Trailer
                    </button>
                </div>
            </Link>

            {/* Info Area */}
            <div className="p-5 flex flex-col grow">
                <Link href={`${ROUTES.MOVIE_DETAILS}/${movie.id || movie._id}`}>
                    <h3 className="text-xl font-bold text-slate-900 mb-1 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                        {movie.name}
                    </h3>
                </Link>

                <div className="flex items-center gap-2 text-slate-500 text-xs mb-3 font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{movie.releaseDate}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <span>Dir. {movie.director}</span>
                </div>

                <p className="text-slate-600 text-sm line-clamp-3 mb-4 grow">
                    {movie.description}
                </p>

                <div className="pt-4 border-t border-slate-100">
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">Cast</p>
                    <div className="flex flex-wrap gap-1.5">
                        {(movie.casts || []).slice(0, 3).map((cast, i) => (
                            <span key={i} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md">
                                {cast}
                            </span>
                        ))}
                        {(movie.casts || []).length > 3 && (
                            <span className="px-2 py-1 bg-slate-50 text-slate-400 text-xs rounded-md">
                                +{(movie.casts || []).length - 3}
                            </span>
                        )}
                    </div>
                </div>

                <button
                    onClick={() => router.push(`${ROUTES.MOVIE_DETAILS}/${movie.id || movie._id}`)}
                    className="w-full mt-5 bg-indigo-600 text-white py-3 rounded-xl font-bold text-sm tracking-wide shadow-md hover:bg-indigo-700 hover:shadow-lg transition-all active:scale-[0.98]"
                >
                    VIEW MOVIE
                </button>
            </div>
        </motion.div>
    );
}
