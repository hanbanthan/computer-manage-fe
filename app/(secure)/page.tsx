'use client'

import { useEffect } from "react";
import useUserService from "../_services/useUserService"
import Spinner from "../_components/spinner";
import Link from "next/link";
import { useAuth } from "../_context/auth-context";

export default function Home() {
    const { token } = useAuth();
    const userService = useUserService();
    const user = userService.currentUser;

    useEffect(() => {
        if (token) {
            userService.getCurrent(token);
        }
    }, []);

    if (user) {
        return (
            <>
                <h1>Hi {user.username}</h1>
                <p>You&apos;re logged in!!</p>
                <p><Link href="/computers">Manage Computers</Link></p>
            </>
        );
    } else {
        return <Spinner />
    }
}