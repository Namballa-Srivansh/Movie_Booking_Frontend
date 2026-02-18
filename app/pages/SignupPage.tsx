"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Chrome, ChevronDown, Loader2 } from "lucide-react";
import { ROUTES } from "@/app/routes";
import { useRouter } from "next/navigation";
import { signupUser } from "@/app/services/auth";
import { useAuth } from "@/app/context/AuthContext";

const USER_ROLE = {
    customer: "customer",
    owner: "owner",
    admin: "admin"
};

const USER_STATUS = {
    approved: "approved",
    pending: "pending",
    rejected: "rejected"
};

export default function SignupPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        userRole: USER_ROLE.customer,
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [apiError, setApiError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
        if (apiError) setApiError(null);
    };

    const validate = () => {
        const newErrors: { [key: string]: string } = {};

        // Name validation
        if (!formData.name.trim()) newErrors.name = "Name is required";

        // Email validation
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Please fill a valid email address";
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        // Confirm Password validation
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setApiError(null);

        if (validate()) {
            setIsLoading(true);
            try {
                const data = await signupUser({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    userRole: formData.userRole,
                    userStatus: USER_STATUS.approved
                });

                console.log("Signup successful:", data);

                // Redirect to Login page on success
                router.push(ROUTES.LOGIN);

            } catch (error: any) {
                console.error("Signup error:", error);
                setApiError(error.message || "Failed to connect to the server");
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 sm:p-12 border border-slate-100">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex items-center gap-2 mb-8 justify-center">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <span className="text-white font-bold text-2xl">M</span>
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent tracking-tight">
                            MovieBook
                        </span>
                    </div>

                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight text-center">
                        Create your account
                    </h2>
                    <p className="mt-2 text-slate-500 text-center text-sm">
                        Join thousands of movie lovers and get exclusive access.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="space-y-6 mt-8"
                >
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {apiError && (
                            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm text-center font-medium">
                                {apiError}
                            </div>
                        )}

                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Full Name"
                                disabled={isLoading}
                                className={`w-full bg-slate-50 border ${errors.name ? 'border-red-500' : 'border-slate-200'} rounded-xl px-12 py-3.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed`}
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1 ml-1">{errors.name}</p>}
                        </div>

                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email address"
                                disabled={isLoading}
                                className={`w-full bg-slate-50 border ${errors.email ? 'border-red-500' : 'border-slate-200'} rounded-xl px-12 py-3.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed`}
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>}
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Password"
                                disabled={isLoading}
                                className={`w-full bg-slate-50 border ${errors.password ? 'border-red-500' : 'border-slate-200'} rounded-xl px-12 py-3.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed`}
                            />
                            {errors.password && <p className="text-red-500 text-xs mt-1 ml-1">{errors.password}</p>}
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm Password"
                                disabled={isLoading}
                                className={`w-full bg-slate-50 border ${errors.confirmPassword ? 'border-red-500' : 'border-slate-200'} rounded-xl px-12 py-3.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed`}
                            />
                            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 ml-1">{errors.confirmPassword}</p>}
                        </div>

                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 flex items-center justify-center pointer-events-none">
                                <ChevronDown className="w-5 h-5" />
                            </div>
                            <select
                                name="userRole"
                                value={formData.userRole}
                                onChange={handleChange}
                                disabled={isLoading}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-12 py-3.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >

                                <option value={USER_ROLE.owner}>Owner</option>
                                <option value={USER_ROLE.customer}>Customer</option>

                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-indigo-500/30 flex items-center justify-center gap-2 group mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Creating Account...
                                </>
                            ) : (
                                <>
                                    Sign Up
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
