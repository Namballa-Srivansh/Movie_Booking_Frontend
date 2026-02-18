"use client";

import { Search, PlayCircle, TrendingUp, Calendar, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import MovieCard from "@/app/components/MovieCard";
import { getAllMovies } from "@/app/services/movie";



export default function HomePage() {
    const [query, setQuery] = useState("");
    const [movies, setMovies] = useState<any[]>([]);
    const [upcomingMovies, setUpcomingMovies] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                // Fetch more movies to ensure we have enough after filtering
                const response = await getAllMovies(1, 100);

                let moviesData = [];
                if (response.data && response.data.movies) {
                    moviesData = response.data.movies;
                } else if (response.movies) {
                    moviesData = response.movies;
                } else if (Array.isArray(response)) {
                    moviesData = response;
                } else if (response.data && Array.isArray(response.data)) {
                    moviesData = response.data;
                }

                const releasedMovies = moviesData
                    .filter((movie: any) => movie.releaseStatus === "Released" || movie.releaseStatus === "Now Showing")
                    .slice(0, 4);

                const comingSoonMovies = moviesData
                    .filter((movie: any) => movie.releaseStatus === "Coming Soon")
                    .slice(0, 4);

                setMovies(releasedMovies);
                setUpcomingMovies(comingSoonMovies);
            } catch (err: any) {
                console.error("Failed to load movies:", err);
                setError("Failed to load movies");
            } finally {
                setIsLoading(false);
            }
        };

        fetchMovies();
    }, []);

    const handleSearch = () => {
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <main className="bg-slate-50 min-h-screen text-slate-900 selection:bg-indigo-500/30">
            <Navbar />

            {/* Hero Section */}
            <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
                {/* Background with Overlay */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-slate-50" />
                    <div className="absolute top-[-50%] left-[-20%] w-[80%] h-[80%] rounded-full bg-indigo-200/30 blur-3xl" />
                    <div className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-200/30 blur-3xl" />
                    <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] rounded-full bg-blue-200/30 blur-3xl" />
                    <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px]" />
                </div>

                <div className="relative z-20 max-w-7xl mx-auto px-6 w-full pt-20">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-3xl"
                    >
                        <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/20 text-indigo-600 text-sm font-semibold border border-indigo-500/20 mb-6 backdrop-blur-sm">
                            The Future of Cinema
                        </span>
                        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-tight mb-6 tracking-tight">
                            Experience Movies <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                                Beyond Reality
                            </span>
                        </h1>
                        <p className="text-lg text-slate-600 mb-10 max-w-xl leading-relaxed">
                            Book tickets for the immersive experiences.
                            Exclusive premieres, IMAX screenings, and luxury dining
                            delivered to your seat.
                        </p>

                        <div className="max-w-xl bg-white/80 backdrop-blur-lg border border-slate-200 rounded-2xl p-2 flex items-center gap-4 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all shadow-xl">
                            <Search className="text-slate-400 ml-4 w-6 h-6" />
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Search movies, theaters, or genres..."
                                className="bg-transparent border-none text-slate-900 text-lg w-full focus:outline-none placeholder:text-slate-400 py-2"
                            />
                            <button
                                onClick={handleSearch}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg"
                            >
                                Search
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Now Showing */}
            <section className="max-w-7xl mx-auto px-6 py-20 relative z-10">
                <div className="flex items-end justify-between mb-12">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
                            <PlayCircle className="w-8 h-8 text-indigo-600" />
                            Now Showing
                        </h2>
                        <p className="text-slate-500">Catch the latest blockbusters near you</p>
                    </div>
                    <div className="hidden md:flex gap-2">
                        {['All', 'Action', 'Drama', 'Sci-Fi', 'Horror'].map((g) => (
                            <button key={g} className="px-4 py-2 rounded-full border border-slate-200 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
                                {g}
                            </button>
                        ))}
                    </div>
                </div>


                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
                    </div>
                ) : error ? (
                    <div className="text-center py-10 text-red-500">
                        {error}
                    </div>
                ) : movies.length === 0 ? (
                    <div className="text-center py-10 text-slate-500">
                        No movies currently showing.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {movies.map((movie) => (
                            <div key={movie.id || movie._id} className="h-full">
                                <MovieCard movie={movie} />
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Upcoming / Coming Soon Section */}
            <section className="bg-white py-24 border-y border-slate-200">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center justify-between mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                            <Calendar className="w-8 h-8 text-indigo-600" />
                            Coming Soon
                        </h2>
                        {/* <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium">View All</a> */}
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center items-center py-20">
                            <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
                        </div>
                    ) : upcomingMovies.length === 0 ? (
                        <div className="text-center py-10 text-slate-500">
                            No upcoming movies at the moment.
                        </div>
                    ) : (
                        <div className="flex gap-8 overflow-x-auto pb-8 scrollbar-hide snap-x">
                            {upcomingMovies.map((movie) => (
                                <div
                                    key={movie.id || movie._id}
                                    className="min-w-[300px] snap-center group cursor-pointer"
                                    onClick={() => router.push(`/movie/${movie.id || movie._id}`)}
                                >
                                    <div className="h-48 bg-slate-200 rounded-2xl relative overflow-hidden mb-4 shadow-sm">
                                        {movie.poster ? (
                                            <img
                                                src={movie.poster} // simple src usage, can optimize later if needed
                                                alt={movie.name}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-slate-300 flex items-center justify-center text-slate-500">
                                                No Poster
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="absolute bottom-4 left-4">
                                            <span className="px-3 py-1 bg-white/90 backdrop-blur rounded-lg text-xs font-bold text-indigo-600 shadow-sm">
                                                COMING SOON
                                            </span>
                                        </div>
                                    </div>
                                    <h4 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">{movie.name}</h4>
                                    <p className="text-sm text-slate-500 mt-1">Releasing {movie.releaseDate}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>



            <Footer />
        </main>
    );
}
