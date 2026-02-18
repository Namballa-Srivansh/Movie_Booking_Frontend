"use client";

import { useState, useEffect } from "react";
import Navbar from "@/app/components/Navbar";
import Link from "next/link";
import { ROUTES } from "@/app/routes";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { getAllShows } from "@/app/services/show";
import { getMovieById } from "@/app/services/movie";
import { Loader2 } from "lucide-react";
import MovieHero from "@/app/components/MovieHero";
import DateSelector from "@/app/components/DateSelector";
import FilterBar from "@/app/components/FilterBar";
import TheatreShowList from "@/app/components/TheatreShowList";

export default function ShowsPage() {
    const { user, isAuthenticated } = useAuth();
    const searchParams = useSearchParams();
    const movieId = searchParams.get("movieId");

    const [movie, setMovie] = useState<any>(null);
    const [shows, setShows] = useState<any[]>([]);
    const [filteredShows, setFilteredShows] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [activeFilters, setActiveFilters] = useState({
        languages: [] as string[],
        formats: [] as string[],
        priceRange: [] as string[],
        timings: [] as string[]
    });

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Fetch Movie Details if movieId is present
                if (movieId) {
                    const movieData = await getMovieById(movieId);
                    setMovie(movieData.data || movieData);
                }

                // Fetch Shows
                const filters = movieId ? { movieId } : undefined;
                const showsData = await getAllShows(filters);
                const fetchedShows = showsData.data || [];

                // Filter out orphan shows (missing movie or theatre)
                const validShows = fetchedShows.filter((show: any) => show.movieId && show.theatreId);

                setShows(validShows);
                setFilteredShows(validShows);

            } catch (err: any) {
                console.error("Error fetching data:", err);
                setError(err.message || "Failed to load data");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [movieId]);

    // Filter Logic
    useEffect(() => {
        let result = shows;

        // Filter by Format
        if (activeFilters.formats.length > 0) {
            result = result.filter(show => activeFilters.formats.includes(show.format));
        }

        // Filter by Price Range
        if (activeFilters.priceRange.length > 0) {
            result = result.filter(show => {
                const price = show.price;
                return activeFilters.priceRange.some(range => {
                    if (range === "Rs. 0-100") return price <= 100;
                    if (range === "Rs. 101-200") return price > 100 && price <= 200;
                    if (range === "Rs. 201-300") return price > 200 && price <= 300;
                    if (range === "Rs. 301-350") return price > 300 && price <= 350;
                    if (range === "Rs. 351+") return price > 351;
                    return false;
                });
            });
        }

        // Filter by Timing
        if (activeFilters.timings.length > 0) {
            result = result.filter(show => {
                const timeString = show.timings; // e.g., "10:00 AM"
                const hour = parseInt(timeString.split(':')[0]);
                const isPM = timeString.includes('PM');
                const time24 = (hour === 12 ? 0 : hour) + (isPM ? 12 : 0);

                return activeFilters.timings.some(timing => {
                    if (timing === "Morning") return time24 >= 6 && time24 < 12;
                    if (timing === "Afternoon") return time24 >= 12 && time24 < 16;
                    if (timing === "Evening") return time24 >= 16 && time24 < 20;
                    if (timing === "Night") return time24 >= 20 || time24 < 6;
                    return false;
                });
            });
        }


        setFilteredShows(result);

    }, [shows, activeFilters]);

    // Group shows by Theatre
    const groupShowsByTheatre = (shows: any[]) => {
        const theatreMap = new Map();

        shows.forEach(show => {
            const theatre = show.theatreId;
            if (!theatre) return;

            if (!theatreMap.has(theatre._id)) {
                theatreMap.set(theatre._id, {
                    _id: theatre._id,
                    name: theatre.name,
                    location: theatre.location || "Location not available", // Fallback
                    shows: []
                });
            }

            theatreMap.get(theatre._id).shows.push({
                _id: show._id,
                timings: show.timings,
                format: show.format,
                price: show.price,
                noOfSeats: show.noOfSeats, // Add seat count
                // Add logic for availability if data exists
            });
        });

        return Array.from(theatreMap.values());
    };

    const groupedTheatres = groupShowsByTheatre(filteredShows);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <Navbar />

            <div className="pt-20"> {/* Offset for Fixed Navbar */}
                {movie && <MovieHero movie={movie} />}

                <div className="bg-white border-b border-gray-200 sticky top-[64px] z-20">
                    <div className="container mx-auto px-4 lg:px-6">
                        <DateSelector
                            selectedDate={selectedDate}
                            onSelect={setSelectedDate}
                        />
                    </div>
                </div>

                <div className="bg-white border-b border-gray-200 sticky top-[134px] z-10 shadow-sm">
                    <div className="container mx-auto px-4 lg:px-6">
                        <FilterBar onFilterChange={setActiveFilters} />
                    </div>
                </div>

                <div className="container mx-auto px-4 lg:px-6 py-6">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    <TheatreShowList theatres={groupedTheatres} selectedDate={selectedDate} />
                </div>
            </div>
        </div>
    );
}
