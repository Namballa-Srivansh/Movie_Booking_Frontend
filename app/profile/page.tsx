"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { getUserById } from "@/app/services/user";
import { ROUTES } from "@/app/routes";
import { User, Mail, Shield, CheckCircle, Clock } from "lucide-react";

export default function ProfilePage() {
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const [profileData, setProfileData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push(ROUTES.LOGIN);
            return;
        }

        const fetchUserProfile = async () => {
            if (user && user.id && user.token) {
                try {
                    const data = await getUserById(user.id, user.token);
                    setProfileData(data);
                } catch (err: any) {
                    setError("Failed to load profile data.");
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchUserProfile();
        }
    }, [user, isAuthenticated, authLoading, router]);

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#dae4f6]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#dae4f6]">
                <div className="text-red-500 font-semibold text-lg">{error}</div>
            </div>
        )
    }

    const userData = profileData?.data || profileData || user;

    // Helper to get consistent date format
    const formattedDate = new Date(userData?.createdAt || Date.now()).toLocaleDateString(undefined, {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    return (
        <div className="min-h-screen bg-[#dae4f6] py-12 px-4 sm:px-6 lg:px-8 mt-16 font-sans">
            <div className="max-w-5xl mx-auto">

                {/* Header Section */}
                <div className="mb-12 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-800 flex items-center justify-center gap-2 mb-3">
                        Welcome, {userData?.name?.split(' ')[0]} <span className="text-3xl">👋</span>
                    </h1>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-3 text-slate-600 font-medium">
                        <span>Manage your account and preferences.</span>
                        <div className="flex items-center gap-2 mt-2 md:mt-0">
                            <span className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-wide shadow-sm">
                                {userData?.userRole || "customer"}
                            </span>
                            <span className="bg-emerald-600 text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-wide shadow-sm">
                                {userData?.userStatus || "approved"}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Profile Information */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 md:p-8">
                            <h2 className="text-xl font-bold text-blue-700 mb-6 border-b border-slate-100 pb-4">
                                Profile Information
                            </h2>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center border-b border-slate-50 pb-4 last:border-0">
                                    <label className="text-slate-500 font-semibold">Name:</label>
                                    <div className="md:col-span-2 font-bold text-slate-800 text-lg">
                                        {userData?.name}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center border-b border-slate-50 pb-4 last:border-0">
                                    <label className="text-slate-500 font-semibold">Email:</label>
                                    <div className="md:col-span-2 font-bold text-slate-800 text-lg">
                                        {userData?.email}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center border-b border-slate-50 pb-4 last:border-0">
                                    <label className="text-slate-500 font-semibold">Role:</label>
                                    <div className="md:col-span-2">
                                        <span className="bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm font-bold uppercase shadow-sm">
                                            {userData?.userRole || "customer"}
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center border-b border-slate-50 pb-4 last:border-0">
                                    <label className="text-slate-500 font-semibold">Status:</label>
                                    <div className="md:col-span-2">
                                        <span className="bg-emerald-600 text-white px-4 py-1.5 rounded-md text-sm font-bold uppercase shadow-sm">
                                            {userData?.userStatus || "approved"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-100 text-slate-500 font-medium">
                                Member since: <span className="text-slate-800 font-semibold">{formattedDate}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Quick Actions */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 md:p-8 h-full">
                            <h2 className="text-xl font-bold text-blue-700 mb-6 border-b border-slate-100 pb-4">
                                Quick Actions
                            </h2>

                            <div className="space-y-4">
                                <button className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 px-4 rounded-lg shadow-sm hover:shadow transition-all duration-200 text-center">
                                    Edit Profile
                                </button>

                                <button className="w-full bg-white hover:bg-slate-50 text-slate-700 font-semibold py-3 px-4 rounded-lg border border-slate-300 shadow-sm hover:shadow transition-all duration-200 text-center">
                                    Change Password
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
