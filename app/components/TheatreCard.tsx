import { Building2, Film, MapPin } from "lucide-react";
import Link from 'next/link';

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
    movies?: Movie[];
}

interface TheatreCardProps {
    theatre: Theatre;
}

const TheatreCard = ({ theatre }: TheatreCardProps) => {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
            <div className="h-32 bg-gradient-to-r from-slate-100 to-slate-200 relative">
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                    <Building2 className="w-16 h-16 text-slate-400" />
                </div>
                <div className="absolute bottom-4 left-6">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-bold text-indigo-600 uppercase tracking-wide shadow-sm">
                        {theatre.city}
                    </span>
                </div>
            </div>
            <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {theatre.name}
                </h3>
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
                                <Link
                                    href={`/movies/${movie._id}`}
                                    key={movie._id}
                                    className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-md border border-indigo-100 hover:bg-indigo-100 transition-colors"
                                >
                                    {movie.name}
                                </Link>
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

                <button className="w-full mt-6 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl transition-colors border border-slate-200 text-sm flex items-center justify-center gap-2">
                    <Film className="w-4 h-4" />
                    View Shows
                </button>
            </div>
        </div>
    );
};

export default TheatreCard;
