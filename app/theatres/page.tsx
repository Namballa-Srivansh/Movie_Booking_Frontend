"use client";

import { useEffect, useState } from "react";
import { getAllTheatres } from "@/app/services/theatre";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import TheatreCard from "@/app/components/TheatreCard";
import { Loader2, Building2, ChevronLeft, ChevronRight } from "lucide-react";

interface Theatre {
    _id: string;
    id?: string;
    name: string;
    description?: string;
    city: string;
    pincode: number;
    address?: string;
    movies?: { _id: string; name: string }[];
}

export default function TheatresPage() {
    const [theatres, setTheatres] = useState<Theatre[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const PAGE_SIZE = 8; // Adjust page size as needed

    useEffect(() => {
        const fetchTheatres = async () => {
            setIsLoading(true);
            try {
                const response = await getAllTheatres(currentPage, PAGE_SIZE);
                // Handle different response structures gracefully
                let theatresData = [];
                if (response.data && response.data.theatres) {
                    theatresData = response.data.theatres;
                    setTotalPages(response.data.totalPages || 0);
                } else if (response.theatres) {
                    theatresData = response.theatres;
                    setTotalPages(response.totalPages || 0);
                } else {
                    // Fallback for legacy response
                    theatresData = Array.isArray(response) ? response : (response.data || []);
                }

                setTheatres(theatresData);
            } catch (err: any) {
                console.error("Failed to fetch theatres:", err);
                setError(err.message || "Failed to load theatres");
            } finally {
                setIsLoading(false);
            }
        };

        fetchTheatres();
    }, [currentPage]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

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
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                            {theatres.map((theatre) => (
                                <TheatreCard key={theatre._id || theatre.id} theatre={theatre} />
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-4">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    aria-label="Previous page"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>

                                <span className="text-slate-600 font-medium">
                                    Page {currentPage} of {totalPages}
                                </span>

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    aria-label="Next page"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            <Footer />
        </main>
    );
}
