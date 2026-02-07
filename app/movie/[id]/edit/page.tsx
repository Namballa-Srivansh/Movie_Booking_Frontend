"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { getMovieById, updateMovie } from "@/app/services/movie";
import { ROUTES } from "@/app/routes";
import { Film, Calendar, User, Globe, PlayCircle, Info, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function EditMoviePage() {
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const params = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        casts: "",
        trailerUrl: "",
        language: "",
        releaseDate: "",
        director: "",
        releaseStatus: ""
    });

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                if (params.id) {
                    const data = await getMovieById(params.id as string);
                    const movie = data.data || data;

                    // Verify ownership
                    const role = (user?.userRole || user?.role || "").toLowerCase();
                    const isOwner = user && movie && (role === "owner" || role === "admin") && (user.id === (movie.owner || movie.userId));

                    if (!isOwner) {
                        console.warn("Unauthorized access attempt to Edit Movie page");
                        router.push(ROUTES.HOME);
                        return;
                    }

                    setFormData({
                        name: movie.name || "",
                        description: movie.description || "",
                        casts: Array.isArray(movie.casts) ? movie.casts.join(", ") : movie.casts || "",
                        trailerUrl: movie.trailerUrl || "",
                        language: movie.language || "",
                        releaseDate: movie.releaseDate ? new Date(movie.releaseDate).toISOString().split('T')[0] : "",
                        director: movie.director || "",
                        releaseStatus: movie.releaseStatus || ""
                    });
                }
            } catch (err: any) {
                setError(err.message || "Failed to load movie details");
            } finally {
                setIsLoading(false);
            }
        };

        if (!authLoading) {
            if (!isAuthenticated) {
                router.push(ROUTES.LOGIN);
            } else {
                fetchMovie();
            }
        }
    }, [params.id, isAuthenticated, authLoading, user, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError("");
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

            const castsArray = formData.casts.split(',').map(c => c.trim()).filter(c => c.length > 0);

            const payload = {
                name: formData.name,
                description: formData.description,
                casts: castsArray,
                trailerUrl: formData.trailerUrl,
                language: formData.language,
                releaseDate: formData.releaseDate,
                director: formData.director,
                releaseStatus: formData.releaseStatus
            };

            console.log("Sending Update Movie Payload:", JSON.stringify(payload, null, 2));

            await updateMovie(params.id as string, payload, token);

            alert("Movie updated successfully!");
            router.push(`${ROUTES.MOVIE_DETAILS}/${params.id}`);

        } catch (err: any) {
            console.error("Failed to update movie:", err);
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
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 mt-10">

                {/* Header */}
                <div className="bg-slate-900 px-8 py-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                        <Film className="text-white w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">Edit Movie</h1>
                        <p className="text-slate-400 text-sm">Update movie details</p>
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
                            Basic Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Movie Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all bg-white text-slate-900"
                                    placeholder="e.g. Inception"
                                    required
                                    minLength={2}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Language</label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        name="language"
                                        value={formData.language}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all bg-white text-slate-900"
                                        placeholder="e.g. English"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-semibold text-slate-700">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none bg-white text-slate-900"
                                    placeholder="Plot summary..."
                                    required
                                    minLength={5}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
                            <User className="w-5 h-5 text-indigo-600" />
                            Cast & Crew
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Director</label>
                                <input
                                    type="text"
                                    name="director"
                                    value={formData.director}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all bg-white text-slate-900"
                                    placeholder="e.g. Christopher Nolan"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Cast Members</label>
                                <input
                                    type="text"
                                    name="casts"
                                    value={formData.casts}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all bg-white text-slate-900"
                                    placeholder="Comma separated names"
                                    required
                                />
                                <p className="text-xs text-slate-500">Separate names with commas</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-indigo-600" />
                            Media & Release
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Release Date</label>
                                <input
                                    type="date"
                                    name="releaseDate"
                                    value={formData.releaseDate}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all bg-white text-slate-900"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Release Status</label>
                                <select
                                    name="releaseStatus"
                                    value={formData.releaseStatus}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all bg-white text-slate-900"
                                    required
                                >
                                    <option value="Coming Soon">Coming Soon</option>
                                    <option value="Now Showing">Now Showing</option>
                                    <option value="Released">Released</option>
                                </select>
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-semibold text-slate-700">Trailer URL</label>
                                <div className="relative">
                                    <PlayCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="url"
                                        name="trailerUrl"
                                        value={formData.trailerUrl}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all bg-white text-slate-900"
                                        placeholder="https://youtube.com/..."
                                        required
                                    />
                                </div>
                            </div>
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
