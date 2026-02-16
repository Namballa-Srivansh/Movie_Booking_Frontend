"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { searchAll } from "@/app/services/search";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import MovieCard from "@/app/components/MovieCard";
import TheatreCard from "@/app/components/TheatreCard";
import { Loader2, Search, Film, Building2, Frown } from "lucide-react";

// Separate component for search content to use useSearchParams
function SearchContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";
    const [movies, setMovies] = useState<any[]>([]);
    const [theatres, setTheatres] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"all" | "movies" | "theatres">("all");

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                if (query) {
                    const response = await searchAll(query);
                    setMovies(response.movies || []);
                    setTheatres(response.theatres || []);
                } else {
                    setMovies([]);
                    setTheatres([]);
                }
            } catch (error) {
                console.error("Search failed:", error);
                // Optionally handle error state here
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [query]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-4" />
                <p className="text-slate-500">Searching specifically for "{query}"...</p>
            </div>
        );
    }

    if (!query) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                <Search className="w-16 h-16 text-slate-300 mb-4" />
                <h2 className="text-2xl font-bold text-slate-700 mb-2">Search for Movies & Theatres</h2>
                <p className="text-slate-500 max-w-md">Enter a movie title, theatre name, genre, or city to find what you're looking for.</p>
            </div>
        );
    }

    const hasMovies = movies.length > 0;
    const hasTheatres = theatres.length > 0;
    const hasResults = hasMovies || hasTheatres;

    if (!hasResults) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                <Frown className="w-16 h-16 text-slate-300 mb-4" />
                <h2 className="text-2xl font-bold text-slate-700 mb-2">No results found</h2>
                <p className="text-slate-500">We couldn't find any movies or theatres matching "{query}".</p>
                <p className="text-slate-400 text-sm mt-2">Try checking for typos or using broader keywords.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-2 mb-8">
                <h1 className="text-2xl font-bold text-slate-800">
                    Search Results for <span className="text-indigo-600">"{query}"</span>
                </h1>
                <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-sm font-medium">
                    {movies.length + theatres.length} found
                </span>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 mb-8">
                <button
                    onClick={() => setActiveTab("all")}
                    className={`px-6 py-3 font-medium text-sm transition-all border-b-2 ${activeTab === "all"
                        ? "border-indigo-600 text-indigo-600"
                        : "border-transparent text-slate-500 hover:text-slate-700"
                        }`}
                >
                    All Results
                </button>
                <button
                    onClick={() => setActiveTab("movies")}
                    className={`px-6 py-3 font-medium text-sm transition-all border-b-2 flex items-center gap-2 ${activeTab === "movies"
                        ? "border-indigo-600 text-indigo-600"
                        : "border-transparent text-slate-500 hover:text-slate-700"
                        }`}
                >
                    <Film className="w-4 h-4" />
                    Movies ({movies.length})
                </button>
                <button
                    onClick={() => setActiveTab("theatres")}
                    className={`px-6 py-3 font-medium text-sm transition-all border-b-2 flex items-center gap-2 ${activeTab === "theatres"
                        ? "border-indigo-600 text-indigo-600"
                        : "border-transparent text-slate-500 hover:text-slate-700"
                        }`}
                >
                    <Building2 className="w-4 h-4" />
                    Theatres ({theatres.length})
                </button>
            </div>

            {/* Content */}
            <div className="space-y-12">
                {/* Movies Section */}
                {(activeTab === "all" || activeTab === "movies") && hasMovies && (
                    <section>
                        {activeTab === "all" && (
                            <div className="flex items-center gap-2 mb-6">
                                <Film className="w-5 h-5 text-indigo-600" />
                                <h2 className="text-xl font-bold text-slate-800">Movies</h2>
                            </div>
                        )}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {movies.map(movie => (
                                <div key={movie._id || movie.id} className="h-full">
                                    <MovieCard movie={movie} />
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Theatres Section */}
                {(activeTab === "all" || activeTab === "theatres") && hasTheatres && (
                    <section>
                        {activeTab === "all" && (
                            <div className="flex items-center gap-2 mb-6">
                                <Building2 className="w-5 h-5 text-indigo-600" />
                                <h2 className="text-xl font-bold text-slate-800">Theatres</h2>
                            </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {theatres.map(theatre => (
                                <div key={theatre._id || theatre.id} className="h-full">
                                    <TheatreCard theatre={theatre} />
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* No results for specific tab */}
                {activeTab === "movies" && !hasMovies && (
                    <div className="py-12 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        No movies found matching "{query}"
                    </div>
                )}
                {activeTab === "theatres" && !hasTheatres && (
                    <div className="py-12 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        No theatres found matching "{query}"
                    </div>
                )}
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <main className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />
            <div className="flex-grow pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pb-16">
                <Suspense fallback={
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                    </div>
                }>
                    <SearchContent />
                </Suspense>
            </div>
            <Footer />
        </main>
    );
}
