import { Edit, Trash2, Calendar, Clock, MapPin, Users, IndianRupee, Layers, MonitorPlay } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/app/routes";

interface ShowCardProps {
    show: any;
    onDelete: (id: string) => void;
    canEdit: boolean;
}

export default function ShowCard({ show, onDelete, canEdit }: ShowCardProps) {
    const movieName = show.movieId?.name || "Unknown Movie";
    const theatreName = show.theatreId?.name || "Unknown Theatre";

    // Generate a consistent gradient based on movie name length (simple hash-like)
    const gradients = [
        "from-indigo-500 to-purple-600",
        "from-blue-500 to-cyan-600",
        "from-emerald-500 to-teal-600",
        "from-rose-500 to-pink-600",
        "from-amber-500 to-orange-600",
        "from-violet-500 to-fuchsia-600"
    ];
    const gradientIndex = movieName.length % gradients.length;
    const gradientClass = gradients[gradientIndex];

    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group flex flex-col h-full">

            {/* Header / Banner */}
            <div className={`h-24 bg-gradient-to-r ${gradientClass} p-6 relative overflow-hidden`}>
                <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                    <MonitorPlay className="w-32 h-32 text-white" />
                </div>

                <div className="relative z-10 flex justify-between items-start">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold border border-white/20">
                        <Layers className="w-3 h-3" />
                        {show.format || "2D"}
                    </span>

                    {/* Price Tag */}
                    <div className="bg-white text-slate-900 px-3 py-1 rounded-lg font-bold text-sm shadow-sm flex items-center gap-1">
                        <IndianRupee className="w-3.5 h-3.5" />
                        {show.price}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 pt-8 -mt-6 relative z-20 grow flex flex-col">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 grow">

                    <h3 className="text-xl font-bold text-slate-900 mb-1 line-clamp-1" title={movieName}>
                        {movieName}
                    </h3>

                    <div className="flex items-center gap-2 text-slate-500 text-sm mb-4">
                        <MapPin className="w-4 h-4 text-indigo-500 shrink-0" />
                        <span className="line-clamp-1">{theatreName}</span>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-slate-50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-slate-600 text-sm">
                                <Clock className="w-4 h-4 text-slate-400" />
                                <span className="font-medium">{show.timings}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-slate-600 text-sm">
                                <Users className="w-4 h-4 text-slate-400" />
                                <span className="font-medium">{show.noOfSeats} Seats</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-4 space-y-3">
                    <Link
                        href={`${ROUTES.BOOK_SHOW}/${show._id}`}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-md hover:bg-indigo-700 hover:shadow-lg transition-all active:scale-[0.98]"
                    >
                        Book Ticket
                    </Link>

                    {/* Actions */}
                    {canEdit && (
                        <div className="flex gap-2 pt-0">
                            <Link
                                href={`/shows/${show._id}/edit`}
                                className="flex-1 flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-50 text-slate-600 font-medium text-sm hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                            >
                                <Edit className="w-4 h-4" />
                                Edit
                            </Link>
                            <button
                                onClick={() => onDelete(show._id)}
                                className="flex-1 flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-50 text-slate-600 font-medium text-sm hover:bg-red-50 hover:text-red-600 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
