import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "../_helpers/server/auth";
import Nav from "../_components/Nav";
import Alert from "../_components/Alert";

export default async function Layout({ children }: { children: React.ReactNode }) {
    if (!auth.isAuthenticated()) {
        const headersList = await headers();
        const returnUrl = encodeURIComponent(headersList.get('x-invoke-path') || '/');
        redirect(`/account/login?returnUrl=${returnUrl}`);
    }

    return (
        <div className="app-container bg-light">
            <Nav />
            <Alert />
            <div className="p-4">
                <div className="container">
                    {children}
                </div>
            </div>
        </div>
    );
}