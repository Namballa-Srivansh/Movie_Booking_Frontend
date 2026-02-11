"use client";

import { useEffect, useState } from "react";
import { getAllMovies } from "@/app/services/movie";
import MovieCard from "@/app/components/MovieCard";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { Loader2, Film, ChevronLeft, ChevronRight } from "lucide-react";

export default function MoviesPage() {
    const [movies, setMovies] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const PAGE_SIZE = 8;

    useEffect(() => {
        const fetchMovies = async () => {
            setIsLoading(true);
            try {
                const response = await getAllMovies(currentPage, PAGE_SIZE);
                console.log("Fetched movies response:", response);

                let moviesData = [];
                // Check if response has data property which contains movies and metadata
                if (response.data && response.data.movies) {
                    moviesData = response.data.movies;
                    setTotalPages(response.data.totalPages || 0);
                } else if (response.movies) {
                    // Fallback if response is directly the object
                    moviesData = response.movies;
                    setTotalPages(response.totalPages || 0);
                } else if (Array.isArray(response)) {
                    // Fallback for direct array response
                    moviesData = response;
                } else if (response.data && Array.isArray(response.data)) {
                    // Fallback for legacy data array response
                    moviesData = response.data;
                }

                setMovies(moviesData);
            } catch (err: any) {
                console.error("Failed to load movies:", err);
                setError(err.message || "Failed to load movies. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchMovies();
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
        <main className="bg-slate-50 min-h-screen flex flex-col">
            <Navbar />

            <div className="flex-grow pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pb-16">
                <div className="flex items-center gap-3 mb-8 border-b border-slate-200 pb-4">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                        <Film className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">All Movies</h1>
                        <p className="text-slate-500">Explore our collection of latest blockbusters</p>
                    </div>
                </div>

                {error ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
                        <p className="text-red-500 font-semibold mb-2">Oops!</p>
                        <p className="text-slate-600">{error}</p>
                    </div>
                ) : movies.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
                        <p className="text-slate-500 text-lg">No movies found.</p>
                        <p className="text-slate-400 text-sm mt-1">Check back later for new releases!</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
                            {movies.map((movie) => (
                                <div key={movie.id || movie._id} className="h-full">
                                    <MovieCard movie={movie} />
                                </div>
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
