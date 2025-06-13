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
    token, 
    children,
}: {
    token: string | null;
    children: React.ReactNode;
}) => {
    const [authToken, setAuthToken] = useState<string | null>(token);

    useEffect(() => {

        if (!token) {
            console.log("No token → redirect");
            redirect('/account/login');
            return;
        }

        async function  validateToken() {
            console.log("Checking token status...");
            try {
                const response = await fetch(`${env.be.url}/api/auth/status`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    },
                    credentials: 'include', 
                });

                 console.log("Status response:", response.status);

                if (response.ok) {
                    console.log("Access token is valid.");
                    setAuthToken(token);
                } else if (response.status === 401) {
                    console.log("Access token is invalid, trying refresh...");
                    const refreshResponse = await fetch(`${env.be.url}/api/auth/refresh`, {
                        method: 'GET',
                        credentials: 'include',
                    });
                    
                    console.log("Refresh response:", refreshResponse.status);
                    if (refreshResponse.ok) {
                        const data = await refreshResponse.json();
                        const newToken = data.accessToken;
                        console.log("Refresh successful, new token:", newToken);
                        setAuthToken(newToken);
                    } else {
                        console.log("Refresh failed.");
                        setAuthToken(null);
                        redirect('/account/login');
                    }
                } else {
                    console.log("Unexpected status from /status");
                    setAuthToken(null);
                    redirect('/account/login');
                }
            } catch (error) {
                 console.error("Token validation error:", error);
                setAuthToken(null);
                redirect('/account/login');
            }
        }
        validateToken();
    }, [token]);

    if (!authToken) return null;
    
    return (
        <AuthContext.Provider value={{ token: authToken }}>
            {children}
        </AuthContext.Provider>
    );
}


