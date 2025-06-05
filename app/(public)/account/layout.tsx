import Alert from "@/app/_components/alert";
import { auth } from "@/app/_helpers/server/auth";
import { redirect } from "next/navigation";


export default Layout;

async function Layout({ children }: { children: React.ReactNode }) {
    if (await auth.isAuthenticated()) {
        redirect('/');
    }

    return (
        <>
            <Alert />
            <div className="col-md-6 offset-md-3 mt-5">
                {children}
            </div>
        </>
    );
}