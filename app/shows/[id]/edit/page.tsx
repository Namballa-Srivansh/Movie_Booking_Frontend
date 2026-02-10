"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { getShowById, updateShow } from "@/app/services/show";
import { getAllTheatres } from "@/app/services/theatre";
import { getAllMovies } from "@/app/services/movie";
import { ROUTES } from "@/app/routes";
import { Calendar, CheckCircle, AlertCircle, Loader2, MapPin, Film, Clock, Users, IndianRupee, Layers } from "lucide-react";

export default function EditShowPage({ params }: { params: Promise<{ id: string }> }) {
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const resolvedParams = use(params);
    const showId = resolvedParams.id;

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
                console.warn("Unauthorized access attempt to Edit Show page");
                router.push(ROUTES.HOME);
                return;
            }

            // Fetch initial data
            const fetchData = async () => {
                try {
                    const [theatresData, moviesData, showData] = await Promise.all([
                        getAllTheatres(),
                        getAllMovies(),
                        getShowById(showId)
                    ]);

                    const theatreList = Array.isArray(theatresData) ? theatresData : theatresData.data || [];
                    const movieList = Array.isArray(moviesData) ? moviesData : moviesData.data || [];
                    const show = showData.data || showData;

                    setTheatres(theatreList);
                    setMovies(movieList);

                    // Set filtered movies based on the theatre of the show
                    const selectedTheatre = theatreList.find((t: any) => t._id === show.theatreId?._id || t._id === show.theatreId);
                    if (selectedTheatre && selectedTheatre.movies) {
                        setFilteredMovies(selectedTheatre.movies);
                    }

                    setFormData({
                        theatreId: show.theatreId?._id || show.theatreId || "",
                        movieId: show.movieId?._id || show.movieId || "",
                        timings: show.timings || "",
                        noOfSeats: show.noOfSeats || "",
                        price: show.price || "",
                        format: show.format || "2D",
                    });

                } catch (err: any) {
                    console.error("Failed to fetch data", err);
                    setError("Failed to load show data. " + (err.message || ""));
                } finally {
                    setPageLoading(false);
                }
            };

            fetchData();
        }
    }, [isAuthenticated, authLoading, user, router, showId]);

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

            // Backend does not allow updating theatreId or movieId
            const payload = {
                timings: formData.timings,
                noOfSeats: Number(formData.noOfSeats),
                price: Number(formData.price),
                format: formData.format
            };

            await updateShow(showId, payload, token);

            alert("Show updated successfully!");
            router.push(ROUTES.SHOWS);

        } catch (err: any) {
            console.error("Failed to update show:", err);
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
                        <h1 className="text-2xl font-bold text-white tracking-tight">Edit Show</h1>
                        <p className="text-slate-400 text-sm">Update show details</p>
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
                                disabled={true}
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-slate-100 text-slate-500 cursor-not-allowed outline-none"
                            >
                                <option value="">Select a Theatre</option>
                                {theatres.map((theatre: any) => (
                                    <option key={theatre._id} value={theatre._id}>{theatre.name}</option>
                                ))}
                            </select>
                            <p className="text-xs text-slate-400">Theatre cannot be changed</p>
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
                                disabled={true}
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-slate-100 text-slate-500 cursor-not-allowed outline-none"
                            >
                                <option value="">Select a Movie</option>
                                {filteredMovies.map((movie: any) => (
                                    <option key={movie._id} value={movie._id}>{movie.name}</option>
                                ))}
                            </select>
                            <p className="text-xs text-slate-400">Movie cannot be changed</p>
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
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-5 h-5" />
                                    Update Show
                                </>
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
