import Nav from "../_components/nav";
import Alert from "../_components/alert";
import React from "react";
import { AuthProvider } from "../_context/auth-context";

export default async function Layout({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <div className="app-container bg-light">
                <Nav />
                <Alert />
                <div className="p-4">
                    <div className="container">
                        {children}
                    </div>
                </div>
            </div>
        </AuthProvider>
    );
}