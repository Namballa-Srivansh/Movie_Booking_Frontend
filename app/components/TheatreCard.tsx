import { Building2, Film, MapPin, Loader2 } from "lucide-react";
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getAllShows } from "@/app/services/show";
import { ROUTES } from "@/app/routes";

interface Movie {
    _id: string;
    name: string;
}

interface Theatre {
    _id: string;
    id?: string;
    name: string;
    description?: string;
    city: string;
    pincode: number;
    address?: string;
    image?: string;
    movies?: Movie[];
}

interface TheatreCardProps {
    theatre: Theatre;
}

const TheatreCard = ({ theatre }: TheatreCardProps) => {
    const router = useRouter();
    const [loadingMovieId, setLoadingMovieId] = useState<string | null>(null);

    const handleMovieClick = async (e: React.MouseEvent, movieId: string) => {
        e.preventDefault(); // Prevent default Link behavior if we keep it as a Link, or just use button/div
        setLoadingMovieId(movieId);

        try {
            const response = await getAllShows();
            const shows = response.data || response; // Adjust based on API response structure

            // Find a show for this theatre and movie
            const theatreId = theatre._id || theatre.id;

            // Filter shows that match both theatre and movie
            // Note: show.theatreId and show.movieId might be populated objects or just IDs depending on backend
            const matchingShow = shows.find((show: any) => {
                const showTheatreId = typeof show.theatreId === 'object' ? show.theatreId._id : show.theatreId;
                const showMovieId = typeof show.movieId === 'object' ? show.movieId._id : show.movieId;

                return showTheatreId === theatreId && showMovieId === movieId;
            });

            if (matchingShow) {
                router.push(`${ROUTES.BOOK_SHOW}/${matchingShow._id}`);
            } else {
                // Fallback to movie details if no specific show is found
                router.push(`/movie/${movieId}`);
            }
        } catch (error) {
            console.error("Failed to find show:", error);
            // Fallback on error
            router.push(`/movie/${movieId}`);
        } finally {
            setLoadingMovieId(null);
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
            <div className="h-32 bg-slate-100 relative overflow-hidden">
                {theatre.image ? (
                    <img
                        src={theatre.image}
                        alt={theatre.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-r from-slate-100 to-slate-200">
                        <div className="absolute inset-0 flex items-center justify-center opacity-10">
                            <Building2 className="w-16 h-16 text-slate-400" />
                        </div>
                    </div>
                )}

                <div className="absolute bottom-4 left-6">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-bold text-indigo-600 uppercase tracking-wide shadow-sm">
                        {theatre.city}
                    </span>
                </div>
            </div>
            <div className="p-6">
                <Link href={`/theatres/${theatre._id || theatre.id}`}>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-1 cursor-pointer">
                        {theatre.name}
                    </h3>
                </Link>
                {theatre.description && (
                    <p className="text-slate-500 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
                        {theatre.description}
                    </p>
                )}

                {/* Movies Section */}
                {theatre.movies && theatre.movies.length > 0 && (
                    <div className="mb-4">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Movies Running</p>
                        <div className="flex flex-wrap gap-2">
                            {theatre.movies.map((movie) => (
                                <button
                                    key={movie._id}
                                    onClick={(e) => handleMovieClick(e, movie._id)}
                                    disabled={loadingMovieId === movie._id}
                                    className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-md border border-indigo-100 hover:bg-indigo-100 transition-colors flex items-center gap-1"
                                >
                                    {loadingMovieId === movie._id && <Loader2 className="w-3 h-3 animate-spin" />}
                                    {movie.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="space-y-2 mt-4 pt-4 border-t border-slate-100">
                    <div className="flex items-start gap-2 text-slate-600 text-sm">
                        <MapPin className="w-4 h-4 mt-0.5 text-slate-400 flex-shrink-0" />
                        <span>
                            {theatre.address ? theatre.address : 'Address not available'}
                            <span className="block text-slate-400 text-xs mt-0.5">Pincode: {theatre.pincode}</span>
                        </span>
                    </div>
                </div>

                <Link href={`/theatres/${theatre._id || theatre.id}`} className="w-full mt-6 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl transition-colors border border-slate-200 text-sm flex items-center justify-center gap-2">
                    <Film className="w-4 h-4" />
                    View Shows
                </Link>
            </div>
        </div>
    );
};

export default TheatreCard;
