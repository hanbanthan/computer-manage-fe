import Alert from "@/app/_components/Alert";
import { auth } from "@/app/_helpers/server/auth";
import { redirect } from "next/navigation";

export default function Layout({ children }: {children: React.ReactNode}) {
    // if (auth.isAuthenticated()) {
    //     redirect('/');
    // }
    return (
        <>
            <Alert />
            <div className="col-md-6 offset-md-3 mt-5">
                {children}
            </div>
        </>
    );
}