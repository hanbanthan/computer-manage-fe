// export const dynamic = 'force-dynamic';

// import { auth } from "@/app/_helpers/server/auth";
// import { redirect } from "next/navigation";

export default async function Layout({ children }: { children: React.ReactNode }) {
    // console.log("🔒 Auth layout is running...");
    // const isAllowed = await auth.hasRole(['admin', 'superadmin']);

    // if (!isAllowed) {
    //     console.log("🚫 Not allowed. Redirecting...");
    //     redirect('/unauthorized');
    // }

    return <>{children}</>;
}