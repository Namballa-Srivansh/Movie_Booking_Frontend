"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { createMovie } from "@/app/services/movie";
import { ROUTES } from "@/app/routes";
import { Film, Calendar, User, Globe, PlayCircle, Info, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function CreateMoviePage() {
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        casts: "", 
        trailerUrl: "",
        language: "English",
        releaseDate: "",
        director: "",
        releaseStatus: "Coming Soon"
    });

    useEffect(() => {
        if (!authLoading) {
            if (!isAuthenticated) {
                router.push(ROUTES.LOGIN);
                return;
            }

            const role = (user?.userRole || user?.role || "").toLowerCase();
            if (role !== "owner" && role !== "admin") {
                console.warn("Unauthorized access attempt to Create Movie page");
                router.push(ROUTES.HOME);
            }
        }
    }, [isAuthenticated, authLoading, user, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError("");
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

            console.log("Sending Create Movie Payload:", JSON.stringify(payload, null, 2));

            await createMovie(payload, token);

            alert("Movie created successfully!");
            router.push(ROUTES.HOME);

        } catch (err: any) {
            console.error("Failed to create movie:", err);
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (authLoading) {
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
                        <Film className="text-white w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">Create New Movie</h1>
                        <p className="text-slate-400 text-sm">Add a new blockbuster to the collection</p>
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
                                    Create Movie
                                </>
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
