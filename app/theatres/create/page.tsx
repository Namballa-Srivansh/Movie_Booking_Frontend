"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { createTheatre, addMoviesToTheatre } from "@/app/services/theatre";
import { getAllMovies } from "@/app/services/movie";
import { ROUTES } from "@/app/routes";
import Navbar from "@/app/components/Navbar";
import { Loader2, Plus, Film } from "lucide-react";
import ImageUpload from "@/app/components/ImageUpload";

interface Movie {
    _id: string;
    name: string;
}

export default function CreateTheatrePage() {
    const { user } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        city: "",
        pincode: "",
        address: "",
        image: ""
    });

    const [availableMovies, setAvailableMovies] = useState<Movie[]>([]);
    const [selectedMovieIds, setSelectedMovieIds] = useState<string[]>([]);
    const [isLoadingMovies, setIsLoadingMovies] = useState(true);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await getAllMovies();
                // Handle different response structures
                const moviesData = Array.isArray(response) ? response : (response.data || response.movies || []);
                setAvailableMovies(moviesData);
            } catch (err) {
                console.error("Failed to load movies:", err);
            } finally {
                setIsLoadingMovies(false);
            }
        };

        fetchMovies();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
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
        setError("");
        setIsLoading(true);

        try {
            const token = user?.token || user?.accessToken;
            if (!token) {
                throw new Error("You must be logged in to create a theatre.");
            }

            if (formData.name.length < 5) {
                throw new Error("Theatre name must be at least 5 characters long.");
            }

            // 1. Create the theatre
            const createdTheatreResponse = await createTheatre({
                ...formData,
                pincode: Number(formData.pincode),
                image: formData.image || undefined
            }, token);

            const createdTheatreId = createdTheatreResponse.data?._id || createdTheatreResponse._id;

            // 2. Add selected movies if any
            if (createdTheatreId && selectedMovieIds.length > 0) {
                await addMoviesToTheatre(createdTheatreId, selectedMovieIds, token);
            }

            // Redirect to movies or home since we don't have a theatres list page yet
            router.push(ROUTES.HOME);
            router.refresh();
        } catch (err: any) {
            setError(err.message || "Failed to create theatre");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-slate-50">
            <Navbar />

            <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                        <h1 className="text-2xl font-bold text-slate-900">Create New Theatre</h1>
                        <p className="text-slate-500 mt-1">Add a new theatre to the platform</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        {error && (
                            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-1">
                                    Theatre Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    minLength={5}
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 bg-white"
                                    placeholder="Enter theatre name"
                                />
                                <p className="text-xs text-slate-400 mt-1">Minimum 5 characters</p>
                            </div>

                            <div>
                                <ImageUpload
                                    label="Theatre Poster"
                                    value={formData.image}
                                    onUpload={(url) => setFormData(prev => ({ ...prev, image: url }))}
                                    onRemove={() => setFormData(prev => ({ ...prev, image: "" }))}
                                />
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-semibold text-slate-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={3}
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 bg-white"
                                    placeholder="Brief description of the theatre"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="city" className="block text-sm font-semibold text-slate-700 mb-1">
                                        City <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="city"
                                        name="city"
                                        required
                                        value={formData.city}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 bg-white"
                                        placeholder="City"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="pincode" className="block text-sm font-semibold text-slate-700 mb-1">
                                        Pincode <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        id="pincode"
                                        name="pincode"
                                        required
                                        value={formData.pincode}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 bg-white"
                                        placeholder="Zip/Pin Code"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="address" className="block text-sm font-semibold text-slate-700 mb-1">
                                    Address
                                </label>
                                <textarea
                                    id="address"
                                    name="address"
                                    rows={2}
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 bg-white"
                                    placeholder="Full address"
                                />
                            </div>

                            <div className="pt-4 border-t border-slate-100">
                                <label className="block text-sm font-semibold text-slate-700 mb-3">
                                    Select Movies Running
                                </label>
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

                        <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-50 rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-4 h-4" />
                                        Create Theatre
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}
