"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { ROUTES } from "@/app/routes";
import Navbar from "@/app/components/Navbar";
import { Loader2 } from "lucide-react";

export default function BookShowPage({ params }: { params: Promise<{ id: string }> }) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const resolvedParams = use(params);
    const showId = resolvedParams.id;

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (!isAuthenticated) {
        // Redirect to login or show message
        router.push(ROUTES.LOGIN);
        return null;
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="pt-28 max-w-7xl mx-auto px-6">
                <h1 className="text-3xl font-bold text-slate-800 mb-8">Book Tickets</h1>
                <p>Booking logic for Show ID: {showId} will go here.</p>
                {/* Future implementation: Seat selection, payment, etc. */}
            </div>
        </div>
    );
}
