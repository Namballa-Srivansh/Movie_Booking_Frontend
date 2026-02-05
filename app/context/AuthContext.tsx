"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/app/routes";

interface User {
    id?: string;
    name?: string;
    email?: string;
    role?: string;
    [key: string]: any;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (userData: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Check local storage on mount
        const initAuth = async () => {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                try {
                    const parsedUser = JSON.parse(storedUser);

                    // Verify with backend
                    const { verifyUser } = await import("@/app/services/auth");
                    try {
                        const verifiedUser = await verifyUser(parsedUser);

                        // If backend returns a new user object, use it, otherwise use the stored one if valid
                        const userFromBackend = verifiedUser?.data || verifiedUser;

                        // Preserve token if not returned by backend
                        if (userFromBackend && !userFromBackend.token && parsedUser?.token) {
                            userFromBackend.token = parsedUser.token;
                        }

                        const finalUser = userFromBackend || parsedUser;

                        setUser(finalUser);
                        setIsAuthenticated(true);
                        // Update local storage with fresh data if available
                        localStorage.setItem("user", JSON.stringify(finalUser));
                    } catch (verifyError: any) {
                        console.error("Token verification failed:", verifyError);

                        // Fail-open strategy:
                        // If it's a server error (500) or network error, don't logout immediately.
                        const errorMessage = verifyError.message || "";
                        if (errorMessage.includes("500") || errorMessage.includes("Network Error")) {
                            console.warn("Server invalid or unreachable (500), preserving local session.");
                            setUser(parsedUser);
                            setIsAuthenticated(true);
                        } else {
                            // Only logout if we are sure the token is invalid (e.g. 401, 403)
                            localStorage.removeItem("user");
                            setUser(null);
                            setIsAuthenticated(false);
                        }
                    }
                } catch (error) {
                    console.error("Failed to parse user from local storage", error);
                    localStorage.removeItem("user");
                } finally {
                    setIsLoading(false);
                }
            } else {
                console.log("No stored user found in localStorage");
                setIsLoading(false);
            }
        };

        initAuth().finally(() => {
            // Ensure loading is set to false if it wasn't already (though logic above covers most cases, safety net)
            if (!localStorage.getItem("user")) setIsLoading(false);
        });
    }, []);

    const login = (userData: any) => {
        const userToSet = userData?.data || userData;
        setUser(userToSet);
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(userToSet));
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("user");
        router.push(ROUTES.HOME);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
