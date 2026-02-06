"use client";

import { Search, Menu, Bell } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ROUTES } from "@/app/routes";
import { useAuth } from "@/app/context/AuthContext";

export default function Navbar() {
    const { user, isAuthenticated, isLoading, logout } = useAuth();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled
                ? "bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm"
                : "bg-transparent"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link href={ROUTES.HOME} className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center">
                        <span className="text-white font-bold text-xl">M</span>
                    </div>
                    <span className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent tracking-tight">
                        MovieBook
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8 text-xl font-medium text-slate-700">
                    <a href="#" className="hover:text-indigo-600 transition-colors">Movies</a>
                    <a href="#" className="hover:text-indigo-600 transition-colors">Theaters</a>
                    <a href="#" className="hover:text-indigo-600 transition-colors">Bookings</a>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <button className="p-2 text-slate-600 hover:text-indigo-600 transition-colors rounded-full hover:bg-slate-100">
                        <Search className="w-5 h-5" />
                    </button>

                    {isLoading ? null : isAuthenticated ? (
                        <div className="flex items-center gap-4">
                            <button
                                onClick={logout}
                                className="px-5 py-2 rounded-full border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-all"
                            >
                                Logout
                            </button>
                            <Link href={ROUTES.PROFILE} className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 p-0.5 block">
                                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                                    <span className="text-indigo-600 font-bold text-lg">
                                        {user?.name?.charAt(0).toUpperCase() || user?.username?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U"}
                                    </span>
                                </div>
                            </Link>
                        </div>
                    ) : (
                        <>
                            <Link href={ROUTES.SIGNUP} className="hidden sm:block px-5 py-2 rounded-full bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 shadow-sm hover:shadow transition-all">
                                Sign Up
                            </Link>

                            <Link href={ROUTES.LOGIN} className="hidden sm:block px-5 py-2 rounded-full bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 shadow-sm hover:shadow transition-all">
                                Sign In
                            </Link>
                        </>
                    )}

                    <button className="md:hidden p-2 text-slate-600 hover:text-indigo-600">
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </nav>
    );
}

