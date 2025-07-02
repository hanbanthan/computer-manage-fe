'use client';

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { createContext, useContext } from "react";
import { env } from "../_helpers/config";

interface User {
    user_id: string;
    username: string;
    role: string;

}

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
}

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    user: null
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        async function validateSession() {
            try {
                const response = await fetch(`${env.be.url}/api/auth/status`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                    },
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();
                    setUser(data.user);
                    setIsAuthenticated(true);
                }

                if (response.status === 401) {
                    const refreshResponse = await fetch(`${env.be.url}/api/auth/refresh`, {
                        method: 'GET',
                        credentials: 'include',
                    });

                    if (refreshResponse.ok) {
                        const userResponse = await fetch(`${env.be.url}/api/auth/status`, {
                            method: 'GET',
                            credentials: 'include',
                            headers: { 'Accept': 'application/json' },
                        });

                        if (userResponse.ok) {
                            const userData = await userResponse.json();
                            setUser(userData.user);
                            setIsAuthenticated(true);
                            return;
                        }
                    }

                    setUser(null);
                    setIsAuthenticated(false);
                    router.replace('/account/login');
                }
            } catch {
                setUser(null);
                setIsAuthenticated(false);
                router.replace('/account/login');
            } finally {
                setLoading(false);
            }
        }
        validateSession();
    }, [router]);

    if (loading) return null;

    return (
        <AuthContext.Provider value={{ isAuthenticated, user }}>
            {children}
        </AuthContext.Provider>
    );
}

