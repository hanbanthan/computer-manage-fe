import { auth } from "@/app/_helpers/server/auth";
import { redirect } from "next/navigation";

export default async function Layout({ children }: { children: React.ReactNode }) {
    const isAllowed = await auth.hasRole(['admin', 'superadmin']);

    if (!isAllowed) {
        redirect('/unauthorized');
    }

    return <>{children}</>;
}