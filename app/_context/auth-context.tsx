'use client';

import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";
import { createContext, useContext } from "react";
import { env } from "../_helpers/config";


interface AuthContextType {
    token: string | null;
}

const AuthContext = createContext<AuthContextType>({ token: null });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function  validateSession() {
            try {
                const response = await fetch(`${env.be.url}/api/auth/status`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                    },
                    credentials: 'include', 
                });

                 console.log("Status response:", response.status);

                if (response.ok) {
                    setIsAuthenticated(true);
                } else if (response.status === 401) {
                    const refreshResponse = await fetch(`${env.be.url}/api/auth/refresh`, {
                        method: 'GET',
                        credentials: 'include',
                    });
                    
                    if (refreshResponse.ok) {
                        setIsAuthenticated(true);
                    } else {
                        setIsAuthenticated(false);
                        redirect('/account/login');
                    }
                } else {
                    setIsAuthenticated(false);
                    redirect('/account/login');
                }
            } catch {
                redirect('/account/login');
            } finally {
                setLoading(false);
            }
        }
        validateSession();
    }, []);

    if (loading) return null;
    
    return (
        <AuthContext.Provider value={{ isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
}

