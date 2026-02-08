"use client";

import { useEffect, useState } from "react";
import { getAllTheatres } from "@/app/services/theatre";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { Loader2, MapPin, Building2, Film } from "lucide-react";

interface Theatre {
    _id: string;
    id?: string;
    name: string;
    description?: string;
    city: string;
    pincode: number;
    address?: string;
}

export default function TheatresPage() {
    const [theatres, setTheatres] = useState<Theatre[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchTheatres = async () => {
            try {
                const response = await getAllTheatres();
                // Handle different response structures gracefully
                const theatresData = Array.isArray(response) ? response : (response.data || response.theatres || []);
                setTheatres(theatresData);
            } catch (err: any) {
                console.error("Failed to fetch theatres:", err);
                setError(err.message || "Failed to load theatres");
            } finally {
                setIsLoading(false);
            }
        };

        fetchTheatres();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />

            <div className="flex-grow pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pb-16">
                <div className="flex items-center gap-3 mb-8 border-b border-slate-200 pb-4">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                        <Building2 className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">All Theatres</h1>
                        <p className="text-slate-500">Find movie theatres near you</p>
                    </div>
                </div>

                {error ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
                        <p className="text-red-500 font-semibold mb-2">Oops!</p>
                        <p className="text-slate-600">{error}</p>
                    </div>
                ) : theatres.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
                        <p className="text-slate-500 text-lg">No theatres found.</p>
                        <p className="text-slate-400 text-sm mt-1">Be the first to create one!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {theatres.map((theatre) => (
                            <div key={theatre._id || theatre.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
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
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}
