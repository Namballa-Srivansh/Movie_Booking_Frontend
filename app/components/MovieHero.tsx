import React from 'react';
import { Heart, Share2 } from 'lucide-react';
import { getOptimizedImageUrl } from '@/app/utils/cloudinary';

interface MovieHeroProps {
    movie: any;
}

export default function MovieHero({ movie }: MovieHeroProps) {
    if (!movie) return null;

    return (
        <div className="bg-slate-50 border-b border-slate-200 py-8">
            <div className="container mx-auto px-4 lg:px-6">
                <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
                            {movie.name} - ({movie.language})
                        </h1>

                        <div className="flex flex-wrap items-center gap-3 mb-6">
                            <div className="flex items-center gap-2 text-slate-600 text-sm font-medium border border-slate-300 rounded-full px-3 py-1 bg-white">
                                <span className="uppercase">{movie.certification || "UA16+"}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-500 text-sm font-medium border border-slate-300 rounded-full px-3 py-1 bg-white">
                                <span>{movie.genre || "Action"}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-500 text-sm font-medium border border-slate-300 rounded-full px-3 py-1 bg-white">
                                <span>{movie.runtime || "2h 30m"}</span>
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    );
}
