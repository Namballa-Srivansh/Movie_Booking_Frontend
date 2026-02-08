"use client";

import { Search, Menu, Bell } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/app/routes";
import { useAuth } from "@/app/context/AuthContext";
import { PlusCircle } from "lucide-react";

export default function Navbar({ transparent = false }: { transparent?: boolean }) {
    const { user, isAuthenticated, isLoading, logout } = useAuth();
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);

    const userRole = (user?.userRole || user?.role || "").toLowerCase();
    const canCreateMovie = userRole === "owner" || userRole === "admin";

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const isTransparent = transparent && !scrolled;
    const textColor = isTransparent ? "text-slate-100 hover:text-white" : "text-slate-700 hover:text-indigo-600";
    const logoColor = isTransparent ? "text-white" : "bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent";

    return (
        <nav
            className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled
                ? "bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm"
                : "bg-transparent"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

                <Link href={ROUTES.HOME} className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center">
                        <span className="text-white font-bold text-xl">M</span>
                    </div>
                    <span className={`text-2xl font-bold tracking-tight ${logoColor}`}>
                        MovieBook
                    </span>
                </Link>

                <div className={`hidden md:flex items-center gap-8 text-xl font-medium transition-colors ${isTransparent ? "text-slate-200" : "text-slate-700"}`}>
                    {pathname === ROUTES.MOVIES ? (
                        <Link href={ROUTES.HOME} className={textColor}>Home</Link>
                    ) : (
                        <Link href={ROUTES.MOVIES} className={textColor}>Movies</Link>
                    )}
                    <a href="#" className={textColor}>Theaters</a>
                    <a href="#" className={textColor}>Bookings</a>

                    {isAuthenticated && canCreateMovie && (
                        <div className="flex items-center gap-4">
                            <Link
                                href={ROUTES.CREATE_MOVIE}
                                className={`flex items-center gap-1.5 font-semibold transition-colors ${isTransparent ? "text-indigo-400 hover:text-indigo-300" : "text-indigo-600 hover:text-indigo-700"}`}
                            >
                                <PlusCircle className="w-5 h-5" />
                                <span>Create Movie</span>
                            </Link>
                            {pathname !== ROUTES.CREATE_THEATRE && (
                                <Link
                                    href={ROUTES.CREATE_THEATRE}
                                    className={`flex items-center gap-1.5 font-semibold transition-colors ${isTransparent ? "text-indigo-400 hover:text-indigo-300" : "text-indigo-600 hover:text-indigo-700"}`}
                                >
                                    <PlusCircle className="w-5 h-5" />
                                    <span>Create Theatre</span>
                                </Link>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    <button className={`p-2 transition-colors rounded-full ${isTransparent ? "text-slate-200 hover:bg-white/10 hover:text-white" : "text-slate-600 hover:bg-slate-100 hover:text-indigo-600"}`}>
                        <Search className="w-5 h-5" />
                    </button>

                    {isLoading ? null : isAuthenticated ? (
                        <div className="flex items-center gap-4">
                            <button
                                onClick={logout}
                                className={`px-5 py-2 rounded-full border text-sm font-medium transition-all ${isTransparent
                                    ? "border-slate-500 text-slate-200 hover:bg-white/10 hover:text-white hover:border-white"
                                    : "border-slate-200 text-slate-700 hover:bg-slate-50"
                                    }`}
                            >
                                Logout
                            </button>
                            <Link href={ROUTES.PROFILE} className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 p-0.5 block">
                                <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                                    {user?.profilePicture ? (
                                        <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-indigo-600 font-bold text-lg">
                                            {user?.name?.charAt(0).toUpperCase() || user?.username?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U"}
                                        </span>
                                    )}
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

                    <button className={`md:hidden p-2 transition-colors ${isTransparent ? "text-slate-200 hover:text-white" : "text-slate-600 hover:text-indigo-600"}`}>
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </nav>
    );
}
