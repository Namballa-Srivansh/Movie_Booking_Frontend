"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { getAllUsers, updateUser } from "@/app/services/user";
import { ROUTES } from "@/app/routes";
import { Loader2, CheckCircle, XCircle, User, ShieldAlert } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

interface UserData {
    _id: string;
    name: string;
    email: string;
    userRole: string;
    userStatus: string;
    createdAt: string;
}

export default function AdminDashboard() {
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [pendingUsers, setPendingUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [error, setError] = useState("");

    // Effect to check auth and role
    useEffect(() => {
        if (!authLoading) {
            if (!isAuthenticated) {
                router.push(ROUTES.LOGIN);
                return;
            }

            const userRole = (user?.userRole || user?.role || "").toLowerCase();
            if (userRole !== "admin") {
                router.push(ROUTES.HOME);
                return;
            }

            fetchPendingUsers();
        }
    }, [isAuthenticated, authLoading, user, router]);

    const fetchPendingUsers = async () => {
        try {
            setLoading(true);
            const token = user?.token || user?.accessToken || "";
            if (!token) return;

            const response = await getAllUsers(token, "pending");
            setPendingUsers(response.data || []);
        } catch (err: any) {
            console.error("Failed to fetch pending users:", err);
            setError("Failed to load pending requests.");
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (userId: string, status: "approved" | "rejected") => {
        try {
            setActionLoading(userId);
            const token = user?.token || user?.accessToken || "";

            await updateUser(userId, token, { userStatus: status });

            // Remove from list locally
            setPendingUsers(prev => prev.filter(u => u._id !== userId));
            alert(`User ${status} successfully.`);
        } catch (err: any) {
            console.error(`Failed to ${status} user:`, err);
            alert(`Failed to ${status} user. Please try again.`);
        } finally {
            setActionLoading(null);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />

            <div className="flex-grow pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pb-16">
                <div className="flex items-center gap-3 mb-8 border-b border-slate-200 pb-4">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                        <ShieldAlert className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
                        <p className="text-slate-500">Manage owner approval requests</p>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-100">
                        {error}
                    </div>
                )}

                {pendingUsers.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-green-500" />
                        </div>
                        <h3 className="text-xl font-medium text-slate-900 mb-2">All Caught Up!</h3>
                        <p className="text-slate-500">There are no pending owner requests at the moment.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-600">
                                <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4">Name</th>
                                        <th className="px-6 py-4">Email</th>
                                        <th className="px-6 py-4">Role Requested</th>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {pendingUsers.map((request) => (
                                        <tr key={request._id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs uppercase">
                                                    {request.name.charAt(0)}
                                                </div>
                                                {request.name}
                                            </td>
                                            <td className="px-6 py-4">{request.email}</td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-md text-xs font-bold uppercase">
                                                    {request.userRole}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {new Date(request.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleAction(request._id, "approved")}
                                                        disabled={actionLoading === request._id}
                                                        className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                                                    >
                                                        {actionLoading === request._id ? (
                                                            <Loader2 className="w-3 h-3 animate-spin" />
                                                        ) : (
                                                            <CheckCircle className="w-3 h-3" />
                                                        )}
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(request._id, "rejected")}
                                                        disabled={actionLoading === request._id}
                                                        className="px-3 py-1.5 bg-white border border-red-200 text-red-600 rounded-lg text-xs font-bold hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                                                    >
                                                        <XCircle className="w-3 h-3" />
                                                        Reject
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}
