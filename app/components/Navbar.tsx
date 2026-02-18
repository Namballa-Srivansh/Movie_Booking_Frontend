"use client";

import { Search, Menu, Bell } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ROUTES } from "@/app/routes";
import { useAuth } from "@/app/context/AuthContext";
import { PlusCircle } from "lucide-react";

export default function Navbar({ transparent = false }: { transparent?: boolean }) {
    const { user, isAuthenticated, isLoading, logout } = useAuth();
    const pathname = usePathname();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();
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

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setIsSearchOpen(false);
            setSearchQuery("");
        }
    };

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
                    <span className={`text-2xl font-bold tracking-tight ${logoColor} ${isSearchOpen ? 'hidden md:block' : ''}`}>
                        MovieBook
                    </span>
                </Link>

                {!isSearchOpen && (
                    <div className={`hidden md:flex items-center gap-8 text-xl font-medium transition-colors ${isTransparent ? "text-slate-200" : "text-slate-700"}`}>
                        {pathname === ROUTES.MOVIES ? (
                            <Link href={ROUTES.HOME} className={textColor}>Home</Link>
                        ) : (
                            <Link href={ROUTES.MOVIES} className={textColor}>Movies</Link>
                        )}
                        {pathname === ROUTES.THEATRES ? (
                            <Link href={ROUTES.HOME} className={textColor}>Home</Link>
                        ) : (
                            <Link href={ROUTES.THEATRES} className={textColor}>Theaters</Link>
                        )}
                        {pathname === ROUTES.SHOWS ? (
                            <Link href={ROUTES.HOME} className={textColor}>Home</Link>
                        ) : (
                            <Link href={ROUTES.SHOWS} className={textColor}>Shows</Link>
                        )}
                        {pathname === ROUTES.BOOKINGS ? (
                            <Link href={ROUTES.HOME} className={textColor}>Home</Link>
                        ) : (
                            <Link href={ROUTES.BOOKINGS} className={textColor}>Bookings</Link>
                        )}
                        {userRole === "admin" && (
                            pathname === "/admin/bookings" ? (
                                <Link href={ROUTES.HOME} className={textColor}>Home</Link>
                            ) : (
                                <Link href="/admin/bookings" className={textColor}>All Bookings</Link>
                            )
                        )}


                        {isAuthenticated && canCreateMovie && (
                            <div className="flex items-center gap-4">
                                {(pathname.startsWith(ROUTES.MOVIES) || pathname.startsWith("/movie")) && (
                                    <Link
                                        href={ROUTES.CREATE_MOVIE}
                                        className={`flex items-center gap-1.5 font-semibold transition-colors ${isTransparent ? "text-indigo-400 hover:text-indigo-300" : "text-indigo-600 hover:text-indigo-700"}`}
                                    >
                                        <PlusCircle className="w-5 h-5" />
                                        <span>Create Movie</span>
                                    </Link>
                                )}
                                {pathname.startsWith(ROUTES.THEATRES) && pathname !== ROUTES.CREATE_THEATRE && (
                                    <Link
                                        href={ROUTES.CREATE_THEATRE}
                                        className={`flex items-center gap-1.5 font-semibold transition-colors ${isTransparent ? "text-indigo-400 hover:text-indigo-300" : "text-indigo-600 hover:text-indigo-700"}`}
                                    >
                                        <PlusCircle className="w-5 h-5" />
                                        <span>Create Theatre</span>
                                    </Link>
                                )}
                                {pathname.startsWith(ROUTES.SHOWS) && pathname !== ROUTES.CREATE_SHOW && (
                                    <Link
                                        href={ROUTES.CREATE_SHOW}
                                        className={`flex items-center gap-1.5 font-semibold transition-colors ${isTransparent ? "text-indigo-400 hover:text-indigo-300" : "text-indigo-600 hover:text-indigo-700"}`}
                                    >
                                        <PlusCircle className="w-5 h-5" />
                                        <span>Create Show</span>
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    {/* Search Input Area */}
                    <div className={`flex items-center transition-all duration-300 ${isSearchOpen ? 'w-full absolute inset-x-0 px-6 bg-white h-20 z-50 md:relative md:w-auto md:bg-transparent md:p-0' : 'w-auto'}`}>
                        {isSearchOpen ? (
                            <form onSubmit={handleSearchSubmit} className="flex-grow flex items-center gap-2 relative">
                                <Search className="w-5 h-5 text-slate-400 absolute left-3" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search movies, theatres, genres..."
                                    className="w-full pl-10 pr-10 py-2 rounded-full border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800 placeholder:text-slate-400"
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }}
                                    className="p-1 hover:bg-slate-100 rounded-full text-slate-500 absolute right-2"
                                >
                                    <span className="sr-only">Close</span>
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </form>
                        ) : (
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className={`p-2 transition-colors rounded-full ${isTransparent ? "text-slate-200 hover:bg-white/10 hover:text-white" : "text-slate-600 hover:bg-slate-100 hover:text-indigo-600"}`}
                            >
                                <Search className="w-5 h-5" />
                            </button>
                        )}
                    </div>

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
