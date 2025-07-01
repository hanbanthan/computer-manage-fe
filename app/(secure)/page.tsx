'use client'

import { useEffect } from "react";
import useUserService from "../_services/useUserService"
import Spinner from "../_components/spinner";
import Link from "next/link";

export default function Home() {
    const userService = useUserService();
    const user = userService.currentUser;

    useEffect(() => {
            userService.getCurrent();
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