"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { getUserById, updateUser } from "@/app/services/user";
import { ROUTES } from "@/app/routes";
import { User, Mail, Shield, CheckCircle, Clock, X } from "lucide-react";

export default function ProfilePage() {
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const [profileData, setProfileData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "" });
    const [updateLoading, setUpdateLoading] = useState(false);
    const [updateError, setUpdateError] = useState("");
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push(ROUTES.LOGIN);
            return;
        }

        const fetchUserProfile = async () => {
            const effectiveUser = user?.user || user;
            const userId = effectiveUser?.id || effectiveUser?._id || effectiveUser?.userId;
            const token = user?.token || user?.accessToken || effectiveUser?.token || effectiveUser?.accessToken;

            if (userId && token) {
                try {
                    const data = await getUserById(userId, token);
                    setProfileData(data);
                    // rigorous check for where the user data is
                    const actualUser = data.user || data.data || data;
                    setFormData({
                        name: actualUser?.name || actualUser?.username || "",
                        email: actualUser?.email || ""
                    });
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (updateError) setUpdateError("");
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setUpdateLoading(true);
        setUpdateError("");
        try {
            const effectiveUser = user?.user || user;
            const userId = effectiveUser?.id || effectiveUser?._id || effectiveUser?.userId;
            const token = user?.token || user?.accessToken || effectiveUser?.token || effectiveUser?.accessToken;

            if (userId && token) {
                const payload = {
                    name: formData.name,
                };

                const cleanPayload = Object.fromEntries(
                    Object.entries(payload).filter(([_, v]) => v != null && v !== "")
                );

                await updateUser(userId, token, cleanPayload);

                const updatedUserLocal = {
                    ...profileData?.data,
                    ...userData,
                    name: formData.name,
                };


                setProfileData({ ...profileData, data: updatedUserLocal });

                setIsEditModalOpen(false);
                setUpdateLoading(false);
                alert("Profile Updated Successfully!");

                try {
                    const data = await getUserById(userId, token);
                    setProfileData(data);
                    const actualUser = data.user || data.data || data;
                    setFormData({
                        name: actualUser?.name || actualUser?.username || "",
                        email: actualUser?.email || ""
                    });
                } catch (fetchErr) {
                    console.error("Background refetch failed:", fetchErr);
                }
            } else {
                setUpdateError("User authentication session invalid. Please login again.");
                setUpdateLoading(false);
            }
        } catch (err: any) {
            console.error("Failed to update profile", err);
            setUpdateError(err.message || "Failed to update profile. Please try again.");
            setUpdateLoading(false);
        }
    };

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

    const tempUser = profileData?.user || profileData?.data || profileData || user;
    const userData = tempUser?.user || tempUser;

    const derivedName = userData?.name || userData?.username || "User";
    const derivedRole = userData?.userRole || userData?.role || "customer";
    const derivedStatus = userData?.userStatus || userData?.status || "approved";

    const formattedDate = new Date(userData?.createdAt || Date.now()).toLocaleDateString(undefined, {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    return (
        <div className="min-h-screen bg-[#dae4f6] py-12 px-4 sm:px-6 lg:px-8 mt-16 font-sans relative">
            <div className="max-w-5xl mx-auto">

                {/* Header Section */}
                <div className="mb-12 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-800 flex items-center justify-center gap-2 mb-3">
                        Welcome, {derivedName.split(' ')[0]} <span className="text-3xl">👋</span>
                    </h1>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-3 text-slate-600 font-medium">
                        <span>Manage your account and preferences.</span>
                        <div className="flex items-center gap-2 mt-2 md:mt-0">
                            <span className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-wide shadow-sm">
                                {derivedRole}
                            </span>
                            <span className="bg-emerald-600 text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-wide shadow-sm">
                                {derivedStatus}
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
                                        {derivedName}
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
                                            {derivedRole}
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center border-b border-slate-50 pb-4 last:border-0">
                                    <label className="text-slate-500 font-semibold">Status:</label>
                                    <div className="md:col-span-2">
                                        <span className="bg-emerald-600 text-white px-4 py-1.5 rounded-md text-sm font-bold uppercase shadow-sm">
                                            {derivedStatus}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-100 text-slate-500 font-medium">
                                Member since: <span className="text-slate-800 font-semibold">{formattedDate}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column:*/}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 md:p-8 h-full">
                            <h2 className="text-xl font-bold text-blue-700 mb-6 border-b border-slate-100 pb-4">
                                Quick Actions
                            </h2>

                            <div className="space-y-4">
                                <button
                                    onClick={() => {
                                        setIsEditModalOpen(true);
                                        setUpdateError("");
                                    }}
                                    className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 px-4 rounded-lg shadow-sm hover:shadow transition-all duration-200 text-center"
                                >
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

            {/* Edit Profile Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="text-lg font-bold text-slate-800">Edit Profile</h3>
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleUpdateProfile} className="p-6 space-y-4">
                            {updateError && (
                                <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg">
                                    {updateError}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-slate-900 bg-white"
                                    required
                                />
                            </div>

                            {/* Email is typically read-only or requires verification to change, keeping it editable for now based on request but could be disabled */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-slate-50 text-slate-500 cursor-not-allowed"
                                    disabled
                                    title="Email cannot be changed directly"
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={updateLoading}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm hover:shadow transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {updateLoading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        "Save Changes"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
