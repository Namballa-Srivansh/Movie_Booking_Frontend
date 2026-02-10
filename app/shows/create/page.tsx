"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { createShow } from "@/app/services/show";
import { getAllTheatres } from "@/app/services/theatre";
import { getAllMovies } from "@/app/services/movie";
import { ROUTES } from "@/app/routes";
import { Calendar, CheckCircle, AlertCircle, Loader2, MapPin, Film, Clock, Users, IndianRupee, Layers } from "lucide-react";

export default function CreateShowPage() {
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [error, setError] = useState("");

    // Data for dropdowns
    const [theatres, setTheatres] = useState<any[]>([]);
    const [movies, setMovies] = useState<any[]>([]);
    const [filteredMovies, setFilteredMovies] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        theatreId: "",
        movieId: "",
        timings: "",
        noOfSeats: "",
        price: "",
        format: "2D",
    });

    useEffect(() => {
        if (!authLoading) {
            if (!isAuthenticated) {
                router.push(ROUTES.LOGIN);
                return;
            }

            const role = (user?.userRole || user?.role || "").toLowerCase();
            if (role !== "owner" && role !== "admin") {
                console.warn("Unauthorized access attempt to Create Show page");
                router.push(ROUTES.HOME);
                return;
            }

            // Fetch generic data needed for the form
            const fetchData = async () => {
                try {
                    const [theatresData, moviesData] = await Promise.all([
                        getAllTheatres(),
                        getAllMovies()
                    ]);
                    // Adjust based on actual API response structure (e.g., if data is wrapped in .data)
                    // console.log("Theatres Data:", theatresData);
                    // console.log("Movies Data:", moviesData);

                    setTheatres(Array.isArray(theatresData) ? theatresData : theatresData.data || []);
                    setMovies(Array.isArray(moviesData) ? moviesData : moviesData.data || []);

                } catch (err) {
                    console.error("Failed to fetch initial data", err);
                    setError("Failed to load generic data. Please refresh.");
                } finally {
                    setPageLoading(false);
                }
            };

            fetchData();
        }
    }, [isAuthenticated, authLoading, user, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError("");

        if (name === "theatreId") {
            // Find selected theatre
            const selectedTheatre = theatres.find((t: any) => t._id === value);

            // Update filtered movies
            if (selectedTheatre && selectedTheatre.movies) {
                setFilteredMovies(selectedTheatre.movies);
            } else {
                setFilteredMovies([]);
            }

            // Reset selected movie since the list changed
            setFormData(prev => ({ ...prev, movieId: "" }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const token = user?.token || user?.accessToken;
            if (!token) {
                throw new Error("You are not authenticated. Please login again.");
            }

            const payload = {
                ...formData,
                noOfSeats: Number(formData.noOfSeats),
                price: Number(formData.price)
            };

            console.log("Sending Create Show Payload:", JSON.stringify(payload, null, 2));

            await createShow(payload, token);

            alert("Show created successfully!");
            router.push(ROUTES.SHOWS);

        } catch (err: any) {
            console.error("Failed to create show:", err);
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (authLoading || pageLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    const role = (user?.userRole || user?.role || "").toLowerCase();
    if (!isAuthenticated || (role !== "owner" && role !== "admin")) {
        return null;
    }

    return (
        <div className="min-h-screen bg-[#dae4f6] py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 mt-10">

                {/* Header */}
                <div className="bg-slate-900 px-8 py-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <Calendar className="text-white w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">Create New Show</h1>
                        <p className="text-slate-400 text-sm">Schedule a movie screening</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <p className="text-sm font-medium">{error}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Theatre Selection */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-indigo-600" />
                                Theatre
                            </label>
                            <select
                                name="theatreId"
                                value={formData.theatreId}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all bg-white text-slate-900"
                                required
                            >
                                <option value="">Select a Theatre</option>
                                {theatres.map((theatre: any) => (
                                    <option key={theatre._id} value={theatre._id}>{theatre.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Movie Selection */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <Film className="w-4 h-4 text-indigo-600" />
                                Movie
                            </label>
                            <select
                                name="movieId"
                                value={formData.movieId}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all bg-white text-slate-900"
                                required
                                disabled={!formData.theatreId}
                            >
                                <option value="">Select a Movie</option>
                                {filteredMovies.map((movie: any) => (
                                    <option key={movie._id} value={movie._id}>{movie.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Timings */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-indigo-600" />
                                Timings
                            </label>
                            <input
                                type="text"
                                name="timings"
                                value={formData.timings}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all bg-white text-slate-900"
                                placeholder="e.g. 10:00 AM"
                                required
                            />
                        </div>

                        {/* Format */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <Layers className="w-4 h-4 text-indigo-600" />
                                Format
                            </label>
                            <select
                                name="format"
                                value={formData.format}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all bg-white text-slate-900"
                            >
                                <option value="2D">2D</option>
                                <option value="3D">3D</option>
                                <option value="IMAX">IMAX</option>
                                <option value="4DX">4DX</option>
                            </select>
                        </div>

                        {/* No of Seats */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <Users className="w-4 h-4 text-indigo-600" />
                                Total Seats
                            </label>
                            <input
                                type="number"
                                name="noOfSeats"
                                value={formData.noOfSeats}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all bg-white text-slate-900"
                                placeholder="e.g. 150"
                                required
                                min="1"
                            />
                        </div>

                        {/* Price */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <IndianRupee className="w-4 h-4 text-indigo-600" />
                                Price
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all bg-white text-slate-900"
                                placeholder="e.g. 250"
                                required
                                min="0"
                            />
                        </div>

                    </div>

                    <div className="pt-6 flex items-center justify-end gap-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-6 py-2.5 text-slate-600 font-semibold hover:bg-slate-50 rounded-lg transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-8 py-2.5 bg-indigo-600 text-white font-bold rounded-lg shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-5 h-5" />
                                    Create Show
                                </>
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
