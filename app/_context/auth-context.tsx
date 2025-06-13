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
            redirect('/account/login');
            return;
        }

        async function  validateToken() {
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
                    setAuthToken(token);
                } else if (response.status === 401) {
                    const refreshResponse = await fetch(`${env.be.url}/api/auth/refresh`, {
                        method: 'GET',
                        credentials: 'include',
                    });
                    
                    if (refreshResponse.ok) {
                        const data = await refreshResponse.json();
                        const newToken = data.accessToken;
                        setAuthToken(newToken);
                    } else {
                        setAuthToken(null);
                        redirect('/account/login');
                    }
                } else {
                    setAuthToken(null);
                    redirect('/account/login');
                }
            } catch (error) {
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


