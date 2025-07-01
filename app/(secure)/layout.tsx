// import { redirect } from "next/navigation";
//import { cookies, headers } from "next/headers";
import { cookies } from "next/headers";
// import { auth } from "../_helpers/server/auth";
import Nav from "../_components/nav";
import Alert from "../_components/alert";
import React from "react";
import { AuthProvider } from "../_context/auth-context";

export default async function Layout({ children }: { children: React.ReactNode }) {
    // const isAuthenticated = await auth.isAuthenticated();
    const cookieStore = cookies();
    const accessToken = (await cookieStore).get("authorization")?.value ?? null;
    // if (!isAuthenticated) {
    //     const headersList = await headers();
    //     const returnUrl = encodeURIComponent(headersList.get('x-invoke-path') || '/');
    //     redirect(`/account/login?returnUrl=${returnUrl}`);
    // }

    return (
        <AuthProvider token={accessToken}>
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