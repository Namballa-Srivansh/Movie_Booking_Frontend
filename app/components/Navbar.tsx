"use client";

import { Search, Menu, Bell } from "lucide-react";
import { useState, useEffect } from "react";

export default function Navbar() {
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
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center">
                        <span className="text-white font-bold text-xl">M</span>
                    </div>
                    <span className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent tracking-tight">
                        MovieBook
                    </span>
                </div>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-700">
                    <a href="#" className="hover:text-indigo-600 transition-colors">Movies</a>
                    <a href="#" className="hover:text-indigo-600 transition-colors">Theaters</a>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <button className="p-2 text-slate-600 hover:text-indigo-600 transition-colors rounded-full hover:bg-slate-100">
                        <Search className="w-5 h-5" />
                    </button>

                    <button className="hidden sm:block px-5 py-2 rounded-full bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 shadow-sm hover:shadow transition-all">
                        Sign In
                    </button>

                    <button className="md:hidden p-2 text-slate-600 hover:text-indigo-600">
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </nav>
    );
}
