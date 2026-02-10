"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { getTheatreById, updateTheatre, addMoviesToTheatre, removeMoviesFromTheatre } from "@/app/services/theatre";
import { getAllMovies } from "@/app/services/movie";
import { ROUTES } from "@/app/routes";
import { Building2, MapPin, Loader2, CheckCircle, AlertCircle, Info, Film, Plus } from "lucide-react";

interface Movie {
    _id: string;
    name: string;
}

export default function EditTheatrePage() {
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const params = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        city: "",
        pincode: "",
        address: ""
    });

    const [availableMovies, setAvailableMovies] = useState<Movie[]>([]);
    const [selectedMovieIds, setSelectedMovieIds] = useState<string[]>([]);
    const [initialMovieIds, setInitialMovieIds] = useState<string[]>([]);
    const [isLoadingMovies, setIsLoadingMovies] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (params.theatreId) {
                    // 1. Fetch Theatre Details
                    const theatreResponse = await getTheatreById(params.theatreId as string);
                    const theatre = theatreResponse.data || theatreResponse;

                    // Verify ownership
                    const role = (user?.userRole || user?.role || "").toLowerCase();
                    const userId = user?.id || (user as any)?._id;
                    const theatreOwnerId = theatre?.owner && typeof theatre.owner === 'object' ? (theatre.owner as any)._id : theatre?.owner;

                    const canEdit = user && theatre && (role === "admin" || (role === "owner" && userId === theatreOwnerId));

                    if (!canEdit) {
                        console.warn("Unauthorized access attempt to Edit Theatre page");
                        router.push(ROUTES.HOME);
                        return;
                    }

                    setFormData({
                        name: theatre.name || "",
                        description: theatre.description || "",
                        city: theatre.city || "",
                        pincode: theatre.pincode ? theatre.pincode.toString() : "",
                        address: theatre.address || ""
                    });

                    // Pre-select existing movies
                    const existingMovieIds = theatre.movies ? theatre.movies.map((m: any) => m._id) : [];
                    setSelectedMovieIds(existingMovieIds);
                    setInitialMovieIds(existingMovieIds);

                    // 2. Fetch All Movies
                    const moviesResponse = await getAllMovies();
                    const moviesData = Array.isArray(moviesResponse) ? moviesResponse : (moviesResponse.data || moviesResponse.movies || []);
                    setAvailableMovies(moviesData);
                }
            } catch (err: any) {
                console.error("Failed to load data:", err);
                setError(err.message || "Failed to load details");
            } finally {
                setIsLoading(false);
                setIsLoadingMovies(false);
            }
        };

        if (!authLoading) {
            if (!isAuthenticated) {
                router.push(ROUTES.LOGIN);
            } else {
                fetchData();
            }
        }
    }, [params.theatreId, isAuthenticated, authLoading, user, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError("");
    };

    const handleMovieSelection = (movieId: string) => {
        setSelectedMovieIds(prev =>
            prev.includes(movieId)
                ? prev.filter(id => id !== movieId)
                : [...prev, movieId]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError("");

        try {
            const token = user?.token || user?.accessToken;
            if (!token) {
                throw new Error("You are not authenticated. Please login again.");
            }

            // 1. Update Theatre Details
            const payload = {
                ...formData,
                pincode: Number(formData.pincode)
            };
            await updateTheatre(params.theatreId as string, payload, token);

            // 2. Add Newly Selected Movies
            const moviesToAdd = selectedMovieIds.filter(id => !initialMovieIds.includes(id));
            if (moviesToAdd.length > 0) {
                await addMoviesToTheatre(params.theatreId as string, moviesToAdd, token);
            }

            // 3. Remove Deselected Movies
            const moviesToRemove = initialMovieIds.filter(id => !selectedMovieIds.includes(id));
            if (moviesToRemove.length > 0) {
                await removeMoviesFromTheatre(params.theatreId as string, moviesToRemove, token);
            }

            alert("Theatre updated successfully!");
            router.push(`/theatres/${params.theatreId}`);

        } catch (err: any) {
            console.error("Failed to update theatre:", err);
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    if (authLoading || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#dae4f6] py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 mt-10">

                {/* Header */}
                <div className="bg-slate-900 px-8 py-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <Building2 className="text-white w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">Edit Theatre</h1>
                        <p className="text-slate-400 text-sm">Update theatre details</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <p className="text-sm font-medium">{error}</p>
                        </div>
                    )}

                    {/* Basic Info Section */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
                            <Info className="w-5 h-5 text-indigo-600" />
                            Theatre Information
                        </h3>

                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Theatre Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all bg-white text-slate-900"
                                    placeholder="e.g. Grand Cinema"
                                    required
                                    minLength={5}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none bg-white text-slate-900"
                                    placeholder="About the theatre..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">City</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all bg-white text-slate-900"
                                            placeholder="e.g. New York"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Pincode</label>
                                    <input
                                        type="number"
                                        name="pincode"
                                        value={formData.pincode}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all bg-white text-slate-900"
                                        placeholder="e.g. 10001"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Address</label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    rows={2}
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none bg-white text-slate-900"
                                    placeholder="Full street address..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Movie Selection Section */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
                            <Film className="w-5 h-5 text-indigo-600" />
                            Add Movies
                        </h3>

                        <div>
                            <p className="text-sm text-slate-500 mb-3">Select movies to add to this theatre (currently selected are highlighted)</p>
                            {isLoadingMovies ? (
                                <div className="flex items-center gap-2 text-slate-500 text-sm">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Loading movies...
                                </div>
                            ) : availableMovies.length === 0 ? (
                                <p className="text-sm text-slate-500">No movies available to add.</p>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                    {availableMovies.map((movie) => (
                                        <div
                                            key={movie._id}
                                            onClick={() => handleMovieSelection(movie._id)}
                                            className={`
                                                cursor-pointer p-3 rounded-xl border transition-all flex items-center gap-3
                                                ${selectedMovieIds.includes(movie._id)
                                                    ? 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-500/20'
                                                    : 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                                                }
                                            `}
                                        >
                                            <div className={`
                                                w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors
                                                ${selectedMovieIds.includes(movie._id)
                                                    ? 'bg-indigo-600 border-indigo-600'
                                                    : 'border-slate-300 bg-white'
                                                }
                                            `}>
                                                {selectedMovieIds.includes(movie._id) && (
                                                    <Plus className="w-3.5 h-3.5 text-white" />
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 overflow-hidden">
                                                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                                                    <Film className="w-4 h-4 text-slate-400" />
                                                </div>
                                                <span className={`text-sm font-medium truncate ${selectedMovieIds.includes(movie._id) ? 'text-indigo-900' : 'text-slate-700'}`}>
                                                    {movie.name}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <p className="text-xs text-slate-400 mt-2">
                                Selected: {selectedMovieIds.length} movie{selectedMovieIds.length !== 1 ? 's' : ''}
                            </p>
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
                            disabled={isSaving}
                            className="px-8 py-2.5 bg-indigo-600 text-white font-bold rounded-lg shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-5 h-5" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
